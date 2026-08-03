<?php

namespace App\Http\Controllers\Api\V1\Transport;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTransportBookingRequest;
use App\Http\Resources\TransportBookingResource;
use App\Models\Booking;
use App\Services\TransportBookingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class TransportBookingController extends Controller
{
    public function __construct(
        private TransportBookingService $bookingService
    ) {}

    /**
     * Display a listing of transport bookings.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Booking::query();

        if ($user->role === 'tourist') {
            $query->where('user_id', $user->id);
        } elseif ($user->role === 'driver') {
            $query->whereHas('driver', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            });
        } else {
            $query->whereRaw('0 = 1');
        }

        $query->with(['user', 'driver', 'room.hotel']);

        $perPage = $request->get('per_page', 15);
        $bookings = $query->paginate($perPage);

        return TransportBookingResource::collection($bookings);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTransportBookingRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $validated['user_id'] = $request->user()->id;

        try {
            $booking = $this->bookingService->create($validated);

            return response()->json([
                'message' => 'Transport booking created successfully',
                'booking' => new TransportBookingResource($booking->load(['user', 'driver'])),
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
        $booking->load(['driver']);

        // Authorization check
        if ($user->role === 'tourist') {
            if ((int) $booking->user_id !== (int) $user->id) {
                return response()->json(['message' => 'Unauthorized'], Response::HTTP_FORBIDDEN);
            }
        } elseif ($user->role === 'driver') {
            if (! $booking->driver || (int) $booking->driver->user_id !== (int) $user->id) {
                return response()->json(['message' => 'Unauthorized'], Response::HTTP_FORBIDDEN);
            }
        } else {
            return response()->json(['message' => 'Unauthorized'], Response::HTTP_FORBIDDEN);
        }

        $booking->load('user');

        return new TransportBookingResource($booking);
    }

    /**
     * Cancel the specified booking.
     */
    public function cancel(Booking $booking, Request $request): JsonResponse
    {
        $user = $request->user();

        // Load relationships needed for authorization
        $booking->load(['driver']);

        // Authorization check
        $canCancel = false;
        if ($user->role === 'tourist') {
            $canCancel = (int) $booking->user_id === (int) $user->id;
        } elseif ($user->role === 'driver') {
            if ($booking->driver) {
                $canCancel = (int) $booking->driver->user_id === (int) $user->id;
            }
        }

        if (! $canCancel) {
            return response()->json(['message' => 'Unauthorized'], Response::HTTP_FORBIDDEN);
        }

        try {
            $booking = $this->bookingService->cancel($booking);

            return response()->json([
                'message' => 'Transport booking cancelled successfully',
                'booking' => new TransportBookingResource($booking->fresh(['user', 'driver'])),
            ]);
        } catch (\RuntimeException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
    }

    /**
     * Update booking status (driver only).
     */
    public function status(Booking $booking, Request $request): JsonResponse
    {
        $user = $request->user();

        // Only driver can update transport status
        if ($user->role !== 'driver') {
            return response()->json(['message' => 'Unauthorized'], Response::HTTP_FORBIDDEN);
        }

        // Load relationships needed for authorization
        $booking->load(['driver']);

        // Check if driver owns this booking
        if (! $booking->driver || (int) $booking->driver->user_id !== (int) $user->id) {
            return response()->json(['message' => 'Unauthorized'], Response::HTTP_FORBIDDEN);
        }

        // Validate status field
        $request->validate([
            'status' => 'required|in:confirmed,in_progress,completed',
        ]);

        $status = $request->input('status');

        try {
            if ($status === 'confirmed') {
                $booking = $this->bookingService->confirm($booking);
            } elseif ($status === 'in_progress') {
                $booking = $this->bookingService->start($booking);
            } elseif ($status === 'completed') {
                $booking = $this->bookingService->complete($booking);
            }

            return response()->json([
                'message' => 'Transport booking status updated successfully',
                'booking' => new TransportBookingResource($booking->fresh(['user', 'driver'])),
            ]);
        } catch (\RuntimeException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
    }
}
