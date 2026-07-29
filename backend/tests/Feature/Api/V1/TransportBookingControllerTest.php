<?php

namespace Tests\Feature\Api\V1;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class TransportBookingControllerTest extends TestCase
{
    use RefreshDatabase;

    private int $touristId;

    private int $driverId;

    private int $vehicleId;

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

        // Create driver user
        $driverUserId = DB::table('users')->insertGetId([
            'first_name' => 'Test',
            'last_name' => 'Driver',
            'email' => 'driver@test.com',
            'phone' => '0987654321',
            'password' => bcrypt('password'),
            'role' => 'driver',
            'status' => 'Approved',
            'active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Create driver (uses 'id' as primary key)
        $this->driverId = DB::table('drivers')->insertGetId([
            'user_id' => $driverUserId,
            'city_id' => $cityId,
            'license_number' => 'DL12345',
            'years_of_experience' => 5,
            'languages' => 'English',
            'available' => true,
            'is_verified' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Create vehicle
        $this->vehicleId = DB::table('vehicles')->insertGetId([
            'driver_id' => $this->driverId,
            'brand' => 'Toyota',
            'model' => 'Camry',
            'type' => 'Sedan',
            'seats' => 4,
            'registration_number' => 'ABC123',
            'air_conditioning' => true,
            'price_per_km' => 10.00,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Create transport booking
        $this->bookingId = DB::table('bookings')->insertGetId([
            'user_id' => $this->touristId,
            'driver_id' => $this->driverId,
            'booking_number' => 'TB001',
            'booking_type' => 'Airport Transfer',
            'booking_date' => now()->toDateString(),
            'start_date' => now()->addDays(1)->toDateString(),
            'end_date' => now()->addDays(1)->toDateString(),
            'total_price' => 500,
            'status' => 'Pending',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function test_tourist_can_create_airport_transfer_booking(): void
    {
        Sanctum::actingAs(User::find($this->touristId));

        $response = $this->postJson('/api/v1/transport-bookings', [
            'vehicle_id' => $this->vehicleId,
            'driver_id' => $this->driverId,
            'distance_km' => 50,
            'booking_type' => 'Airport Transfer',
            'start_date' => now()->addDays(5)->toDateString(),
            'end_date' => now()->addDays(5)->toDateString(),
        ]);

        $response->assertCreated()
            ->assertJsonStructure([
                'message',
                'booking' => ['id', 'total_price', 'status'],
            ])
            ->assertJsonPath('booking.status', 'Pending')
            ->assertJsonPath('booking.total_price', '500.00');
    }

    public function test_tourist_can_create_hotel_plus_driver_booking(): void
    {
        // Create hotel and room for combo booking
        $cityId = DB::table('cities')->first()->id;
        $hotelId = DB::table('hotels')->insertGetId([
            'name' => 'Test Hotel',
            'address' => '123 Test St',
            'city_id' => $cityId,
            'created_by' => $this->touristId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $roomId = DB::table('rooms')->insertGetId([
            'hotel_id' => $hotelId,
            'number' => '101',
            'type' => 'Single',
            'capacity' => 2,
            'price_per_night' => 100,
            'quantity_available' => 5,
            'available' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Sanctum::actingAs(User::find($this->touristId));

        $response = $this->postJson('/api/v1/transport-bookings', [
            'vehicle_id' => $this->vehicleId,
            'driver_id' => $this->driverId,
            'room_id' => $roomId,
            'distance_km' => 30,
            'booking_type' => 'Hotel + Driver',
            'start_date' => now()->addDays(5)->toDateString(),
            'end_date' => now()->addDays(8)->toDateString(),
        ]);

        $response->assertCreated()
            ->assertJsonPath('booking.status', 'Pending')
            ->assertJsonPath('booking.total_price', '300.00');
    }

    public function test_reject_booking_with_mismatched_vehicle_and_driver(): void
    {
        // Create another driver
        $otherDriverUserId = DB::table('users')->insertGetId([
            'first_name' => 'Other',
            'last_name' => 'Driver',
            'email' => 'other@test.com',
            'phone' => '5555555555',
            'password' => bcrypt('password'),
            'role' => 'driver',
            'status' => 'Approved',
            'active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $otherDriverId = DB::table('drivers')->insertGetId([
            'user_id' => $otherDriverUserId,
            'city_id' => DB::table('cities')->first()->id,
            'license_number' => 'DL99999',
            'years_of_experience' => 3,
            'languages' => 'English',
            'available' => true,
            'is_verified' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Sanctum::actingAs(User::find($this->touristId));

        $response = $this->postJson('/api/v1/transport-bookings', [
            'vehicle_id' => $this->vehicleId,
            'driver_id' => $otherDriverId,
            'distance_km' => 50,
            'booking_type' => 'Airport Transfer',
            'start_date' => now()->addDays(5)->toDateString(),
            'end_date' => now()->addDays(5)->toDateString(),
        ]);

        $response->assertUnprocessable()
            ->assertJson(['message' => 'Vehicle does not belong to this driver']);
    }

    public function test_price_computed_correctly(): void
    {
        Sanctum::actingAs(User::find($this->touristId));

        $response = $this->postJson('/api/v1/transport-bookings', [
            'vehicle_id' => $this->vehicleId,
            'driver_id' => $this->driverId,
            'distance_km' => 50,
            'booking_type' => 'Airport Transfer',
            'start_date' => now()->addDays(5)->toDateString(),
            'end_date' => now()->addDays(5)->toDateString(),
        ]);

        $response->assertCreated()
            ->assertJsonPath('booking.total_price', '500.00');
    }

    public function test_client_provided_total_price_ignored(): void
    {
        Sanctum::actingAs(User::find($this->touristId));

        $response = $this->postJson('/api/v1/transport-bookings', [
            'vehicle_id' => $this->vehicleId,
            'driver_id' => $this->driverId,
            'distance_km' => 50,
            'total_price' => 9999,
            'booking_type' => 'Airport Transfer',
            'start_date' => now()->addDays(5)->toDateString(),
            'end_date' => now()->addDays(5)->toDateString(),
        ]);

        $response->assertCreated()
            ->assertJsonPath('booking.total_price', '500.00');
    }

    public function test_zero_distance_rejected(): void
    {
        Sanctum::actingAs(User::find($this->touristId));

        $response = $this->postJson('/api/v1/transport-bookings', [
            'vehicle_id' => $this->vehicleId,
            'driver_id' => $this->driverId,
            'distance_km' => 0,
            'booking_type' => 'Airport Transfer',
            'start_date' => now()->addDays(5)->toDateString(),
            'end_date' => now()->addDays(5)->toDateString(),
        ]);

        $response->assertUnprocessable();
    }

    public function test_negative_distance_rejected(): void
    {
        Sanctum::actingAs(User::find($this->touristId));

        $response = $this->postJson('/api/v1/transport-bookings', [
            'vehicle_id' => $this->vehicleId,
            'driver_id' => $this->driverId,
            'distance_km' => -10,
            'booking_type' => 'Airport Transfer',
            'start_date' => now()->addDays(5)->toDateString(),
            'end_date' => now()->addDays(5)->toDateString(),
        ]);

        $response->assertUnprocessable();
    }

    public function test_tourist_can_view_own_booking(): void
    {
        Sanctum::actingAs(User::find($this->touristId));

        $response = $this->getJson("/api/v1/transport-bookings/{$this->bookingId}");

        $response->assertOk()
            ->assertJsonPath('data.id', $this->bookingId);
    }

    public function test_unauthorized_user_cannot_view_booking(): void
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

        $response = $this->getJson("/api/v1/transport-bookings/{$this->bookingId}");

        $response->assertForbidden();
    }

    public function test_tourist_can_cancel_own_booking(): void
    {
        Sanctum::actingAs(User::find($this->touristId));

        $response = $this->patchJson("/api/v1/transport-bookings/{$this->bookingId}/cancel");

        $response->assertOk()
            ->assertJsonPath('booking.status', 'Cancelled');
    }

    public function test_driver_can_confirm_pending_booking(): void
    {
        $driverUserId = DB::table('drivers')->where('id', $this->driverId)->value('user_id');
        $driverUser = User::find($driverUserId);
        Sanctum::actingAs($driverUser);

        $response = $this->patchJson("/api/v1/transport-bookings/{$this->bookingId}/status", [
            'status' => 'confirmed',
        ]);

        $response->assertOk()
            ->assertJsonPath('booking.status', 'Confirmed');
    }

    public function test_driver_can_start_confirmed_booking(): void
    {
        DB::table('bookings')->where('id', $this->bookingId)->update(['status' => 'Confirmed']);

        $driverUserId = DB::table('drivers')->where('id', $this->driverId)->value('user_id');
        $driverUser = User::find($driverUserId);
        Sanctum::actingAs($driverUser);

        $response = $this->patchJson("/api/v1/transport-bookings/{$this->bookingId}/status", [
            'status' => 'in_progress',
        ]);

        $response->assertOk()
            ->assertJsonPath('booking.status', 'InProgress');
    }

    public function test_driver_can_complete_in_progress_booking(): void
    {
        DB::table('bookings')->where('id', $this->bookingId)->update(['status' => 'InProgress']);

        $driverUserId = DB::table('drivers')->where('id', $this->driverId)->value('user_id');
        $driverUser = User::find($driverUserId);
        Sanctum::actingAs($driverUser);

        $response = $this->patchJson("/api/v1/transport-bookings/{$this->bookingId}/status", [
            'status' => 'completed',
        ]);

        $response->assertOk()
            ->assertJsonPath('booking.status', 'Completed');
    }

    public function test_cannot_start_pending_booking(): void
    {
        $driverUserId = DB::table('drivers')->where('id', $this->driverId)->value('user_id');
        $driverUser = User::find($driverUserId);
        Sanctum::actingAs($driverUser);

        $response = $this->patchJson("/api/v1/transport-bookings/{$this->bookingId}/status", [
            'status' => 'in_progress',
        ]);

        $response->assertUnprocessable()
            ->assertJson(['message' => 'Cannot transition from Pending to InProgress']);
    }

    public function test_cannot_confirm_completed_booking(): void
    {
        DB::table('bookings')->where('id', $this->bookingId)->update(['status' => 'Completed']);

        $driverUserId = DB::table('drivers')->where('id', $this->driverId)->value('user_id');
        $driverUser = User::find($driverUserId);
        Sanctum::actingAs($driverUser);

        $response = $this->patchJson("/api/v1/transport-bookings/{$this->bookingId}/status", [
            'status' => 'confirmed',
        ]);

        $response->assertUnprocessable()
            ->assertJson(['message' => 'Cannot transition from Completed to Confirmed']);
    }

    public function test_cannot_transition_cancelled_booking(): void
    {
        DB::table('bookings')->where('id', $this->bookingId)->update(['status' => 'Cancelled']);

        $driverUserId = DB::table('drivers')->where('id', $this->driverId)->value('user_id');
        $driverUser = User::find($driverUserId);
        Sanctum::actingAs($driverUser);

        $response = $this->patchJson("/api/v1/transport-bookings/{$this->bookingId}/status", [
            'status' => 'confirmed',
        ]);

        $response->assertUnprocessable()
            ->assertJson(['message' => 'Cannot transition from Cancelled to Confirmed']);
    }

    public function test_unauthorized_driver_cannot_update_status(): void
    {
        // Create another driver
        $otherDriverUserId = DB::table('users')->insertGetId([
            'first_name' => 'Other',
            'last_name' => 'Driver',
            'email' => 'otherdriver@test.com',
            'phone' => '6666666666',
            'password' => bcrypt('password'),
            'role' => 'driver',
            'status' => 'Approved',
            'active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Sanctum::actingAs(User::find($otherDriverUserId));

        $response = $this->patchJson("/api/v1/transport-bookings/{$this->bookingId}/status", [
            'status' => 'confirmed',
        ]);

        $response->assertForbidden();
    }

    public function test_tourist_cannot_update_status(): void
    {
        Sanctum::actingAs(User::find($this->touristId));

        $response = $this->patchJson("/api/v1/transport-bookings/{$this->bookingId}/status", [
            'status' => 'confirmed',
        ]);

        $response->assertForbidden();
    }

    public function test_tourist_can_list_own_transport_bookings(): void
    {
        Sanctum::actingAs(User::find($this->touristId));

        $response = $this->getJson('/api/v1/transport-bookings');

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $this->bookingId);
    }

    public function test_driver_can_list_assigned_transport_bookings(): void
    {
        $driverUserId = DB::table('drivers')->where('id', $this->driverId)->value('user_id');
        $driverUser = User::find($driverUserId);
        Sanctum::actingAs($driverUser);

        $response = $this->getJson('/api/v1/transport-bookings');

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $this->bookingId);
    }

    public function test_unauthorized_role_sees_empty_list(): void
    {
        // Create a hotel_manager user
        $hotelManagerId = DB::table('users')->insertGetId([
            'first_name' => 'Hotel',
            'last_name' => 'Manager',
            'email' => 'manager@test.com',
            'phone' => '7777777777',
            'password' => bcrypt('password'),
            'role' => 'hotel_manager',
            'status' => 'Approved',
            'active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Sanctum::actingAs(User::find($hotelManagerId));

        $response = $this->getJson('/api/v1/transport-bookings');

        $response->assertOk()
            ->assertJsonCount(0, 'data');
    }

    public function test_index_returns_paginated_response_with_relationships(): void
    {
        Sanctum::actingAs(User::find($this->touristId));

        $response = $this->getJson('/api/v1/transport-bookings');

        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'user', 'driver'],
                ],
                'links',
                'meta',
            ]);
    }
}
