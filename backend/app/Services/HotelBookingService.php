<?php

namespace App\Services;

use App\Enums\BookingStatus;
use App\Models\Booking;
use App\Models\Room;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class HotelBookingService
{
    private const VALID_TRANSITIONS = [
        'Pending' => ['Confirmed', 'Cancelled'],
        'Confirmed' => ['Completed', 'Cancelled'],
        'Completed' => [],
        'Cancelled' => [],
    ];

    public function create(array $data): Booking
    {
        $room = Room::findOrFail($data['room_id']);

        $startDate = Carbon::parse($data['start_date']);
        $endDate = Carbon::parse($data['end_date']);

        if ($endDate->lte($startDate)) {
            throw new \DomainException('End date must be after start date');
        }

        $nights = $startDate->diffInDays($endDate);
        $totalPrice = $room->price_per_night * $nights;

        $this->checkAvailability($room, $startDate, $endDate);

        return DB::transaction(function () use ($data, $room, $totalPrice) {
            return Booking::create([
                'user_id' => $data['user_id'],
                'room_id' => $room->room_id,
                'driver_id' => $data['driver_id'] ?? null,
                'booking_number' => $this->generateBookingNumber(),
                'booking_type' => $data['booking_type'] ?? 'Hotel',
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

    private function checkAvailability(Room $room, Carbon $startDate, Carbon $endDate): void
    {
        $overlappingBookings = Booking::where('room_id', $room->room_id)
            ->whereIn('status', [
                BookingStatus::Pending,
                BookingStatus::Confirmed,
            ])
            ->where('start_date', '<', $endDate)
            ->where('end_date', '>', $startDate)
            ->count();

        if ($overlappingBookings >= $room->quantity_available) {
            throw new \DomainException('Room is not available for the selected dates');
        }
    }

    private function generateBookingNumber(): string
    {
        return 'BK'.strtoupper(uniqid());
    }
}
