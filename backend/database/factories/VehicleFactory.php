<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Vehicle;
use App\Models\Driver;

class VehicleFactory extends Factory
{
    protected $model = Vehicle::class;

    public function definition(): array
    {
        return [
            'driver_id' => Driver::factory(),
            'brand' => fake()->randomElement(['Toyota', 'Renault', 'Peugeot', 'Mercedes', 'Hyundai']),
            'model' => fake()->randomElement(['Corolla', 'Clio', '308', 'C-Class', 'i30']),
            'type' => fake()->randomElement(['sedan', 'suv', 'van', 'minibus']),
            'seats' => fake()->numberBetween(2, 8),
            'registration_number' => fake()->unique()->bothify('??-####-??'),
            'air_conditioning' => fake()->boolean(),
            'price_per_km' => fake()->randomFloat(2, 1, 10),
        ];
    }
}
