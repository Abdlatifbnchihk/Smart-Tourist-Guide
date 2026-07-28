<?php

namespace Database\Factories;

use App\Models\Hotel;
use Illuminate\Database\Eloquent\Factories\Factory;

class RoomFactory extends Factory
{
    public function definition(): array
    {
        return [
            'hotel_id' => Hotel::factory()->create()->id,
            'number' => fake()->unique()->numberBetween(100, 999),
            'type' => fake()->randomElement(['Single', 'Double', 'Suite', 'Deluxe']),
            'capacity' => fake()->numberBetween(1, 4),
            'price_per_night' => fake()->randomFloat(2, 50, 500),
            'quantity_available' => fake()->numberBetween(1, 10),
            'available' => true,
        ];
    }
}
