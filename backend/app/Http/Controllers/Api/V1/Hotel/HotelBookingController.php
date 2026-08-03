<?php

namespace App\Http\Controllers\Api\V1\Hotel;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreHotelBookingRequest;
use App\Http\Resources\HotelBookingResource;
use App\Models\Booking;
use App\Services\HotelBookingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class HotelBookingController extends Controller
{
    public function __construct(
        private HotelBookingService $bookingService
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Booking::query();

        if ($user->role === 'tourist') {
            // Tourist sees only own bookings
            $query->where('user_id', $user->id);
        } elseif ($user->role === 'hotel_manager') {
            // Hotel owner sees bookings for their hotels
            $query->whereHas('room.hotel', function ($q) use ($user) {
                $q->where('created_by', $user->id);
            });
        } else {
            // Other roles see nothing (or could be admin - not required)
            $query->whereRaw('0 = 1');
        }

        // Eager load relationships
        $query->with(['user', 'room.hotel']);

        // Paginate results
        $perPage = $request->get('per_page', 15);
        $bookings = $query->paginate($perPage);

        return HotelBookingResource::collection($bookings);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreHotelBookingRequest $request): JsonResponse
    {
        $validated = $request->validated();

        // Add user_id from authenticated user
        $validated['user_id'] = $request->user()->id;

        try {
            $booking = $this->bookingService->create($validated);

            return response()->json([
                'message' => 'Booking created successfully',
                'booking' => new HotelBookingResource($booking->load(['user', 'room.hotel'])),
            ], Response::HTTP_CREATED);
        } catch (\DomainException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Booking $booking, Request $request)
    {
        $user = $request->user();

        // Load relationships needed for authorization
        $booking->load(['room.hotel']);

        // Authorization check
        if ($user->role === 'tourist') {
            if ((int) $booking->user_id !== (int) $user->id) {
                return response()->json(['message' => 'Unauthorized'], Response::HTTP_FORBIDDEN);
            }
        } elseif ($user->role === 'hotel_manager') {
            // Check if booking's room belongs to a hotel owned by this user
            if (! $booking->room || ! $booking->room->hotel) {
                return response()->json(['message' => 'Unauthorized'], Response::HTTP_FORBIDDEN);
            }
            $hasAccess = (int) $booking->room->hotel->created_by === (int) $user->id;
            if (! $hasAccess) {
                return response()->json(['message' => 'Unauthorized'], Response::HTTP_FORBIDDEN);
            }
        } else {
            return response()->json(['message' => 'Unauthorized'], Response::HTTP_FORBIDDEN);
        }

        // Load remaining relationships
        $booking->load('user');

        return new HotelBookingResource($booking);
    }

    /**
     * Cancel the specified booking.
     */
    public function cancel(Booking $booking, Request $request): JsonResponse
    {
        $user = $request->user();

        // Load relationships needed for authorization
        $booking->load(['room.hotel']);

        // Authorization check
        $canCancel = false;
        if ($user->role === 'tourist') {
            $canCancel = (int) $booking->user_id === (int) $user->id;
        } elseif ($user->role === 'hotel_manager') {
            if ($booking->room && $booking->room->hotel) {
                $canCancel = (int) $booking->room->hotel->created_by === (int) $user->id;
            }
        }

        if (! $canCancel) {
            return response()->json(['message' => 'Unauthorized'], Response::HTTP_FORBIDDEN);
        }

        try {
            $booking = $this->bookingService->cancel($booking);

            return response()->json([
                'message' => 'Booking cancelled successfully',
                'booking' => new HotelBookingResource($booking->fresh(['user', 'room.hotel'])),
            ]);
        } catch (\RuntimeException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
    }

    /**
     * Update booking status.
     */
    public function status(Booking $booking, Request $request): JsonResponse
    {
        $user = $request->user();

        // Only hotel_owner can update status
        if ($user->role !== 'hotel_manager') {
            return response()->json(['message' => 'Unauthorized'], Response::HTTP_FORBIDDEN);
        }

        // Load relationships needed for authorization
        $booking->load(['room.hotel']);

        // Check if hotel_owner manages the hotel for this booking
        if (! $booking->room || ! $booking->room->hotel) {
            return response()->json(['message' => 'Unauthorized'], Response::HTTP_FORBIDDEN);
        }
        if ((int) $booking->room->hotel->created_by !== (int) $user->id) {
            return response()->json(['message' => 'Unauthorized'], Response::HTTP_FORBIDDEN);
        }

        // Validate status field
        $request->validate([
            'status' => 'required|in:confirmed,completed',
        ]);

        $status = $request->input('status');

        try {
            if ($status === 'confirmed') {
                $booking = $this->bookingService->confirm($booking);
            } elseif ($status === 'completed') {
                $booking = $this->bookingService->complete($booking);
            }

            return response()->json([
                'message' => 'Booking status updated successfully',
                'booking' => new HotelBookingResource($booking->fresh(['user', 'room.hotel'])),
            ]);
        } catch (\RuntimeException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
    }
}
