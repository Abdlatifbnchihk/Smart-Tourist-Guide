<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

beforeEach(function () {
    if (DB::getDriverName() === 'sqlite') {
        DB::unprepared('PRAGMA foreign_keys = OFF');
    }
});

it('lists all hotels', function () {
    $cityId = DB::table('cities')->insertGetId([
        'name' => 'Test City',
        'region' => 'West',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $managerId = DB::table('users')->insertGetId([
        'first_name' => 'Manager',
        'last_name' => 'User',
        'email' => 'manager@test.com',
        'phone' => '1234567890',
        'password' => bcrypt('password'),
        'role' => 'hotel_manager',
        'status' => 'Approved',
        'active' => true,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    DB::table('hotels')->insert([
        'name' => 'Hotel One',
        'address' => '123 Main St',
        'city_id' => $cityId,
        'created_by' => $managerId,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    DB::table('hotels')->insert([
        'name' => 'Hotel Two',
        'address' => '456 Oak Ave',
        'city_id' => $cityId,
        'created_by' => $managerId,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $touristId = DB::table('users')->insertGetId([
        'first_name' => 'Tourist',
        'last_name' => 'User',
        'email' => 'tourist@test.com',
        'phone' => '0987654321',
        'password' => bcrypt('password'),
        'role' => 'tourist',
        'status' => 'Approved',
        'active' => true,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    Sanctum::actingAs(User::find($touristId));

    $response = $this->getJson('/api/v1/hotels');

    $response->assertOk()
        ->assertJsonCount(2, 'data');
});

it('filters hotels by city_id', function () {
    $cityId1 = DB::table('cities')->insertGetId([
        'name' => 'City One',
        'region' => 'West',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $cityId2 = DB::table('cities')->insertGetId([
        'name' => 'City Two',
        'region' => 'East',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $managerId = DB::table('users')->insertGetId([
        'first_name' => 'Manager',
        'last_name' => 'User',
        'email' => 'manager@test.com',
        'phone' => '1234567890',
        'password' => bcrypt('password'),
        'role' => 'hotel_manager',
        'status' => 'Approved',
        'active' => true,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    DB::table('hotels')->insert(['name' => 'Hotel A', 'address' => '1 St', 'city_id' => $cityId1, 'created_by' => $managerId, 'created_at' => now(), 'updated_at' => now()]);
    DB::table('hotels')->insert(['name' => 'Hotel B', 'address' => '2 St', 'city_id' => $cityId1, 'created_by' => $managerId, 'created_at' => now(), 'updated_at' => now()]);
    DB::table('hotels')->insert(['name' => 'Hotel C', 'address' => '3 St', 'city_id' => $cityId2, 'created_by' => $managerId, 'created_at' => now(), 'updated_at' => now()]);

    $touristId = DB::table('users')->insertGetId([
        'first_name' => 'Tourist',
        'last_name' => 'User',
        'email' => 'tourist2@test.com',
        'phone' => '0987654321',
        'password' => bcrypt('password'),
        'role' => 'tourist',
        'status' => 'Approved',
        'active' => true,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    Sanctum::actingAs(User::find($touristId));

    $response = $this->getJson("/api/v1/hotels?city_id={$cityId1}");

    $response->assertOk()
        ->assertJsonCount(2, 'data');
});

it('filters hotels by search term', function () {
    $managerId = DB::table('users')->insertGetId([
        'first_name' => 'Manager',
        'last_name' => 'User',
        'email' => 'manager@test.com',
        'phone' => '1234567890',
        'password' => bcrypt('password'),
        'role' => 'hotel_manager',
        'status' => 'Approved',
        'active' => true,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $cityId = DB::table('cities')->insertGetId([
        'name' => 'Test City',
        'region' => 'West',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    DB::table('hotels')->insert(['name' => 'Grand Palace Hotel', 'address' => '1 St', 'city_id' => $cityId, 'created_by' => $managerId, 'created_at' => now(), 'updated_at' => now()]);
    DB::table('hotels')->insert(['name' => 'Seaside Resort', 'address' => '2 St', 'city_id' => $cityId, 'created_by' => $managerId, 'created_at' => now(), 'updated_at' => now()]);
    DB::table('hotels')->insert(['name' => 'Grand Azure Resort', 'address' => '3 St', 'city_id' => $cityId, 'created_by' => $managerId, 'created_at' => now(), 'updated_at' => now()]);

    $touristId = DB::table('users')->insertGetId([
        'first_name' => 'Tourist',
        'last_name' => 'User',
        'email' => 'tourist3@test.com',
        'phone' => '0987654321',
        'password' => bcrypt('password'),
        'role' => 'tourist',
        'status' => 'Approved',
        'active' => true,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    Sanctum::actingAs(User::find($touristId));

    $response = $this->getJson('/api/v1/hotels?search=Grand');

    $response->assertOk()
        ->assertJsonCount(2, 'data');
});

it('filters hotels by star_rating', function () {
    $managerId = DB::table('users')->insertGetId([
        'first_name' => 'Manager',
        'last_name' => 'User',
        'email' => 'manager@test.com',
        'phone' => '1234567890',
        'password' => bcrypt('password'),
        'role' => 'hotel_manager',
        'status' => 'Approved',
        'active' => true,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $cityId = DB::table('cities')->insertGetId([
        'name' => 'Test City',
        'region' => 'West',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    DB::table('hotels')->insert(['name' => 'Five Star', 'address' => '1 St', 'city_id' => $cityId, 'stars' => 5, 'created_by' => $managerId, 'created_at' => now(), 'updated_at' => now()]);
    DB::table('hotels')->insert(['name' => 'Three Star', 'address' => '2 St', 'city_id' => $cityId, 'stars' => 3, 'created_by' => $managerId, 'created_at' => now(), 'updated_at' => now()]);
    DB::table('hotels')->insert(['name' => 'Another Five', 'address' => '3 St', 'city_id' => $cityId, 'stars' => 5, 'created_by' => $managerId, 'created_at' => now(), 'updated_at' => now()]);

    $touristId = DB::table('users')->insertGetId([
        'first_name' => 'Tourist',
        'last_name' => 'User',
        'email' => 'tourist4@test.com',
        'phone' => '0987654321',
        'password' => bcrypt('password'),
        'role' => 'tourist',
        'status' => 'Approved',
        'active' => true,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    Sanctum::actingAs(User::find($touristId));

    $response = $this->getJson('/api/v1/hotels?star_rating=5');

    $response->assertOk()
        ->assertJsonCount(2, 'data');
});

it('creates hotel for hotel_manager', function () {
    $cityId = DB::table('cities')->insertGetId([
        'name' => 'Test City',
        'region' => 'West',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $managerId = DB::table('users')->insertGetId([
        'first_name' => 'Manager',
        'last_name' => 'User',
        'email' => 'manager2@test.com',
        'phone' => '1234567890',
        'password' => bcrypt('password'),
        'role' => 'hotel_manager',
        'status' => 'Approved',
        'active' => true,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    Sanctum::actingAs(User::find($managerId));

    $response = $this->postJson('/api/v1/hotels', [
        'city_id' => $cityId,
        'name' => 'New Hotel',
        'address' => '123 Main St',
        'phone' => '1234567890',
        'email' => 'hotel@test.com',
        'description' => 'A nice hotel',
        'stars' => 4,
    ]);

    $response->assertCreated()
        ->assertJsonFragment(['name' => 'New Hotel']);
});

it('fails to create hotel for tourist with wrong role', function () {
    $cityId = DB::table('cities')->insertGetId([
        'name' => 'Test City',
        'region' => 'West',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $touristId = DB::table('users')->insertGetId([
        'first_name' => 'Tourist',
        'last_name' => 'User',
        'email' => 'tourist5@test.com',
        'phone' => '1234567890',
        'password' => bcrypt('password'),
        'role' => 'tourist',
        'status' => 'Approved',
        'active' => true,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    Sanctum::actingAs(User::find($touristId));

    $response = $this->postJson('/api/v1/hotels', [
        'city_id' => $cityId,
        'name' => 'New Hotel',
        'address' => '123 Main St',
    ]);

    $response->assertForbidden();
});

it('fails to create hotel with missing required fields', function () {
    $managerId = DB::table('users')->insertGetId([
        'first_name' => 'Manager',
        'last_name' => 'User',
        'email' => 'manager3@test.com',
        'phone' => '1234567890',
        'password' => bcrypt('password'),
        'role' => 'hotel_manager',
        'status' => 'Approved',
        'active' => true,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    Sanctum::actingAs(User::find($managerId));

    $response = $this->postJson('/api/v1/hotels', []);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['city_id', 'name', 'address']);
});

it('shows hotel with relations', function () {
    $cityId = DB::table('cities')->insertGetId([
        'name' => 'Test City',
        'region' => 'West',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $managerId = DB::table('users')->insertGetId([
        'first_name' => 'Manager',
        'last_name' => 'User',
        'email' => 'manager4@test.com',
        'phone' => '1234567890',
        'password' => bcrypt('password'),
        'role' => 'hotel_manager',
        'status' => 'Approved',
        'active' => true,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $hotelId = DB::table('hotels')->insertGetId([
        'name' => 'Show Hotel',
        'address' => '123 Main St',
        'city_id' => $cityId,
        'created_by' => $managerId,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    DB::table('rooms')->insert([
        'hotel_id' => $hotelId,
        'number' => '101',
        'type' => 'single',
        'capacity' => 2,
        'price_per_night' => 100.00,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $touristId = DB::table('users')->insertGetId([
        'first_name' => 'Tourist',
        'last_name' => 'User',
        'email' => 'tourist6@test.com',
        'phone' => '0987654321',
        'password' => bcrypt('password'),
        'role' => 'tourist',
        'status' => 'Approved',
        'active' => true,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    Sanctum::actingAs(User::find($touristId));

    $response = $this->getJson("/api/v1/hotels/{$hotelId}");

    $response->assertOk()
        ->assertJsonPath('data.id', $hotelId)
        ->assertJsonStructure([
            'data' => [
                'id',
                'name',
                'city',
                'rooms',
                'reviews',
            ],
        ]);
});

it('returns 404 for non-existent hotel', function () {
    $touristId = DB::table('users')->insertGetId([
        'first_name' => 'Tourist',
        'last_name' => 'User',
        'email' => 'tourist7@test.com',
        'phone' => '0987654321',
        'password' => bcrypt('password'),
        'role' => 'tourist',
        'status' => 'Approved',
        'active' => true,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    Sanctum::actingAs(User::find($touristId));

    $response = $this->getJson('/api/v1/hotels/9999');

    $response->assertNotFound();
});

it('allows hotel owner to update hotel', function () {
    $cityId = DB::table('cities')->insertGetId([
        'name' => 'Test City',
        'region' => 'West',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $managerId = DB::table('users')->insertGetId([
        'first_name' => 'Manager',
        'last_name' => 'User',
        'email' => 'manager5@test.com',
        'phone' => '1234567890',
        'password' => bcrypt('password'),
        'role' => 'hotel_manager',
        'status' => 'Approved',
        'active' => true,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $hotelId = DB::table('hotels')->insertGetId([
        'name' => 'Original Name',
        'address' => '123 Main St',
        'city_id' => $cityId,
        'created_by' => $managerId,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    Sanctum::actingAs(User::find($managerId));

    $response = $this->putJson("/api/v1/hotels/{$hotelId}", [
        'name' => 'Updated Hotel Name',
    ]);

    $response->assertOk()
        ->assertJsonFragment(['name' => 'Updated Hotel Name']);
});

it('allows admin to update hotel', function () {
    $cityId = DB::table('cities')->insertGetId([
        'name' => 'Test City',
        'region' => 'West',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $managerId = DB::table('users')->insertGetId([
        'first_name' => 'Manager',
        'last_name' => 'User',
        'email' => 'manager6@test.com',
        'phone' => '1234567890',
        'password' => bcrypt('password'),
        'role' => 'hotel_manager',
        'status' => 'Approved',
        'active' => true,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $hotelId = DB::table('hotels')->insertGetId([
        'name' => 'Original Name',
        'address' => '123 Main St',
        'city_id' => $cityId,
        'created_by' => $managerId,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $adminId = DB::table('users')->insertGetId([
        'first_name' => 'Admin',
        'last_name' => 'User',
        'email' => 'admin@test.com',
        'phone' => '9999999999',
        'password' => bcrypt('password'),
        'role' => 'administrator',
        'status' => 'Approved',
        'active' => true,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    Sanctum::actingAs(User::find($adminId));

    $response = $this->putJson("/api/v1/hotels/{$hotelId}", [
        'name' => 'Admin Updated Hotel',
    ]);

    $response->assertOk()
        ->assertJsonFragment(['name' => 'Admin Updated Hotel']);
});

it('fails to update hotel for non-owner non-admin', function () {
    $cityId = DB::table('cities')->insertGetId([
        'name' => 'Test City',
        'region' => 'West',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $managerId = DB::table('users')->insertGetId([
        'first_name' => 'Manager',
        'last_name' => 'User',
        'email' => 'manager7@test.com',
        'phone' => '1234567890',
        'password' => bcrypt('password'),
        'role' => 'hotel_manager',
        'status' => 'Approved',
        'active' => true,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $hotelId = DB::table('hotels')->insertGetId([
        'name' => 'Original Name',
        'address' => '123 Main St',
        'city_id' => $cityId,
        'created_by' => $managerId,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $touristId = DB::table('users')->insertGetId([
        'first_name' => 'Tourist',
        'last_name' => 'User',
        'email' => 'tourist8@test.com',
        'phone' => '0987654321',
        'password' => bcrypt('password'),
        'role' => 'tourist',
        'status' => 'Approved',
        'active' => true,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    Sanctum::actingAs(User::find($touristId));

    $response = $this->putJson("/api/v1/hotels/{$hotelId}", [
        'name' => 'Hijacked Hotel',
    ]);

    $response->assertForbidden();
});

it('allows owner to delete hotel', function () {
    $cityId = DB::table('cities')->insertGetId([
        'name' => 'Test City',
        'region' => 'West',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $managerId = DB::table('users')->insertGetId([
        'first_name' => 'Manager',
        'last_name' => 'User',
        'email' => 'manager8@test.com',
        'phone' => '1234567890',
        'password' => bcrypt('password'),
        'role' => 'hotel_manager',
        'status' => 'Approved',
        'active' => true,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $hotelId = DB::table('hotels')->insertGetId([
        'name' => 'Delete Me',
        'address' => '123 Main St',
        'city_id' => $cityId,
        'created_by' => $managerId,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    Sanctum::actingAs(User::find($managerId));

    $response = $this->deleteJson("/api/v1/hotels/{$hotelId}");

    $response->assertOk()
        ->assertJsonFragment(['message' => 'Hotel deleted successfully']);

    $this->assertSoftDeleted('hotels', ['id' => $hotelId]);
});
