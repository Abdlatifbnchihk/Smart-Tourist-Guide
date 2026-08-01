<?php

use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

beforeEach(function () {
    disableForeignKeys();
});

test('list all drivers returns 200', function () {
    $city = createCity();
    $user = createDriver();
    createDriverProfile($user, ['city_id' => $city->id]);

    actingAsTourist();

    $response = $this->getJson('/api/v1/drivers');

    $response->assertOk()
        ->assertJsonStructure([
            'data' => [
                '*' => ['id', 'license_number'],
            ],
        ]);
});

test('list filters by city_id', function () {
    $cityA = createCity();
    $cityB = createCity();
    $userA = createDriver();
    $userB = createDriver();
    createDriverProfile($userA, ['city_id' => $cityA->id]);
    createDriverProfile($userB, ['city_id' => $cityB->id]);

    actingAsTourist();

    $response = $this->getJson('/api/v1/drivers?city_id='.$cityA->id);

    $response->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.city_id', $cityA->id);
});

test('list filters by verified', function () {
    $city = createCity();
    $userA = createDriver();
    $userB = createDriver();
    createDriverProfile($userA, ['city_id' => $city->id, 'is_verified' => true]);
    createDriverProfile($userB, ['city_id' => $city->id, 'is_verified' => false]);

    actingAsTourist();

    $response = $this->getJson('/api/v1/drivers?verified=true');

    $response->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.is_verified', true);
});

test('store creates driver profile for driver user', function () {
    $city = createCity();
    $user = createDriver();
    Sanctum::actingAs($user);

    $response = $this->postJson('/api/v1/drivers', [
        'city_id' => $city->id,
        'license_number' => 'DL12345',
        'years_of_experience' => 5,
        'languages' => 'English, Spanish',
        'available' => true,
    ]);

    $response->assertCreated()
        ->assertJsonPath('message', 'Driver profile created successfully')
        ->assertJsonStructure([
            'message',
            'driver' => ['id', 'license_number', 'user'],
        ]);
});

test('store fails for non-driver user', function () {
    $city = createCity();
    actingAsTourist();

    $response = $this->postJson('/api/v1/drivers', [
        'city_id' => $city->id,
        'license_number' => 'DL12345',
    ]);

    $response->assertForbidden()
        ->assertJsonPath('message', 'Only users with driver role can create a driver profile');
});

test('store fails with missing required fields', function () {
    $user = createDriver();
    Sanctum::actingAs($user);

    $response = $this->postJson('/api/v1/drivers', []);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['city_id', 'license_number']);
});

test('show returns driver', function () {
    $city = createCity();
    $user = createDriver();
    $driver = createDriverProfile($user, ['city_id' => $city->id]);
    actingAsTourist();

    $response = $this->getJson('/api/v1/drivers/'.$driver->id);

    $response->assertOk()
        ->assertJsonPath('data.id', $driver->id)
        ->assertJsonPath('data.license_number', $driver->license_number);
});

test('show returns 404 for non-existent driver', function () {
    actingAsTourist();

    $response = $this->getJson('/api/v1/drivers/99999');

    $response->assertNotFound();
});

test('update allows owner to update', function () {
    $city = createCity();
    $user = createDriver();
    $driver = createDriverProfile($user, ['city_id' => $city->id]);
    Sanctum::actingAs($user);

    $response = $this->putJson('/api/v1/drivers/'.$driver->id, [
        'city_id' => $city->id,
        'license_number' => 'DL99999',
        'languages' => 'French',
    ]);

    $response->assertOk()
        ->assertJsonPath('message', 'Driver profile updated successfully')
        ->assertJsonPath('driver.license_number', 'DL99999');
});

test('update fails for non-owner non-admin', function () {
    $city = createCity();
    $user = createDriver();
    $driver = createDriverProfile($user, ['city_id' => $city->id]);
    $otherUser = createDriver();
    Sanctum::actingAs($otherUser);

    $response = $this->putJson('/api/v1/drivers/'.$driver->id, [
        'city_id' => $city->id,
        'license_number' => 'DL00000',
    ]);

    $response->assertForbidden()
        ->assertJsonPath('message', 'You are not authorized to update this driver profile');
});

test('verify allows admin to toggle', function () {
    $city = createCity();
    $user = createDriver();
    $driver = createDriverProfile($user, ['city_id' => $city->id, 'is_verified' => false]);
    actingAsAdmin();

    $response = $this->patchJson('/api/v1/drivers/'.$driver->id.'/verify');

    $response->assertOk()
        ->assertJsonPath('message', 'Driver verification toggled successfully')
        ->assertJsonPath('driver.is_verified', true);
});

test('verify fails for non-admin', function () {
    $city = createCity();
    $user = createDriver();
    $driver = createDriverProfile($user, ['city_id' => $city->id]);
    actingAsTourist();

    $response = $this->patchJson('/api/v1/drivers/'.$driver->id.'/verify');

    $response->assertForbidden();
});
