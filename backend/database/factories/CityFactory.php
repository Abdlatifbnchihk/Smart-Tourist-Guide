<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\City;

class CityFactory extends Factory
{
    protected $model = City::class;

    public function definition(): array
    {
        return [
            'name' => fake()->unique()->city(),
            'region' => fake()->state(),
            'description' => fake()->paragraph(),
        ];
    }
}
