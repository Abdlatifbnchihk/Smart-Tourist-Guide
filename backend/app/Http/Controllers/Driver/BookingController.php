<?php

namespace App\Http\Controllers\Driver;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class BookingController extends Controller
{
    private const VALID_TRANSITIONS = [
        'Pending' => ['Confirmed', 'Cancelled'],
        'Confirmed' => ['InProgress', 'Cancelled'],
        'InProgress' => ['Completed'],
        'Cancelled' => [],
        'Completed' => [],
    ];

    public function index(Request $request)
    {
        $bookings = Booking::whereHas('driver', function ($query) use ($request) {
            $query->where('user_id', $request->user()->id);
        })->get();

        return response()->json($bookings);
    }

    public function show(Booking $booking, Request $request)
    {
        if (!$booking->driver || $booking->driver->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'You are not authorized to view this booking',
            ], Response::HTTP_FORBIDDEN);
        }

        return response()->json($booking->load(['driver', 'user']));
    }

    public function update(Request $request, Booking $booking): JsonResponse
    {
        if (!$booking->driver || $booking->driver->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'You are not authorized to update this booking',
            ], Response::HTTP_FORBIDDEN);
        }

        $request->validate([
            'status' => 'required|string|in:Confirmed,InProgress,Cancelled,Completed',
        ]);

        $currentStatus = $booking->status->value;
        $newStatus = $request->input('status');
        $allowedTransitions = self::VALID_TRANSITIONS[$currentStatus] ?? [];

        if (!in_array($newStatus, $allowedTransitions)) {
            return response()->json([
                'message' => 'Invalid status transition',
                'current_status' => $currentStatus,
                'allowed_next_statuses' => $allowedTransitions,
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $booking->update(['status' => $newStatus]);

        return response()->json([
            'message' => 'Booking status updated successfully',
            'booking' => $booking->fresh(),
        ]);
    }
}
