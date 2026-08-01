<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Driver;
use App\Models\User;
use App\Models\City;

class DriverFactory extends Factory
{
    protected $model = Driver::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'city_id' => City::factory(),
            'license_number' => fake()->unique()->numerify('##########'),
            'years_of_experience' => fake()->numberBetween(1, 20),
            'languages' => 'French,Arabic',
            'available' => true,
            'is_verified' => false,
            'rating' => 0,
        ];
    }

    public function verified(): static
    {
        return $this->state(fn () => ['is_verified' => true]);
    }

    public function unavailable(): static
    {
        return $this->state(fn () => ['available' => false]);
    }
}
