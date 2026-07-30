<?php

namespace Tests\Feature\Api\V1;

use App\Models\Driver;
use App\Models\Hotel;
use App\Models\Review;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ReviewControllerTest extends TestCase
{
    use RefreshDatabase;

    private int $touristId;

    private int $otherTouristId;

    private int $hotelId;

    private int $reviewId;

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

        // Create other tourist
        $this->otherTouristId = DB::table('users')->insertGetId([
            'first_name' => 'Other',
            'last_name' => 'Tourist',
            'email' => 'other@test.com',
            'phone' => '0987654321',
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
            'phone' => '1111111111',
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
        $roomId = DB::table('rooms')->insertGetId([
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

        // Create completed booking for tourist
        DB::table('bookings')->insert([
            'user_id' => $this->touristId,
            'room_id' => $roomId,
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

        // Create review
        $this->reviewId = DB::table('reviews')->insertGetId([
            'user_id' => $this->touristId,
            'hotel_id' => $this->hotelId,
            'rating' => 5,
            'comment' => 'Great hotel!',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function test_list_reviews_for_hotel(): void
    {
        Sanctum::actingAs(User::find($this->touristId));

        $response = $this->getJson('/api/v1/reviews?hotel_id='.$this->hotelId);

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $this->reviewId);
    }

    public function test_list_reviews_for_driver(): void
    {
        Sanctum::actingAs(User::find($this->touristId));

        $response = $this->getJson('/api/v1/reviews?driver_id=999');

        $response->assertOk()
            ->assertJsonCount(0, 'data');
    }

    public function test_list_reviews_for_attraction(): void
    {
        Sanctum::actingAs(User::find($this->touristId));

        $response = $this->getJson('/api/v1/reviews?attraction_id=999');

        $response->assertOk()
            ->assertJsonCount(0, 'data');
    }

    public function test_create_review_successfully(): void
    {
        // Create another hotel for this test to avoid duplicate review
        $anotherHotelId = DB::table('hotels')->insertGetId([
            'name' => 'Another Hotel',
            'address' => '456 Test Ave',
            'city_id' => DB::table('cities')->value('id'),
            'created_by' => DB::table('users')->where('role', 'hotel_manager')->value('id'),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Create room for the new hotel
        $anotherRoomId = DB::table('rooms')->insertGetId([
            'hotel_id' => $anotherHotelId,
            'number' => '201',
            'type' => 'Single',
            'capacity' => 2,
            'price_per_night' => 100,
            'quantity_available' => 5,
            'available' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Create completed booking for the new hotel
        DB::table('bookings')->insert([
            'user_id' => $this->touristId,
            'room_id' => $anotherRoomId,
            'booking_number' => 'BK002',
            'booking_type' => 'Hotel',
            'booking_date' => now()->toDateString(),
            'start_date' => now()->subDays(5)->toDateString(),
            'end_date' => now()->subDays(3)->toDateString(),
            'total_price' => 200,
            'status' => 'Completed',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Sanctum::actingAs(User::find($this->touristId));

        $response = $this->postJson('/api/v1/reviews', [
            'hotel_id' => $anotherHotelId,
            'rating' => 4,
            'comment' => 'Good hotel',
        ]);

        $response->assertCreated()
            ->assertJsonStructure([
                'message',
                'review' => ['id', 'rating', 'comment', 'hotel'],
            ]);
    }

    public function test_create_review_validation_error(): void
    {
        Sanctum::actingAs(User::find($this->touristId));

        $response = $this->postJson('/api/v1/reviews', [
            'hotel_id' => $this->hotelId,
            'rating' => null,
            'comment' => 'Good hotel',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['rating']);
    }

    public function test_get_single_review(): void
    {
        Sanctum::actingAs(User::find($this->touristId));

        $response = $this->getJson('/api/v1/reviews/'.$this->reviewId);

        $response->assertOk()
            ->assertJsonPath('data.id', $this->reviewId);
    }

    public function test_reviewer_updates_own_review(): void
    {
        Sanctum::actingAs(User::find($this->touristId));

        $response = $this->putJson('/api/v1/reviews/'.$this->reviewId, [
            'rating' => 4,
            'comment' => 'Updated review',
        ]);

        $response->assertOk()
            ->assertJsonPath('review.rating', 4);
    }

    public function test_non_author_cannot_update_review(): void
    {
        Sanctum::actingAs(User::find($this->otherTouristId));

        $response = $this->putJson('/api/v1/reviews/'.$this->reviewId, [
            'rating' => 1,
            'comment' => 'Bad review',
        ]);

        $response->assertForbidden();
    }

    public function test_reviewer_deletes_own_review(): void
    {
        Sanctum::actingAs(User::find($this->touristId));

        $response = $this->deleteJson('/api/v1/reviews/'.$this->reviewId);

        $response->assertOk()
            ->assertJsonPath('message', 'Review deleted successfully');
    }

    public function test_non_author_cannot_delete_review(): void
    {
        Sanctum::actingAs(User::find($this->otherTouristId));

        $response = $this->deleteJson('/api/v1/reviews/'.$this->reviewId);

        $response->assertForbidden();
    }
}
