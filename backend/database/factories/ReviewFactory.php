<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Review;

class ReviewFactory extends Factory
{
    protected $model = Review::class;

    public function definition(): array
    {
        return [
            'user_id' => \App\Models\User::factory(),
            'hotel_id' => null,
            'driver_id' => null,
            'attraction_id' => null,
            'rating' => fake()->numberBetween(1, 5),
            'comment' => fake()->paragraph(),
        ];
    }
}
