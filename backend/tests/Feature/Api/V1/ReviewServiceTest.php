<?php

namespace Tests\Feature\Api\V1;

use App\Models\Booking;
use App\Models\Driver;
use App\Models\Hotel;
use App\Models\Review;
use App\Models\Room;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use RuntimeException;
use Tests\TestCase;

class ReviewServiceTest extends TestCase
{
    use RefreshDatabase;

    private int $touristId;

    private int $hotelId;

    private int $roomId;

    private int $bookingId;

    protected function setUp(): void
    {
        parent::setUp();

        if (DB::getDriverName() === 'sqlite') {
            DB::unprepared('PRAGMA foreign_keys = OFF');
        }

        // Create city
        $cityId = DB::table('cities')->insertGetId([
            'name' => 'Test City',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Create tourist
        $this->touristId = DB::table('users')->insertGetId([
            'first_name' => 'Test',
            'last_name' => 'Tourist',
            'email' => 'tourist@test.com',
            'phone' => '1234567890',
            'password' => bcrypt('password'),
            'role' => 'tourist',
            'status' => 'Approved',
            'active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Create hotel manager
        $hotelManagerId = DB::table('users')->insertGetId([
            'first_name' => 'Hotel',
            'last_name' => 'Manager',
            'email' => 'manager@test.com',
            'phone' => '0987654321',
            'password' => bcrypt('password'),
            'role' => 'hotel_manager',
            'status' => 'Approved',
            'active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Create hotel
        $this->hotelId = DB::table('hotels')->insertGetId([
            'name' => 'Test Hotel',
            'address' => '123 Test St',
            'city_id' => $cityId,
            'created_by' => $hotelManagerId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Create room
        $this->roomId = DB::table('rooms')->insertGetId([
            'hotel_id' => $this->hotelId,
            'number' => '101',
            'type' => 'Single',
            'capacity' => 2,
            'price_per_night' => 100,
            'quantity_available' => 5,
            'available' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Create completed booking
        $this->bookingId = DB::table('bookings')->insertGetId([
            'user_id' => $this->touristId,
            'room_id' => $this->roomId,
            'booking_number' => 'BK001',
            'booking_type' => 'Hotel',
            'booking_date' => now()->toDateString(),
            'start_date' => now()->subDays(5)->toDateString(),
            'end_date' => now()->subDays(3)->toDateString(),
            'total_price' => 200,
            'status' => 'Completed',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function test_create_review_with_completed_booking(): void
    {
        $service = app(\App\Services\ReviewService::class);

        $review = $service->create([
            'user_id' => $this->touristId,
            'hotel_id' => $this->hotelId,
            'rating' => 5,
            'comment' => 'Great hotel!',
        ]);

        $this->assertNotNull($review);
        $this->assertEquals(5, $review->rating);
        $this->assertEquals('Great hotel!', $review->comment);

        // Check rating was recalculated
        $hotel = Hotel::find($this->hotelId);
        $this->assertEquals(5.00, $hotel->average_rating);
    }

    public function test_reject_review_without_completed_booking(): void
    {
        // Create another tourist without a booking
        $otherTouristId = DB::table('users')->insertGetId([
            'first_name' => 'Other',
            'last_name' => 'Tourist',
            'email' => 'other@test.com',
            'phone' => '5555555555',
            'password' => bcrypt('password'),
            'role' => 'tourist',
            'status' => 'Approved',
            'active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $service = app(\App\Services\ReviewService::class);

        $this->expectException(\DomainException::class);
        $this->expectExceptionMessage('You must have a completed booking to leave a review');

        $service->create([
            'user_id' => $otherTouristId,
            'hotel_id' => $this->hotelId,
            'rating' => 5,
            'comment' => 'Great hotel!',
        ]);
    }

    public function test_reject_duplicate_review(): void
    {
        $service = app(\App\Services\ReviewService::class);

        // Create first review
        $service->create([
            'user_id' => $this->touristId,
            'hotel_id' => $this->hotelId,
            'rating' => 5,
            'comment' => 'Great hotel!',
        ]);

        // Try to create duplicate
        $this->expectException(\DomainException::class);
        $this->expectExceptionMessage('You have already reviewed this entity');

        $service->create([
            'user_id' => $this->touristId,
            'hotel_id' => $this->hotelId,
            'rating' => 4,
            'comment' => 'Another review',
        ]);
    }

    public function test_reviewer_updates_own_review(): void
    {
        $service = app(\App\Services\ReviewService::class);

        $review = $service->create([
            'user_id' => $this->touristId,
            'hotel_id' => $this->hotelId,
            'rating' => 5,
            'comment' => 'Great hotel!',
        ]);

        $updatedReview = $service->update($review, [
            'rating' => 4,
            'comment' => 'Updated review',
        ], $this->touristId);

        $this->assertEquals(4, $updatedReview->rating);
        $this->assertEquals('Updated review', $updatedReview->comment);

        // Check rating was recalculated
        $hotel = Hotel::find($this->hotelId);
        $this->assertEquals(4.00, $hotel->average_rating);
    }

    public function test_non_author_cannot_update_review(): void
    {
        $service = app(\App\Services\ReviewService::class);

        $review = $service->create([
            'user_id' => $this->touristId,
            'hotel_id' => $this->hotelId,
            'rating' => 5,
            'comment' => 'Great hotel!',
        ]);

        $this->expectException(RuntimeException::class);
        $this->expectExceptionMessage('Unauthorized');

        $service->update($review, ['rating' => 4], 999);
    }

    public function test_reviewer_deletes_own_review(): void
    {
        $service = app(\App\Services\ReviewService::class);

        $review = $service->create([
            'user_id' => $this->touristId,
            'hotel_id' => $this->hotelId,
            'rating' => 5,
            'comment' => 'Great hotel!',
        ]);

        $service->delete($review, $this->touristId);

        $this->assertDatabaseMissing('reviews', ['id' => $review->id]);

        // Check rating was recalculated
        $hotel = Hotel::find($this->hotelId);
        $this->assertEquals(0, $hotel->average_rating);
    }

    public function test_non_author_cannot_delete_review(): void
    {
        $service = app(\App\Services\ReviewService::class);

        $review = $service->create([
            'user_id' => $this->touristId,
            'hotel_id' => $this->hotelId,
            'rating' => 5,
            'comment' => 'Great hotel!',
        ]);

        $this->expectException(RuntimeException::class);
        $this->expectExceptionMessage('Unauthorized');

        $service->delete($review, 999);
    }

    public function test_rating_recalculated_on_create(): void
    {
        $service = app(\App\Services\ReviewService::class);

        // Create first review
        $service->create([
            'user_id' => $this->touristId,
            'hotel_id' => $this->hotelId,
            'rating' => 4,
            'comment' => 'Good hotel',
        ]);

        $hotel = Hotel::find($this->hotelId);
        $this->assertEquals(4.00, $hotel->average_rating);

        // Create second user and booking
        $tourist2Id = DB::table('users')->insertGetId([
            'first_name' => 'Tourist',
            'last_name' => 'Two',
            'email' => 'tourist2@test.com',
            'phone' => '1111111111',
            'password' => bcrypt('password'),
            'role' => 'tourist',
            'status' => 'Approved',
            'active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('bookings')->insert([
            'user_id' => $tourist2Id,
            'room_id' => $this->roomId,
            'booking_number' => 'BK002',
            'booking_type' => 'Hotel',
            'booking_date' => now()->toDateString(),
            'start_date' => now()->subDays(10)->toDateString(),
            'end_date' => now()->subDays(8)->toDateString(),
            'total_price' => 200,
            'status' => 'Completed',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Create second review
        $service->create([
            'user_id' => $tourist2Id,
            'hotel_id' => $this->hotelId,
            'rating' => 2,
            'comment' => 'Not great',
        ]);

        $hotel = Hotel::find($this->hotelId);
        $this->assertEquals(3.00, $hotel->average_rating);
    }

    public function test_rating_recalculated_on_update(): void
    {
        $service = app(\App\Services\ReviewService::class);

        $review = $service->create([
            'user_id' => $this->touristId,
            'hotel_id' => $this->hotelId,
            'rating' => 5,
            'comment' => 'Great hotel!',
        ]);

        $hotel = Hotel::find($this->hotelId);
        $this->assertEquals(5.00, $hotel->average_rating);

        $service->update($review, ['rating' => 2], $this->touristId);

        $hotel = Hotel::find($this->hotelId);
        $this->assertEquals(2.00, $hotel->average_rating);
    }

    public function test_rating_recalculated_on_delete(): void
    {
        $service = app(\App\Services\ReviewService::class);

        $review = $service->create([
            'user_id' => $this->touristId,
            'hotel_id' => $this->hotelId,
            'rating' => 5,
            'comment' => 'Great hotel!',
        ]);

        $hotel = Hotel::find($this->hotelId);
        $this->assertEquals(5.00, $hotel->average_rating);

        $service->delete($review, $this->touristId);

        $hotel = Hotel::find($this->hotelId);
        $this->assertEquals(0, $hotel->average_rating);
    }

    public function test_invalid_rating_rejection(): void
    {
        $service = app(\App\Services\ReviewService::class);

        $this->expectException(\DomainException::class);
        $this->expectExceptionMessage('Rating must be between 1 and 5');

        $service->create([
            'user_id' => $this->touristId,
            'hotel_id' => $this->hotelId,
            'rating' => 0,
            'comment' => 'Invalid rating',
        ]);
    }

    public function test_invalid_rating_above_range_rejection(): void
    {
        $service = app(\App\Services\ReviewService::class);

        $this->expectException(\DomainException::class);
        $this->expectExceptionMessage('Rating must be between 1 and 5');

        $service->create([
            'user_id' => $this->touristId,
            'hotel_id' => $this->hotelId,
            'rating' => 6,
            'comment' => 'Invalid rating',
        ]);
    }
}
