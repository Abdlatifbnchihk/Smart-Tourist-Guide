<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Restaurant;
use App\Models\City;

class RestaurantFactory extends Factory
{
    protected $model = Restaurant::class;

    public function definition(): array
    {
        return [
            'city_id' => City::factory(),
            'name' => fake()->company(),
            'description' => fake()->paragraph(),
            'address' => fake()->address(),
            'cuisine' => fake()->randomElement(['Moroccan', 'Italian', 'French', 'Japanese', 'Mexican']),
            'phone' => fake()->phoneNumber(),
            'price_range' => fake()->numberBetween(1, 4),
        ];
    }
}
