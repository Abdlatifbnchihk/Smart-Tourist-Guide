<?php

namespace Tests\Feature\Api\V1;

use App\Models\Booking;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class HotelBookingControllerTest extends TestCase
{
    use RefreshDatabase;

    private int $touristId;

    private int $hotelOwnerId;

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

        // Create hotel owner
        $this->hotelOwnerId = DB::table('users')->insertGetId([
            'first_name' => 'Hotel',
            'last_name' => 'Owner',
            'email' => 'owner@test.com',
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
            'created_by' => $this->hotelOwnerId,
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

        // Create booking
        $this->bookingId = DB::table('bookings')->insertGetId([
            'user_id' => $this->touristId,
            'room_id' => $this->roomId,
            'booking_number' => 'BK001',
            'booking_type' => 'Hotel',
            'booking_date' => now()->toDateString(),
            'start_date' => now()->addDays(1)->toDateString(),
            'end_date' => now()->addDays(3)->toDateString(),
            'total_price' => 200,
            'status' => 'Pending',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function test_tourist_can_list_own_bookings(): void
    {
        Sanctum::actingAs(User::find($this->touristId));

        $response = $this->getJson('/api/v1/hotel-bookings');

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $this->bookingId);
    }

    public function test_hotel_owner_can_list_bookings_for_their_hotels(): void
    {
        Sanctum::actingAs(User::find($this->hotelOwnerId));

        $response = $this->getJson('/api/v1/hotel-bookings');

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $this->bookingId);
    }

    public function test_tourist_can_create_booking(): void
    {
        Sanctum::actingAs(User::find($this->touristId));

        $response = $this->postJson('/api/v1/hotel-bookings', [
            'room_id' => $this->roomId,
            'start_date' => now()->addDays(5)->toDateString(),
            'end_date' => now()->addDays(8)->toDateString(),
        ]);

        $response->assertCreated()
            ->assertJsonStructure([
                'message',
                'booking' => ['id', 'total_price', 'status'],
            ])
            ->assertJsonPath('booking.status', 'Pending');
    }

    public function test_booking_creation_validation_fails(): void
    {
        Sanctum::actingAs(User::find($this->touristId));

        $response = $this->postJson('/api/v1/hotel-bookings', [
            'room_id' => null,
            'start_date' => null,
            'end_date' => null,
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['room_id', 'start_date', 'end_date']);
    }

    public function test_booking_creation_unavailable_room(): void
    {
        // Set room quantity to 1 so one booking fills it
        DB::table('rooms')->where('room_id', $this->roomId)->update(['quantity_available' => 1]);

        // Create a booking that overlaps
        DB::table('bookings')->insert([
            'room_id' => $this->roomId,
            'user_id' => $this->touristId,
            'booking_number' => 'BK002',
            'booking_type' => 'Hotel',
            'booking_date' => now()->toDateString(),
            'start_date' => now()->addDays(1)->toDateString(),
            'end_date' => now()->addDays(5)->toDateString(),
            'total_price' => 400,
            'status' => 'Confirmed',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Sanctum::actingAs(User::find($this->touristId));

        $response = $this->postJson('/api/v1/hotel-bookings', [
            'room_id' => $this->roomId,
            'start_date' => now()->addDays(2)->toDateString(),
            'end_date' => now()->addDays(4)->toDateString(),
        ]);

        $response->assertUnprocessable()
            ->assertJson(['message' => 'Room is not available for the selected dates']);
    }

    public function test_tourist_can_view_own_booking_detail(): void
    {
        Sanctum::actingAs(User::find($this->touristId));

        $response = $this->getJson("/api/v1/hotel-bookings/{$this->bookingId}");

        $response->assertOk()
            ->assertJsonPath('data.id', $this->bookingId);
    }

    public function test_hotel_owner_can_view_booking_for_their_hotel(): void
    {
        Sanctum::actingAs(User::find($this->hotelOwnerId));

        $response = $this->getJson("/api/v1/hotel-bookings/{$this->bookingId}");

        $response->assertOk()
            ->assertJsonPath('data.id', $this->bookingId);
    }

    public function test_unauthorized_user_cannot_view_booking_detail(): void
    {
        // Create another tourist
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

        Sanctum::actingAs(User::find($otherTouristId));

        $response = $this->getJson("/api/v1/hotel-bookings/{$this->bookingId}");

        $response->assertForbidden();
    }

    public function test_tourist_can_cancel_own_booking(): void
    {
        Sanctum::actingAs(User::find($this->touristId));

        $response = $this->patchJson("/api/v1/hotel-bookings/{$this->bookingId}/cancel");

        $response->assertOk()
            ->assertJsonPath('booking.status', 'Cancelled');
    }

    public function test_hotel_owner_can_cancel_booking_for_their_hotel(): void
    {
        Sanctum::actingAs(User::find($this->hotelOwnerId));

        $response = $this->patchJson("/api/v1/hotel-bookings/{$this->bookingId}/cancel");

        $response->assertOk()
            ->assertJsonPath('booking.status', 'Cancelled');
    }

    public function test_cannot_cancel_completed_booking(): void
    {
        // Update booking to completed
        DB::table('bookings')->where('id', $this->bookingId)->update(['status' => 'Completed']);

        Sanctum::actingAs(User::find($this->touristId));

        $response = $this->patchJson("/api/v1/hotel-bookings/{$this->bookingId}/cancel");

        $response->assertUnprocessable()
            ->assertJson(['message' => 'Cannot transition from Completed to Cancelled']);
    }

    public function test_hotel_owner_can_confirm_pending_booking(): void
    {
        Sanctum::actingAs(User::find($this->hotelOwnerId));

        $response = $this->patchJson("/api/v1/hotel-bookings/{$this->bookingId}/status", [
            'status' => 'confirmed',
        ]);

        $response->assertOk()
            ->assertJsonPath('booking.status', 'Confirmed');
    }

    public function test_hotel_owner_can_complete_confirmed_booking(): void
    {
        // Update booking to confirmed
        DB::table('bookings')->where('id', $this->bookingId)->update(['status' => 'Confirmed']);

        Sanctum::actingAs(User::find($this->hotelOwnerId));

        $response = $this->patchJson("/api/v1/hotel-bookings/{$this->bookingId}/status", [
            'status' => 'completed',
        ]);

        $response->assertOk()
            ->assertJsonPath('booking.status', 'Completed');
    }

    public function test_cannot_confirm_completed_booking(): void
    {
        // Update booking to completed
        DB::table('bookings')->where('id', $this->bookingId)->update(['status' => 'Completed']);

        Sanctum::actingAs(User::find($this->hotelOwnerId));

        $response = $this->patchJson("/api/v1/hotel-bookings/{$this->bookingId}/status", [
            'status' => 'confirmed',
        ]);

        $response->assertUnprocessable()
            ->assertJson(['message' => 'Cannot transition from Completed to Confirmed']);
    }
}
