<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReviewRequest;
use App\Http\Resources\ReviewResource;
use App\Models\Review;
use App\Services\ReviewService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ReviewController extends Controller
{
    public function __construct(
        private ReviewService $reviewService
    ) {}

    /**
     * Display a listing of reviews with optional filtering.
     */
    public function index(Request $request)
    {
        $query = Review::query();

        if ($request->has('hotel_id')) {
            $query->where('hotel_id', $request->input('hotel_id'));
        }

        if ($request->has('driver_id')) {
            $query->where('driver_id', $request->input('driver_id'));
        }

        if ($request->has('attraction_id')) {
            $query->where('attraction_id', $request->input('attraction_id'));
        }

        $query->with(['user', 'hotel', 'driver', 'attraction']);

        $perPage = $request->get('per_page', 15);
        $reviews = $query->paginate($perPage);

        return ReviewResource::collection($reviews);
    }

    /**
     * Store a newly created review.
     */
    public function store(StoreReviewRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $validated['user_id'] = $request->user()->id;

        try {
            $review = $this->reviewService->create($validated);

            return response()->json([
                'message' => 'Review created successfully',
                'review' => new ReviewResource($review->load(['user', 'hotel', 'driver', 'attraction'])),
            ], Response::HTTP_CREATED);
        } catch (\DomainException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
    }

    /**
     * Display the specified review.
     */
    public function show(Review $review)
    {
        return new ReviewResource($review->load(['user', 'hotel', 'driver', 'attraction']));
    }

    /**
     * Update the specified review.
     */
    public function update(Review $review, Request $request): JsonResponse
    {
        $validated = $request->validate([
            'rating' => 'sometimes|integer|between:1,5',
            'comment' => 'nullable|string|max:1000',
        ]);

        try {
            $review = $this->reviewService->update($review, $validated, $request->user()->id);

            return response()->json([
                'message' => 'Review updated successfully',
                'review' => new ReviewResource($review->fresh(['user', 'hotel', 'driver', 'attraction'])),
            ]);
        } catch (\RuntimeException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], Response::HTTP_FORBIDDEN);
        } catch (\DomainException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
    }

    /**
     * Remove the specified review.
     */
    public function destroy(Review $review, Request $request): JsonResponse
    {
        try {
            $this->reviewService->delete($review, $request->user()->id);

            return response()->json([
                'message' => 'Review deleted successfully',
            ]);
        } catch (\RuntimeException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], Response::HTTP_FORBIDDEN);
        }
    }
}
