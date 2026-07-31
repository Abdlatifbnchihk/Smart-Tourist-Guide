<?php

namespace Tests\Feature\Api\V1;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AiControllerTest extends TestCase
{
    use RefreshDatabase;

    private int $userId;

    private int $cityId;

    protected function setUp(): void
    {
        parent::setUp();

        if (DB::getDriverName() === 'sqlite') {
            DB::unprepared('PRAGMA foreign_keys = OFF');
        }

        // Create tourist
        $this->userId = DB::table('users')->insertGetId([
            'first_name' => 'Test',
            'last_name' => 'Tourist',
            'email' => 'tourist@test.com',
            'phone' => '1234567890',
            'password' => bcrypt('password'),
            'role' => 'tourist',
            'status' => 'Approved',
            'active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Create city
        $this->cityId = DB::table('cities')->insertGetId([
            'name' => 'Marrakech',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Create attractions
        DB::table('attractions')->insert([
            [
                'city_id' => $this->cityId,
                'name' => 'Jardin Majorelle',
                'description' => 'Beautiful botanical garden',
                'address' => 'Rue Yves Saint Laurent',
                'opening_hours' => '8:00-18:00',
                'average_rating' => 4.5,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'city_id' => $this->cityId,
                'name' => 'Bahia Palace',
                'description' => 'Historic palace with stunning architecture',
                'address' => 'Rue Si Moussa',
                'opening_hours' => '9:00-17:00',
                'average_rating' => 4.3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // Set API key in config
        config(['services.groq.api_key' => 'test-api-key']);
    }

    public function test_generate_itinerary_successfully(): void
    {
        Sanctum::actingAs(User::find($this->userId));

        // Mock Groq API response
        Http::fake([
            'api.groq.com/*' => Http::response([
                'choices' => [
                    [
                        'message' => [
                            'content' => json_encode([
                                'itinerary' => [
                                    [
                                        'day' => 1,
                                        'theme' => 'Exploration Day',
                                        'activities' => [
                                            [
                                                'time' => '09:00',
                                                'attraction' => 'Jardin Majorelle',
                                                'description' => 'Visit the beautiful gardens',
                                                'duration' => '2 hours',
                                                'estimated_cost' => '70 MAD',
                                                'tips' => 'Visit early morning',
                                            ],
                                        ],
                                    ],
                                ],
                                'estimated_total_cost' => '500 MAD',
                            ]),
                        ],
                    ],
                ],
            ], 200),
        ]);

        $response = $this->postJson('/api/v1/ai/itinerary', [
            'city_id' => $this->cityId,
            'preferences' => 'adventure',
            'number_of_days' => 1,
            'budget' => 'MEDIUM',
        ]);

        $response->assertOk()
            ->assertJsonPath('data.city', 'Marrakech')
            ->assertJsonPath('data.preferences', 'adventure')
            ->assertJsonPath('data.budget', 'MEDIUM');
    }

    public function test_missing_city_id_validation_error(): void
    {
        Sanctum::actingAs(User::find($this->userId));

        $response = $this->postJson('/api/v1/ai/itinerary', [
            'preferences' => 'adventure',
            'number_of_days' => 1,
            'budget' => 'MEDIUM',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['city_id']);
    }

    public function test_invalid_preferences_validation_error(): void
    {
        Sanctum::actingAs(User::find($this->userId));

        $response = $this->postJson('/api/v1/ai/itinerary', [
            'city_id' => $this->cityId,
            'preferences' => 'invalid',
            'number_of_days' => 1,
            'budget' => 'MEDIUM',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['preferences']);
    }

    public function test_cache_hit_returns_cached(): void
    {
        Sanctum::actingAs(User::find($this->userId));

        $cachedData = [
            'city' => 'Marrakech',
            'preferences' => 'adventure',
            'budget' => 'MEDIUM',
            'total_days' => 1,
            'itinerary' => [],
            'estimated_total_cost' => '500 MAD',
            'generated_at' => now()->toISOString(),
        ];

        Cache::put('itinerary_'.$this->cityId.'_adventure_1_MEDIUM', $cachedData, now()->addHours(24));

        $response = $this->postJson('/api/v1/ai/itinerary', [
            'city_id' => $this->cityId,
            'preferences' => 'adventure',
            'number_of_days' => 1,
            'budget' => 'MEDIUM',
        ]);

        $response->assertOk()
            ->assertJsonPath('data.city', 'Marrakech');
    }

    public function test_missing_api_key_error(): void
    {
        Sanctum::actingAs(User::find($this->userId));

        // Set empty API key
        config(['services.groq.api_key' => '']);

        $response = $this->postJson('/api/v1/ai/itinerary', [
            'city_id' => $this->cityId,
            'preferences' => 'adventure',
            'number_of_days' => 1,
            'budget' => 'MEDIUM',
        ]);

        $response->assertStatus(500)
            ->assertJsonPath('message', 'GROQ_API_KEY is not configured');
    }
}
