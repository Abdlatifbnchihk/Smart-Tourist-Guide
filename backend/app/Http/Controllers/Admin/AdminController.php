<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreUserRequest;
use App\Http\Requests\Admin\UpdateAdminUserRequest;
use App\Http\Resources\AdminUserResource;
use App\Http\Resources\HotelResource;
use App\Http\Resources\RoomResource;
use App\Models\Driver;
use App\Models\Hotel;
use App\Models\Room;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AdminController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = User::with('driver');

        if ($request->has('role')) {
            $query->where('role', $request->role);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('active')) {
            $query->where('active', $request->boolean('active'));
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query->latest()->paginate(15);

        return AdminUserResource::collection($users);
    }

    public function store(StoreUserRequest $request): JsonResponse
    {
        $data = $request->validated();

        $roleMap = [
            'Tourist' => 'tourist',
            'Driver' => 'driver',
            'Hotel Manager' => 'hotel_manager',
            'Administrator' => 'administrator',
        ];
        $data['role'] = $roleMap[$data['role']] ?? $data['role'];
        $data['status'] = $data['status'] ?? 'Pending';

        $user = User::create($data);

        if ($request->role === 'Driver') {
            Driver::create([
                'user_id' => $user->id,
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'city_id' => $request->city_id,
                'license_number' => $request->license_number,
            ]);
        }

        return response()->json([
            'message' => 'User created successfully',
            'user' => new AdminUserResource($user->load('driver')),
        ], 201);
    }

    public function show(User $user): AdminUserResource
    {
        $user->load('driver', 'bookings');

        return new AdminUserResource($user);
    }

    public function update(UpdateAdminUserRequest $request, User $user): JsonResponse
    {
        $data = $request->validated();

        if (isset($data['role'])) {
            $roleMap = [
                'Tourist' => 'tourist',
                'Driver' => 'driver',
                'Hotel Manager' => 'hotel_manager',
                'Administrator' => 'administrator',
            ];
            $data['role'] = $roleMap[$data['role']] ?? $data['role'];
        }

        if (isset($data['status'])) {
            $statusMap = [
                'Pending' => 'Pending',
                'Approved' => 'Approved',
                'Rejected' => 'Rejected',
                'Suspended' => 'Suspended',
            ];
            $data['status'] = $statusMap[$data['status']] ?? $data['status'];
        }

        $user->update($data);

        return response()->json([
            'message' => 'User updated successfully',
            'user' => new AdminUserResource($user->fresh('driver')),
        ]);
    }

    public function destroy(User $user): JsonResponse
    {
        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully',
        ]);
    }

    public function stats(): JsonResponse
    {
        $stats = [
            'total_users' => User::count(),
            'total_cities' => \App\Models\City::count(),
            'total_hotels' => \App\Models\Hotel::count(),
            'total_bookings' => \App\Models\Booking::count(),
            'average_rating' => \App\Models\Review::avg('rating') ?? 0,
            'recent_bookings' => \App\Models\Booking::with(['user', 'room.hotel'])
                ->latest()
                ->take(5)
                ->get()
                ->map(fn($booking) => [
                    'id' => $booking->id,
                    'booking_number' => $booking->booking_number,
                    'tourist_name' => $booking->user->first_name . ' ' . $booking->user->last_name,
                    'hotel_name' => $booking->room->hotel->name ?? 'N/A',
                    'start_date' => $booking->start_date,
                    'end_date' => $booking->end_date,
                    'status' => $booking->status,
                    'total_price' => $booking->total_price,
                ]),
            'recent_users' => User::latest()
                ->take(5)
                ->get()
                ->map(fn($user) => [
                    'id' => $user->id,
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'email' => $user->email,
                    'role' => $user->role,
                ]),
        ];

        return response()->json(['data' => $stats]);
    }

    public function trashedHotels(Request $request): AnonymousResourceCollection
    {
        $hotels = Hotel::onlyTrashed()
            ->with('city')
            ->withCount('rooms')
            ->latest('deleted_at')
            ->paginate(15);

        return HotelResource::collection($hotels);
    }

    public function restoreHotel(string $id): JsonResponse
    {
        $hotel = Hotel::withTrashed()->findOrFail($id);
        $hotel->restore();

        return response()->json([
            'message' => 'Hotel restored successfully',
            'hotel' => new HotelResource($hotel->load('city')),
        ]);
    }

    public function forceDeleteHotel(string $id): JsonResponse
    {
        $hotel = Hotel::withTrashed()->findOrFail($id);
        $hotel->forceDelete();

        return response()->json([
            'message' => 'Hotel permanently deleted',
        ]);
    }

    public function trashedRooms(Request $request): AnonymousResourceCollection
    {
        $rooms = Room::onlyTrashed()
            ->with('hotel')
            ->latest('deleted_at')
            ->paginate(15);

        return RoomResource::collection($rooms);
    }

    public function restoreRoom(string $id): JsonResponse
    {
        $room = Room::withTrashed()->findOrFail($id);
        $room->restore();

        return response()->json([
            'message' => 'Room restored successfully',
            'room' => new RoomResource($room->load('hotel')),
        ]);
    }

    public function forceDeleteRoom(string $id): JsonResponse
    {
        $room = Room::withTrashed()->findOrFail($id);
        $room->forceDelete();

        return response()->json([
            'message' => 'Room permanently deleted',
        ]);
    }
}
