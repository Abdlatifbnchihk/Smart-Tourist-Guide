<?php

use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    disableForeignKeys();
});

test('list all restaurants returns 200', function () {
    $city = createCity();
    createRestaurant(['city_id' => $city->id]);
    createRestaurant(['city_id' => $city->id]);

    actingAsTourist();

    $response = $this->getJson('/api/v1/restaurants');

    $response->assertOk()
        ->assertJsonCount(2, 'data');
});

test('store creates restaurant when authenticated', function () {
    $city = createCity();
    actingAsTourist();

    $response = $this->postJson('/api/v1/restaurants', [
        'city_id' => $city->id,
        'name' => 'Test Restaurant',
        'description' => 'A great place to eat',
        'address' => '123 Main St',
        'cuisine' => 'Italian',
        'phone' => '1234567890',
        'price_range' => 3,
    ]);

    $response->assertCreated()
        ->assertJsonPath('message', 'Restaurant created successfully')
        ->assertJsonStructure([
            'message',
            'restaurant' => ['restaurant_id', 'name', 'cuisine'],
        ]);
});

test('store fails without auth', function () {
    $city = createCity();

    $response = $this->postJson('/api/v1/restaurants', [
        'city_id' => $city->id,
        'name' => 'Test Restaurant',
        'cuisine' => 'Italian',
    ]);

    $response->assertUnauthorized();
});

test('store fails with missing required fields', function () {
    actingAsTourist();

    $response = $this->postJson('/api/v1/restaurants', [
        'name' => 'Test Restaurant',
    ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['city_id', 'cuisine']);
});

test('show returns restaurant', function () {
    $city = createCity();
    $restaurant = createRestaurant(['city_id' => $city->id]);
    actingAsTourist();

    $response = $this->getJson('/api/v1/restaurants/'.$restaurant->id);

    $response->assertOk()
        ->assertJsonPath('data.restaurant_id', $restaurant->id)
        ->assertJsonPath('data.name', $restaurant->name);
});

test('show returns 404 for non-existent restaurant', function () {
    actingAsTourist();

    $response = $this->getJson('/api/v1/restaurants/99999');

    $response->assertNotFound();
});

test('update modifies restaurant', function () {
    $city = createCity();
    $restaurant = createRestaurant(['city_id' => $city->id]);
    actingAsTourist();

    $response = $this->putJson('/api/v1/restaurants/'.$restaurant->id, [
        'city_id' => $city->id,
        'name' => 'Updated Restaurant',
        'cuisine' => 'Japanese',
    ]);

    $response->assertOk()
        ->assertJsonPath('message', 'Restaurant updated successfully')
        ->assertJsonPath('restaurant.name', 'Updated Restaurant');
});

test('destroy deletes restaurant', function () {
    $city = createCity();
    $restaurant = createRestaurant(['city_id' => $city->id]);
    actingAsTourist();

    $response = $this->deleteJson('/api/v1/restaurants/'.$restaurant->id);

    $response->assertOk()
        ->assertJsonPath('message', 'Restaurant deleted successfully');
    $this->assertDatabaseMissing('restaurants', ['id' => $restaurant->id]);
});
