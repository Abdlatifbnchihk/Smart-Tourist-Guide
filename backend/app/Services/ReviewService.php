<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Review;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class ReviewService
{
    public function __construct(
        private RatingCalculator $ratingCalculator
    ) {}

    public function create(array $data): Review
    {
        // Validate rating
        if ($data['rating'] < 1 || $data['rating'] > 5) {
            throw new \DomainException('Rating must be between 1 and 5');
        }

        // Check booking eligibility
        $this->validateBookingEligibility($data['user_id'], $data);

        // Check for duplicate review
        $this->validateNoDuplicateReview($data['user_id'], $data);

        return DB::transaction(function () use ($data) {
            $review = Review::create($data);

            $this->triggerRecalculation($review);

            return $review;
        });
    }

    public function update(Review $review, array $data, int $userId): Review
    {
        // Validate ownership
        if ((int) $review->user_id !== $userId) {
            throw new RuntimeException('Unauthorized');
        }

        // Validate rating if provided
        if (isset($data['rating']) && ($data['rating'] < 1 || $data['rating'] > 5)) {
            throw new \DomainException('Rating must be between 1 and 5');
        }

        return DB::transaction(function () use ($review, $data) {
            $review->update($data);

            $this->triggerRecalculation($review);

            return $review;
        });
    }

    public function delete(Review $review, int $userId): void
    {
        // Allow admin to delete any review
        $user = \App\Models\User::find($userId);
        if ((int) $review->user_id !== $userId && (!$user || $user->role !== 'administrator')) {
            throw new RuntimeException('Unauthorized');
        }

        DB::transaction(function () use ($review) {
            $review->delete();
            $this->triggerRecalculation($review);
        });
    }

    private function validateBookingEligibility(int $userId, array $data): void
    {
        $query = Booking::where('user_id', $userId)
            ->where('status', 'Completed');

        if (! empty($data['hotel_id'])) {
            $query->where('room_id', '!=', null)
                ->whereHas('room', function ($q) use ($data) {
                    $q->where('hotel_id', $data['hotel_id']);
                });
        } elseif (! empty($data['driver_id'])) {
            $query->where('driver_id', $data['driver_id']);
        } elseif (! empty($data['attraction_id'])) {
            // For attractions, we check if user has any completed booking in the same city
            $query->whereHas('room.hotel', function ($q) use ($data) {
                $q->where('city_id', function ($subQuery) use ($data) {
                    $subQuery->select('city_id')
                        ->from('attractions')
                        ->where('id', $data['attraction_id']);
                });
            });
        }

        if (! $query->exists()) {
            throw new \DomainException('You must have a completed booking to leave a review');
        }
    }

    private function validateNoDuplicateReview(int $userId, array $data): void
    {
        $query = Review::where('user_id', $userId);

        if (! empty($data['hotel_id'])) {
            $query->where('hotel_id', $data['hotel_id']);
        } elseif (! empty($data['driver_id'])) {
            $query->where('driver_id', $data['driver_id']);
        } elseif (! empty($data['attraction_id'])) {
            $query->where('attraction_id', $data['attraction_id']);
        }

        if ($query->exists()) {
            throw new \DomainException('You have already reviewed this entity');
        }
    }

    private function triggerRecalculation(Review $review): void
    {
        if ($review->hotel_id) {
            $this->ratingCalculator->recalculateForHotel($review->hotel);
        } elseif ($review->driver_id) {
            $this->ratingCalculator->recalculateForDriver($review->driver);
        } elseif ($review->attraction_id) {
            $this->ratingCalculator->recalculateForAttraction($review->attraction);
        }
    }
}
