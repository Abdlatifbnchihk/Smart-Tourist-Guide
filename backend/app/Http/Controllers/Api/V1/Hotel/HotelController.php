<?php

namespace App\Http\Controllers\Api\V1\Hotel;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreHotelRequest;
use App\Http\Requests\UpdateHotelRequest;
use App\Http\Resources\HotelResource;
use App\Models\Hotel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class HotelController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Hotel::query();

        // Filter by city_id
        if ($request->has('city_id')) {
            $query->where('city_id', $request->city_id);
        }

        // Filter by star rating
        if ($request->has('star_rating')) {
            $query->where('stars', $request->star_rating);
        }

        // Filter by price range (requires join with rooms)
        if ($request->has('min_price') || $request->has('max_price')) {
            $query->whereHas('rooms', function ($q) use ($request) {
                if ($request->has('min_price')) {
                    $q->where('price', '>=', $request->min_price);
                }
                if ($request->has('max_price')) {
                    $q->where('price', '<=', $request->max_price);
                }
            });
        }

        // Search by name
        if ($request->has('search')) {
            $query->where('name', 'LIKE', '%'.$request->search.'%');
        }

        // Eager load city relationship
        $query->with('city');

        // Paginate results
        $perPage = $request->get('per_page', 15);
        $hotels = $query->paginate($perPage);

        return HotelResource::collection($hotels);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreHotelRequest $request): JsonResponse
    {
        $validated = $request->validated();

        // Set the creator
        $validated['created_by'] = $request->user()->id;

        $hotel = Hotel::create($validated);

        return response()->json([
            'message' => 'Hotel created successfully',
            'hotel' => new HotelResource($hotel->load('city')),
        ], Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show(Hotel $hotel)
    {
        $hotel->load(['city', 'rooms', 'reviews.user']);

        return new HotelResource($hotel);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateHotelRequest $request, Hotel $hotel): JsonResponse
    {
        // Check ownership or admin role
        if ($request->user()->id !== $hotel->created_by && $request->user()->role !== 'administrator') {
            return response()->json([
                'message' => 'You are not authorized to update this hotel',
            ], Response::HTTP_FORBIDDEN);
        }

        $validated = $request->validated();

        $hotel->update($validated);

        return response()->json([
            'message' => 'Hotel updated successfully',
            'hotel' => new HotelResource($hotel->fresh(['city', 'rooms', 'reviews.user'])),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Hotel $hotel, Request $request): JsonResponse
    {
        // Check ownership or admin role
        if ($request->user()->id !== $hotel->created_by && $request->user()->role !== 'administrator') {
            return response()->json([
                'message' => 'You are not authorized to delete this hotel',
            ], Response::HTTP_FORBIDDEN);
        }

        $hotel->delete();

        return response()->json([
            'message' => 'Hotel deleted successfully',
        ]);
    }
}
