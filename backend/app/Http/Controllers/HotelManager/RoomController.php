<?php

namespace App\Http\Controllers\HotelManager;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRoomRequest;
use App\Http\Requests\UpdateRoomRequest;
use App\Http\Resources\RoomResource;
use App\Models\Room;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class RoomController extends Controller
{
    public function index(Request $request)
    {
        $rooms = Room::whereHas('hotel', function ($query) use ($request) {
            $query->where('created_by', $request->user()->id);
        })->paginate(15);

        return RoomResource::collection($rooms);
    }

    public function store(StoreRoomRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $room = Room::create($validated);

        return response()->json([
            'message' => 'Room created successfully',
            'room' => new RoomResource($room),
        ], Response::HTTP_CREATED);
    }

    public function show(Room $room, Request $request)
    {
        if ($room->hotel->created_by !== $request->user()->id) {
            return response()->json([
                'message' => 'You are not authorized to view this room',
            ], Response::HTTP_FORBIDDEN);
        }

        return new RoomResource($room->load('hotel'));
    }

    public function update(UpdateRoomRequest $request, Room $room): JsonResponse
    {
        if ($room->hotel->created_by !== $request->user()->id) {
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

    public function destroy(Room $room, Request $request): JsonResponse
    {
        if ($room->hotel->created_by !== $request->user()->id) {
            return response()->json([
                'message' => 'You are not authorized to delete this room',
            ], Response::HTTP_FORBIDDEN);
        }

        $room->delete();

        return response()->json([
            'message' => 'Room deleted successfully',
        ]);
    }

    public function restore($room, Request $request): JsonResponse
    {
        $room = Room::withTrashed()->findOrFail($room);

        if ($room->hotel->created_by !== $request->user()->id) {
            return response()->json([
                'message' => 'You are not authorized to restore this room',
            ], Response::HTTP_FORBIDDEN);
        }

        $room->restore();

        return response()->json([
            'message' => 'Room restored successfully',
            'room' => new RoomResource($room->fresh('hotel')),
        ]);
    }

    public function forceDelete($room, Request $request): JsonResponse
    {
        $room = Room::withTrashed()->findOrFail($room);

        if ($room->hotel->created_by !== $request->user()->id) {
            return response()->json([
                'message' => 'You are not authorized to permanently delete this room',
            ], Response::HTTP_FORBIDDEN);
        }

        $room->forceDelete();

        return response()->json([
            'message' => 'Room permanently deleted successfully',
        ]);
    }

    public function trashed(Request $request)
    {
        $rooms = Room::whereHas('hotel', function ($query) use ($request) {
            $query->where('created_by', $request->user()->id);
        })->onlyTrashed()
          ->with('hotel')
          ->paginate(15);

        return RoomResource::collection($rooms);
    }
}
