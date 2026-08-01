<?php

use Tests\TestCase;
use App\Models\User;
use App\Models\City;
use App\Models\Hotel;
use App\Models\Room;
use App\Models\Driver;
use App\Models\Vehicle;
use App\Models\Attraction;
use App\Models\Restaurant;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\Sanctum;

uses(TestCase::class)->in('Feature', 'Unit');

/*
|--------------------------------------------------------------------------
| Helper Functions
|--------------------------------------------------------------------------
*/

function createTourist(array $overrides = []): User
{
    $user = User::factory()->create(array_merge([
        'role' => 'tourist',
        'status' => 'Approved',
    ], $overrides));

    return $user;
}

function createDriver(array $overrides = []): User
{
    $user = User::factory()->create(array_merge([
        'role' => 'driver',
        'status' => 'Approved',
    ], $overrides));

    return $user;
}

function createHotelManager(array $overrides = []): User
{
    $user = User::factory()->create(array_merge([
        'role' => 'hotel_manager',
        'status' => 'Approved',
    ], $overrides));

    return $user;
}

function createAdmin(array $overrides = []): User
{
    $user = User::factory()->create(array_merge([
        'role' => 'administrator',
        'status' => 'Approved',
    ], $overrides));

    return $user;
}

function createCity(array $overrides = []): City
{
    return City::factory()->create($overrides);
}

function createHotel(array $overrides = []): Hotel
{
    return Hotel::factory()->create($overrides);
}

function createRoom(array $overrides = []): Room
{
    return Room::factory()->create($overrides);
}

function createDriverProfile(User $user, array $overrides = []): Driver
{
    return Driver::factory()->create(array_merge([
        'user_id' => $user->id,
        'city_id' => createCity()->id,
    ], $overrides));
}

function createVehicle(array $overrides = []): Vehicle
{
    return Vehicle::factory()->create($overrides);
}

function createAttraction(array $overrides = []): Attraction
{
    return Attraction::factory()->create($overrides);
}

function createRestaurant(array $overrides = []): Restaurant
{
    return Restaurant::factory()->create($overrides);
}

function actingAsTourist(?User $user = null): User
{
    $user = $user ?? createTourist();
    Sanctum::actingAs($user);
    return $user;
}

function actingAsDriver(?User $user = null): User
{
    $user = $user ?? createDriver();
    Sanctum::actingAs($user);
    return $user;
}

function actingAsHotelManager(?User $user = null): User
{
    $user = $user ?? createHotelManager();
    Sanctum::actingAs($user);
    return $user;
}

function actingAsAdmin(?User $user = null): User
{
    $user = $user ?? createAdmin();
    Sanctum::actingAs($user);
    return $user;
}

function disableForeignKeys(): void
{
    if (DB::getDriverName() === 'sqlite') {
        DB::unprepared('PRAGMA foreign_keys = OFF');
    }
}
