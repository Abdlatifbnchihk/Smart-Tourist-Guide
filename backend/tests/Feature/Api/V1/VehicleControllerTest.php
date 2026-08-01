<?php

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

beforeEach(function () {
    disableForeignKeys();
});

it('lists vehicles for driver', function () {
    $driverUser = createDriver();
    $driver = createDriverProfile($driverUser);
    $vehicle1 = createVehicle(['driver_id' => $driver->id]);
    $vehicle2 = createVehicle(['driver_id' => $driver->id]);
    Sanctum::actingAs($driverUser);

    $response = $this->getJson("/api/v1/drivers/{$driver->id}/vehicles");

    $response->assertOk()
        ->assertJsonCount(2, 'data');
});

it('creates vehicle for driver owner', function () {
    $driverUser = createDriver();
    $driver = createDriverProfile($driverUser);

    Sanctum::actingAs($driverUser);

    $response = $this->postJson("/api/v1/drivers/{$driver->id}/vehicles", [
        'brand' => 'Toyota',
        'model' => 'Camry',
        'type' => 'sedan',
        'seats' => 4,
        'registration_number' => 'ABC-123',
        'air_conditioning' => true,
        'price_per_km' => 1.50,
    ]);

    $response->assertCreated()
        ->assertJsonFragment(['brand' => 'Toyota']);
});

it('fails to create vehicle for non-owner non-admin', function () {
    $driverUser = createDriver();
    $otherUser = createDriver();
    $driver = createDriverProfile($driverUser);
    $otherDriver = createDriverProfile($otherUser);

    Sanctum::actingAs($otherUser);

    $response = $this->postJson("/api/v1/drivers/{$driver->id}/vehicles", [
        'brand' => 'Toyota',
        'model' => 'Camry',
        'type' => 'sedan',
        'seats' => 4,
        'registration_number' => 'ABC-124',
        'price_per_km' => 1.50,
    ]);

    $response->assertForbidden();
});

it('fails to create vehicle with missing fields', function () {
    $driverUser = createDriver();
    $driver = createDriverProfile($driverUser);

    Sanctum::actingAs($driverUser);

    $response = $this->postJson("/api/v1/drivers/{$driver->id}/vehicles", []);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['brand', 'model', 'type', 'seats', 'registration_number', 'price_per_km']);
});

it('shows vehicle', function () {
    $driverUser = createDriver();
    $driver = createDriverProfile($driverUser);
    $vehicle = createVehicle(['driver_id' => $driver->id]);
    Sanctum::actingAs($driverUser);

    $response = $this->getJson("/api/v1/vehicles/{$vehicle->vehicle_id}");

    $response->assertOk()
        ->assertJsonFragment(['id' => $vehicle->vehicle_id]);
});

test('show returns 404 for non-existent vehicle', function () {
    actingAsTourist();

    $response = $this->getJson('/api/v1/vehicles/9999');

    $response->assertNotFound();
});

it('allows driver owner to update vehicle', function () {
    $driverUser = createDriver();
    $driver = createDriverProfile($driverUser);
    $vehicle = createVehicle(['driver_id' => $driver->id]);

    Sanctum::actingAs($driverUser);

    $response = $this->putJson("/api/v1/vehicles/{$vehicle->vehicle_id}", [
        'brand' => 'Honda',
        'model' => 'Civic',
    ]);

    $response->assertOk()
        ->assertJsonFragment(['brand' => 'Honda']);
});

it('fails to update vehicle for non-owner', function () {
    $driverUser = createDriver();
    $otherUser = createDriver();
    $driver = createDriverProfile($driverUser);
    $otherDriver = createDriverProfile($otherUser);
    $vehicle = createVehicle(['driver_id' => $driver->id]);

    Sanctum::actingAs($otherUser);

    $response = $this->putJson("/api/v1/vehicles/{$vehicle->vehicle_id}", [
        'brand' => 'Honda',
    ]);

    $response->assertForbidden();
});

it('deletes vehicle', function () {
    $driverUser = createDriver();
    $driver = createDriverProfile($driverUser);
    $vehicle = createVehicle(['driver_id' => $driver->id]);

    Sanctum::actingAs($driverUser);

    $response = $this->deleteJson("/api/v1/vehicles/{$vehicle->vehicle_id}");

    $response->assertOk();

    $this->assertDatabaseMissing('vehicles', ['vehicle_id' => $vehicle->vehicle_id]);
});
