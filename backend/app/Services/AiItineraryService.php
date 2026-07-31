<?php

namespace App\Services;

use App\Models\City;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AiItineraryService
{
    private string $apiKey;

    private string $apiUrl = 'https://api.groq.com/openai/v1/chat/completions';

    private string $model = 'openai/gpt-oss-120b';

    public function __construct()
    {
        $this->apiKey = config('services.groq.api_key', '');
    }

    /**
     * Generate an itinerary based on user preferences.
     */
    public function generate(array $data): array
    {
        $cacheKey = $this->buildCacheKey($data);

        return $this->getCachedItinerary($cacheKey, function () use ($data) {
            $city = City::findOrFail($data['city_id']);
            $attractions = $this->getAttractions($city->id);
            $prompt = $this->buildPrompt($city, $attractions, $data);
            $response = $this->callGroqApi($prompt);

            return $this->parseResponse($response, $city, $data);
        });
    }

    /**
     * Get attractions for a city using raw query.
     */
    private function getAttractions(int $cityId): \Illuminate\Support\Collection
    {
        return DB::table('attractions')
            ->where('city_id', $cityId)
            ->get(['name', 'description', 'address', 'opening_hours', 'average_rating']);
    }

    /**
     * Build the prompt for Groq API.
     */
    private function buildPrompt(City $city, \Illuminate\Support\Collection $attractions, array $data): string
    {
        $attractionsList = $attractions->map(function ($attraction) {
            return "- {$attraction->name}: {$attraction->description} (Address: {$attraction->address}, Hours: {$attraction->opening_hours}, Rating: {$attraction->average_rating})";
        })->implode("\n");

        $budgetDescriptions = [
            'LOW' => 'budget-friendly, free attractions, low-cost activities, street food, public transport',
            'MEDIUM' => 'mid-range, mix of free and paid attractions, restaurants, some paid activities',
            'HIGH' => 'premium experiences, luxury attractions, fine dining, private tours',
        ];

        $budgetDesc = $budgetDescriptions[$data['budget']] ?? $budgetDescriptions['MEDIUM'];

        return "You are a travel itinerary planner. Generate a detailed {$data['number_of_days']}-day travel itinerary for {$city->name}.

Preferences: {$data['preferences']}
Budget Level: {$data['budget']} ({$budgetDesc})

Available Attractions:
{$attractionsList}

Generate a JSON response with the following structure:
{
  \"itinerary\": [
    {
      \"day\": 1,
      \"theme\": \"Day theme\",
      \"activities\": [
        {
          \"time\": \"09:00\",
          \"attraction\": \"Attraction Name\",
          \"description\": \"Brief description\",
          \"duration\": \"2 hours\",
          \"estimated_cost\": \"70 MAD\",
          \"tips\": \"Helpful tips\"
        }
      ]
    }
  ],
  \"estimated_total_cost\": \"1500 MAD\"
}

Requirements:
- Include only attractions from the list above
- Distribute attractions across days logically
- Include realistic time slots (morning, afternoon, evening)
- Provide practical tips for each activity
- Estimate costs based on budget level
- Return ONLY valid JSON, no additional text";
    }

    /**
     * Call Groq API with the prompt.
     */
    private function callGroqApi(string $prompt): string
    {
        if (empty($this->apiKey)) {
            throw new \RuntimeException('GROQ_API_KEY is not configured');
        }

        $response = Http::withHeaders([
            'Authorization' => "Bearer {$this->apiKey}",
            'Content-Type' => 'application/json',
        ])->timeout(60)->post($this->apiUrl, [
            'model' => $this->model,
            'messages' => [
                [
                    'role' => 'user',
                    'content' => $prompt,
                ],
            ],
            'temperature' => 0.7,
            'max_tokens' => 2000,
        ]);

        if ($response->status() === 429) {
            throw new \RuntimeException('Rate limit exceeded. Please try again later.');
        }

        if ($response->status() === 503) {
            throw new \RuntimeException('AI service is temporarily unavailable.');
        }

        if ($response->failed()) {
            Log::error('Groq API error', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
            throw new \RuntimeException('Failed to generate itinerary. Please try again.');
        }

        return $response->json('choices.0.message.content', '');
    }

    /**
     * Parse the API response into structured itinerary.
     */
    private function parseResponse(string $response, City $city, array $data): array
    {
        $cleaned = trim($response);
        $cleaned = preg_replace('/```json\s*/', '', $cleaned);
        $cleaned = preg_replace('/```\s*$/', '', $cleaned);

        $decoded = json_decode($cleaned, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            Log::error('Failed to parse Groq response', ['response' => $response]);
            throw new \RuntimeException('Failed to parse itinerary response');
        }

        return [
            'city' => $city->name,
            'preferences' => $data['preferences'],
            'budget' => $data['budget'],
            'total_days' => $data['number_of_days'],
            'itinerary' => $decoded['itinerary'] ?? [],
            'estimated_total_cost' => $decoded['estimated_total_cost'] ?? 'N/A',
            'generated_at' => now()->toISOString(),
        ];
    }

    /**
     * Build cache key from request data.
     */
    private function buildCacheKey(array $data): string
    {
        return "itinerary_{$data['city_id']}_{$data['preferences']}_{$data['number_of_days']}_{$data['budget']}";
    }

    /**
     * Get cached itinerary or generate new one.
     */
    private function getCachedItinerary(string $cacheKey, callable $callback): array
    {
        return Cache::remember($cacheKey, now()->addHours(24), $callback);
    }
}
