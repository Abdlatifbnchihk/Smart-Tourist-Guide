<?php

namespace Database\Factories;

use App\Models\Booking;
use App\Models\Room;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class BookingFactory extends Factory
{
    protected $model = Booking::class;

    public function definition(): array
    {
        $startDate = fake()->dateTimeBetween('+1 week', '+1 month');
        $endDate = (clone $startDate)->modify('+3 days');

        return [
            'user_id' => User::factory(),
            'room_id' => Room::factory(),
            'booking_number' => 'BK' . strtoupper(uniqid()),
            'booking_type' => 'Hotel',
            'booking_date' => now()->toDateString(),
            'start_date' => $startDate->format('Y-m-d'),
            'end_date' => $endDate->format('Y-m-d'),
            'total_price' => fake()->randomFloat(2, 100, 1000),
            'status' => 'Pending',
        ];
    }
}
