<?php

namespace App\Services;

use App\Models\Attraction;
use App\Models\Driver;
use App\Models\Hotel;
use App\Models\Review;

class RatingCalculator
{
    public function recalculateForAttraction(Attraction $attraction): void
    {
        $avg = Review::where('attraction_id', $attraction->id)->avg('rating');
        $attraction->update(['average_rating' => round($avg, 2) ?? 0]);
    }

    public function recalculateForHotel(Hotel $hotel): void
    {
        $avg = Review::where('hotel_id', $hotel->id)->avg('rating');
        $hotel->update(['average_rating' => round($avg, 2) ?? 0]);
    }

    public function recalculateForDriver(Driver $driver): void
    {
        $avg = Review::where('driver_id', $driver->id)->avg('rating');
        $driver->update(['rating' => round($avg, 2) ?? 0]);
    }
}
