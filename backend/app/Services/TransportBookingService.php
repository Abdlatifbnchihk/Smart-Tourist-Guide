<?php

namespace App\Services;

use App\Enums\BookingStatus;
use App\Models\Booking;
use App\Models\Vehicle;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class TransportBookingService
{
    private const VALID_TRANSITIONS = [
        'Pending' => ['Confirmed', 'Cancelled'],
        'Confirmed' => ['InProgress', 'Cancelled'],
        'InProgress' => ['Completed'],
        'Completed' => [],
        'Cancelled' => [],
    ];

    public function create(array $data): Booking
    {
        $vehicle = Vehicle::findOrFail($data['vehicle_id']);

        // Validate vehicle belongs to the specified driver
        if ((int) $vehicle->driver_id !== (int) $data['driver_id']) {
            throw new \DomainException('Vehicle does not belong to this driver');
        }

        // Validate distance is positive
        if ($data['distance_km'] <= 0) {
            throw new \DomainException('Distance must be greater than zero');
        }

        $startDate = Carbon::parse($data['start_date']);
        $endDate = Carbon::parse($data['end_date']);

        if ($endDate->lt($startDate)) {
            throw new \DomainException('End date must be after start date');
        }

        // Compute price server-side
        $totalPrice = $vehicle->price_per_km * $data['distance_km'];

        return DB::transaction(function () use ($data, $vehicle, $totalPrice) {
            return Booking::create([   
                'user_id' => $data['user_id'],
                'room_id' => $data['room_id'] ?? null,
                'driver_id' => $data['driver_id'],
                'booking_number' => $this->generateBookingNumber(),
                'booking_type' => $data['booking_type'] ?? 'Airport Transfer',
                'booking_date' => Carbon::now()->toDateString(),
                'start_date' => $data['start_date'],
                'end_date' => $data['end_date'],
                'total_price' => $totalPrice,
                'status' => BookingStatus::Pending,
            ]);
        });
    }

    public function confirm(Booking $booking): Booking
    {
        $this->transition($booking, BookingStatus::Confirmed);

        return $booking;
    }

    public function start(Booking $booking): Booking
    {
        $this->transition($booking, BookingStatus::InProgress);

        return $booking;
    }

    public function complete(Booking $booking): Booking
    {
        $this->transition($booking, BookingStatus::Completed);

        return $booking;
    }

    public function cancel(Booking $booking): Booking
    {
        $this->transition($booking, BookingStatus::Cancelled);

        return $booking;
    }

    private function transition(Booking $booking, BookingStatus $toStatus): void
    {
        $fromStatus = $booking->status instanceof BookingStatus
            ? $booking->status->value
            : $booking->status;
        $toValue = $toStatus->value;

        $allowed = self::VALID_TRANSITIONS[$fromStatus] ?? [];

        if (! in_array($toValue, $allowed)) {
            throw new RuntimeException(
                "Cannot transition from {$fromStatus} to {$toValue}"
            );
        }

        $booking->update(['status' => $toStatus]);
    }

    private function generateBookingNumber(): string
    {
        return 'TB'.strtoupper(uniqid());
    }
}
