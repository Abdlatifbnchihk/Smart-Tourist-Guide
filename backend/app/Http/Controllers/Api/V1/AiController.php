<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\GenerateItineraryRequest;
use App\Http\Resources\ItineraryResource;
use App\Services\AiItineraryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class AiController extends Controller
{
    public function __construct(
        private AiItineraryService $itineraryService
    ) {}

    /**
     * Generate an AI-powered itinerary.
     */
    public function generateItinerary(GenerateItineraryRequest $request)
    {
        try {
            $itinerary = $this->itineraryService->generate($request->validated());

            return new ItineraryResource($itinerary);
        } catch (\RuntimeException $e) {
            $status = match (true) {
                str_contains($e->getMessage(), 'GROQ_API_KEY') => Response::HTTP_INTERNAL_SERVER_ERROR,
                str_contains($e->getMessage(), 'Rate limit') => Response::HTTP_TOO_MANY_REQUESTS,
                str_contains($e->getMessage(), 'temporarily unavailable') => Response::HTTP_SERVICE_UNAVAILABLE,
                default => Response::HTTP_INTERNAL_SERVER_ERROR,
            };

            return response()->json([
                'message' => $e->getMessage(),
            ], $status);
        }
    }
}
