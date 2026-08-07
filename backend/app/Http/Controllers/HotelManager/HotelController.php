<?php

namespace App\Http\Controllers\HotelManager;

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
    public function index(Request $request)
    {
        $hotels = Hotel::where('created_by', $request->user()->id)
            ->with('city')
            ->withCount('rooms')
            ->paginate(15);

        return HotelResource::collection($hotels);
    }

    public function store(StoreHotelRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $validated['created_by'] = $request->user()->id;

        $hotel = Hotel::create($validated);

        return response()->json([
            'message' => 'Hotel created successfully',
            'hotel' => new HotelResource($hotel->load('city')),
        ], Response::HTTP_CREATED);
    }

    public function show(Hotel $hotel, Request $request)
    {
        if ($hotel->created_by !== $request->user()->id) {
            return response()->json([
                'message' => 'You are not authorized to view this hotel',
            ], Response::HTTP_FORBIDDEN);
        }

        $hotel->load(['city', 'rooms', 'reviews.user']);

        return new HotelResource($hotel);
    }

    public function update(UpdateHotelRequest $request, Hotel $hotel): JsonResponse
    {
        if ($hotel->created_by !== $request->user()->id) {
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

    public function destroy(Hotel $hotel, Request $request): JsonResponse
    {
        if ($hotel->created_by !== $request->user()->id) {
            return response()->json([
                'message' => 'You are not authorized to delete this hotel',
            ], Response::HTTP_FORBIDDEN);
        }

        $hotel->delete();

        return response()->json([
            'message' => 'Hotel deleted successfully',
        ]);
    }

    public function restore($hotel, Request $request): JsonResponse
    {
        $hotel = Hotel::withTrashed()->findOrFail($hotel);

        if ($hotel->created_by !== $request->user()->id) {
            return response()->json([
                'message' => 'You are not authorized to restore this hotel',
            ], Response::HTTP_FORBIDDEN);
        }

        $hotel->restore();

        return response()->json([
            'message' => 'Hotel restored successfully',
            'hotel' => new HotelResource($hotel->fresh(['city'])),
        ]);
    }

    public function forceDelete($hotel, Request $request): JsonResponse
    {
        $hotel = Hotel::withTrashed()->findOrFail($hotel);

        if ($hotel->created_by !== $request->user()->id) {
            return response()->json([
                'message' => 'You are not authorized to permanently delete this hotel',
            ], Response::HTTP_FORBIDDEN);
        }

        $hotel->forceDelete();

        return response()->json([
            'message' => 'Hotel permanently deleted successfully',
        ]);
    }

    public function trashed(Request $request)
    {
        $hotels = Hotel::where('created_by', $request->user()->id)
            ->onlyTrashed()
            ->with('city')
            ->withCount('rooms')
            ->paginate(15);

        return HotelResource::collection($hotels);
    }
}