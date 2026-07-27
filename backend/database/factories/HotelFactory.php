<?php

namespace Database\Factories;

use App\Models\Hotel;
use Illuminate\Database\Eloquent\Factories\Factory;

class HotelFactory extends Factory
{
    protected $model = Hotel::class;

    public function definition(): array
    {
        return [
            'name' => fake()->company(),
            'description' => fake()->paragraph(),
            'address' => fake()->address(),
            'city_id' => 1,
            'stars' => fake()->numberBetween(1, 5),
            'phone' => fake()->phoneNumber(),
            'email' => fake()->email(),
            'created_by' => 1,
        ];
    }
}
