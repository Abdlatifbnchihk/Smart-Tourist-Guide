<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\GenerateItineraryRequest;
use App\Http\Resources\ItineraryResource;
use App\Jobs\GenerateItineraryJob;
use App\Models\ItineraryJob;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class AiController extends Controller
{
    /**
     * Generate an AI-powered itinerary (dispatches to queue).
     */
    public function generateItinerary(GenerateItineraryRequest $request): JsonResponse
    {
        $itineraryJob = ItineraryJob::create([
            'user_id' => Auth::id(),
            'request_data' => $request->validated(),
            'status' => 'pending',
        ]);

        GenerateItineraryJob::dispatch($itineraryJob);

        return response()->json([
            'job_id' => $itineraryJob->id,
            'status' => 'pending',
            'message' => 'Itinerary generation started. Poll the status endpoint for updates.',
        ], Response::HTTP_ACCEPTED);
    }

    /**
     * Check the status of an itinerary generation job.
     */
    public function getJobStatus(ItineraryJob $itineraryJob): JsonResponse
    {
        if ($itineraryJob->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], Response::HTTP_FORBIDDEN);
        }

        $response = [
            'job_id' => $itineraryJob->id,
            'status' => $itineraryJob->status,
        ];

        if ($itineraryJob->status === 'completed') {
            $response['result'] = $itineraryJob->result;
        } elseif ($itineraryJob->status === 'failed') {
            $response['error'] = $itineraryJob->error;
        }

        return response()->json($response);
    }
}
