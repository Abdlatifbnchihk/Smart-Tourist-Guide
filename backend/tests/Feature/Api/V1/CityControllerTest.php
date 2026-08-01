<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

beforeEach(function () {
    disableForeignKeys();

    if (! Schema::hasColumn('attractions', 'deleted_at')) {
        Schema::table('attractions', function (Blueprint $table) {
            $table->softDeletes();
        });
    }
});

test('list all cities', function () {
    createCity(['name' => 'Cairo']);
    createCity(['name' => 'Alexandria']);
    actingAsTourist();

    $response = $this->getJson('/api/v1/cities');

    $response->assertOk()
        ->assertJsonCount(2, 'data');
});

test('store creates city when authenticated', function () {
    actingAsAdmin();

    $response = $this->postJson('/api/v1/cities', [
        'name' => 'Luxor',
        'description' => 'The city of temples',
        'region' => 'Upper Egypt',
    ]);

    $response->assertStatus(201)
        ->assertJsonFragment(['name' => 'Luxor']);

    $this->assertDatabaseHas('cities', ['name' => 'Luxor']);
});

test('store fails without authentication', function () {
    $response = $this->postJson('/api/v1/cities', [
        'name' => 'Aswan',
    ]);

    $response->assertStatus(401);
});

test('store fails with missing name', function () {
    actingAsAdmin();

    $response = $this->postJson('/api/v1/cities', [
        'description' => 'A city without a name',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['name']);
});

test('show returns city', function () {
    $city = createCity(['name' => 'Giza']);
    actingAsTourist();

    $response = $this->getJson('/api/v1/cities/' . $city->id);

    $response->assertOk()
        ->assertJsonFragment([
            'city_id' => $city->id,
            'name' => 'Giza',
        ]);
});

test('show returns 404 for non-existent', function () {
    actingAsTourist();

    $response = $this->getJson('/api/v1/cities/9999');

    $response->assertNotFound();
});

test('update modifies city', function () {
    $city = createCity(['name' => 'Old Name']);
    actingAsAdmin();

    $response = $this->putJson('/api/v1/cities/' . $city->id, [
        'name' => 'New Name',
    ]);

    $response->assertOk()
        ->assertJsonFragment(['name' => 'New Name']);

    $this->assertDatabaseHas('cities', [
        'id' => $city->id,
        'name' => 'New Name',
    ]);
});

test('update fails with invalid data', function () {
    $city = createCity();
    actingAsAdmin();

    $response = $this->putJson('/api/v1/cities/' . $city->id, [
        'name' => '',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['name']);
});

test('destroy deletes city', function () {
    $city = createCity();
    actingAsAdmin();

    $response = $this->deleteJson('/api/v1/cities/' . $city->id);

    $response->assertOk()
        ->assertJson(['message' => 'City deleted successfully']);

    $this->assertDatabaseMissing('cities', ['id' => $city->id]);
});
