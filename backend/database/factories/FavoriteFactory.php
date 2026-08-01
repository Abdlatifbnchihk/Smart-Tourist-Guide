<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Favorite;

class FavoriteFactory extends Factory
{
    protected $model = Favorite::class;

    public function definition(): array
    {
        return [
            'user_id' => \App\Models\User::factory(),
            'hotel_id' => null,
            'restaurant_id' => null,
            'attraction_id' => null,
        ];
    }
}
