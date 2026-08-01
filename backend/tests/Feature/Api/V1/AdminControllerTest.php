<?php

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

beforeEach(function () {
    disableForeignKeys();
});

it('allows admin to list users', function () {
    $admin = createAdmin();
    Sanctum::actingAs($admin);
    createTourist();

    $response = $this->getJson('/api/v1/admin/users');

    $response->assertOk()
        ->assertJsonCount(2, 'data');
});

it('allows admin to filter users by role', function () {
    $admin = createAdmin();
    Sanctum::actingAs($admin);
    createTourist();
    createDriver();

    $response = $this->getJson('/api/v1/admin/users?role=tourist');

    $response->assertOk()
        ->assertJsonCount(1, 'data');
});

it('allows admin to search users', function () {
    $admin = createAdmin();
    Sanctum::actingAs($admin);
    createTourist(['first_name' => 'John', 'last_name' => 'Doe']);

    $response = $this->getJson('/api/v1/admin/users?search=John');

    $response->assertOk()
        ->assertJsonCount(1, 'data');
});

it('prevents non-admin from accessing admin routes', function () {
    $tourist = createTourist();
    Sanctum::actingAs($tourist);

    $response = $this->getJson('/api/v1/admin/users');

    $response->assertForbidden();
});

it('allows admin to create a user', function () {
    $admin = createAdmin();
    Sanctum::actingAs($admin);

    $response = $this->postJson('/api/v1/admin/users', [
        'first_name' => 'Jane',
        'last_name' => 'Smith',
        'email' => 'jane@example.com',
        'phone' => '1234567890',
        'password' => 'password123',
        'password_confirmation' => 'password123',
        'role' => 'Tourist',
    ]);

    $response->assertCreated()
        ->assertJsonFragment(['email' => 'jane@example.com']);
});

it('allows admin to create a driver user with driver profile', function () {
    $admin = createAdmin();
    Sanctum::actingAs($admin);

    $cityId = DB::table('cities')->insertGetId([
        'name' => 'Driver City',
        'region' => 'Region',
        'description' => 'A city for drivers',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $response = $this->postJson('/api/v1/admin/users', [
        'first_name' => 'Driver',
        'last_name' => 'User',
        'email' => 'driver@example.com',
        'phone' => '5555555555',
        'password' => 'password123',
        'password_confirmation' => 'password123',
        'role' => 'Driver',
        'city_id' => $cityId,
        'license_number' => 'DL-998877',
    ]);

    $response->assertCreated()
        ->assertJsonFragment(['email' => 'driver@example.com']);

    $this->assertDatabaseHas('drivers', [
        'license_number' => 'DL-998877',
    ]);
});

it('allows admin to show a user', function () {
    $admin = createAdmin();
    Sanctum::actingAs($admin);
    $user = createTourist();

    $response = $this->getJson("/api/v1/admin/users/{$user->id}");

    $response->assertOk();
});

it('allows admin to update a user', function () {
    $admin = createAdmin();
    Sanctum::actingAs($admin);
    $user = createTourist();

    $response = $this->putJson("/api/v1/admin/users/{$user->id}", [
        'first_name' => 'Updated',
        'last_name' => 'Name',
        'email' => $user->email,
        'phone' => $user->phone,
        'role' => 'Tourist',
    ]);

    $response->assertOk();
});

it('allows admin to delete a user', function () {
    $admin = createAdmin();
    Sanctum::actingAs($admin);
    $user = createTourist();

    $response = $this->deleteJson("/api/v1/admin/users/{$user->id}");

    $response->assertOk();
    $this->assertDatabaseMissing('users', ['id' => $user->id]);
});
