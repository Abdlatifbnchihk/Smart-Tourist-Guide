<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Attraction;
use App\Models\City;
use App\Models\User;
use Illuminate\Support\Str;

class AttractionFactory extends Factory
{
    protected $model = Attraction::class;

    public function definition(): array
    {
        $name = fake()->unique()->words(3, true);

        return [
            'city_id' => City::factory(),
            'name' => $name,
            'slug' => Str::slug($name),
            'description' => fake()->paragraph(),
            'address' => fake()->address(),
            'opening_hours' => '09:00-18:00',
            'average_rating' => 0,
            'created_by' => User::factory(),
        ];
    }
}
