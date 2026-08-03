<?php

namespace App\Http\Controllers\Api\V1\Hotel;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRoomRequest;
use App\Http\Requests\UpdateRoomRequest;
use App\Http\Resources\RoomResource;
use App\Models\Hotel;
use App\Models\Room;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class RoomController extends Controller
{
    /**
     * List rooms for a hotel.
     */
    public function index(Request $request, string $hotelId)
    {
        $hotel = Hotel::findOrFail($hotelId);

        $query = $hotel->rooms();

        if ($request->has('type')) {
            $query->where('type', 'LIKE', '%'.$request->type.'%');
        }

        if ($request->has('available')) {
            $query->where('available', $request->boolean('available'));
        }

        if ($request->has('min_price')) {
            $query->where('price_per_night', '>=', $request->min_price);
        }

        if ($request->has('max_price')) {
            $query->where('price_per_night', '<=', $request->max_price);
        }

        $query->with('hotel');

        $perPage = $request->get('per_page', 15);
        $rooms = $query->paginate($perPage);

        return RoomResource::collection($rooms);
    }

    /**
     * Store a new room under a hotel.
     */
    public function store(StoreRoomRequest $request, string $hotelId): JsonResponse
    {
        $hotel = Hotel::findOrFail($hotelId);

        if ($request->user()->id !== $hotel->created_by && $request->user()->role !== 'administrator') {
            return response()->json([
                'message' => 'You are not authorized to add rooms to this hotel',
            ], Response::HTTP_FORBIDDEN);
        }

        $validated = $request->validated();
        $validated['hotel_id'] = $hotel->id;

        $room = Room::create($validated);

        return response()->json([
            'message' => 'Room created successfully',
            'room' => new RoomResource($room->load('hotel')),
        ], Response::HTTP_CREATED);
    }

    /**
     * Display a room.
     */
    public function show(string $id)
    {
        $room = Room::with('hotel')->findOrFail($id);

        return new RoomResource($room);
    }

    /**
     * Update a room.
     */
    public function update(UpdateRoomRequest $request, string $id): JsonResponse
    {
        $room = Room::with('hotel')->findOrFail($id);

        if ($request->user()->id !== $room->hotel->created_by && $request->user()->role !== 'administrator') {
            return response()->json([
                'message' => 'You are not authorized to update this room',
            ], Response::HTTP_FORBIDDEN);
        }

        $validated = $request->validated();

        $room->update($validated);

        return response()->json([
            'message' => 'Room updated successfully',
            'room' => new RoomResource($room->fresh('hotel')),
        ]);
    }

    /**
     * Soft delete a room.
     */
    public function destroy(Request $request, string $id): JsonResponse
    {
        $room = Room::with('hotel')->withTrashed()->findOrFail($id);

        if ($request->user()->id !== $room->hotel->created_by && $request->user()->role !== 'administrator') {
            return response()->json([
                'message' => 'You are not authorized to delete this room',
            ], Response::HTTP_FORBIDDEN);
        }

        $room->delete();

        return response()->json([
            'message' => 'Room deleted successfully',
        ]);
    }

    /**
     * Restore a soft-deleted room.
     */
    public function restore(Request $request, string $id): JsonResponse
    {
        $room = Room::with('hotel')->withTrashed()->findOrFail($id);

        if ($request->user()->id !== $room->hotel->created_by && $request->user()->role !== 'administrator') {
            return response()->json([
                'message' => 'You are not authorized to restore this room',
            ], Response::HTTP_FORBIDDEN);
        }

        $room->restore();

        return response()->json([
            'message' => 'Room restored successfully',
            'room' => new RoomResource($room->load('hotel')),
        ]);
    }

    /**
     * Force delete a room (permanent).
     */
    public function forceDestroy(Request $request, string $id): JsonResponse
    {
        $room = Room::with('hotel')->withTrashed()->findOrFail($id);

        if ($request->user()->id !== $room->hotel->created_by && $request->user()->role !== 'administrator') {
            return response()->json([
                'message' => 'You are not authorized to delete this room',
            ], Response::HTTP_FORBIDDEN);
        }

        $room->forceDelete();

        return response()->json([
            'message' => 'Room permanently deleted',
        ]);
    }
}
