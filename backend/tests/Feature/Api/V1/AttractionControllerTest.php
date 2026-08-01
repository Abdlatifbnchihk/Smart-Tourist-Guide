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

it('allows listing all attractions', function () {
    $user = createTourist();
    Sanctum::actingAs($user);

    $cityId = DB::table('cities')->insertGetId([
        'name' => 'Test City',
        'region' => 'Test Region',
        'description' => 'A test city',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    DB::table('attractions')->insert([
        'city_id' => $cityId,
        'name' => 'Attraction One',
        'slug' => 'attraction-one',
        'created_at' => now(),
        'updated_at' => now(),
    ]);
    DB::table('attractions')->insert([
        'city_id' => $cityId,
        'name' => 'Attraction Two',
        'slug' => 'attraction-two',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $response = $this->getJson('/api/v1/attractions');

    $response->assertOk()
        ->assertJsonCount(2, 'data');
});

it('allows filtering attractions by city_id', function () {
    $user = createTourist();
    Sanctum::actingAs($user);

    $cityId = DB::table('cities')->insertGetId([
        'name' => 'City One',
        'region' => 'Region One',
        'description' => 'First city',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $otherCityId = DB::table('cities')->insertGetId([
        'name' => 'City Two',
        'region' => 'Region Two',
        'description' => 'Second city',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    DB::table('attractions')->insert([
        'city_id' => $cityId,
        'name' => 'In City One',
        'slug' => 'in-city-one',
        'created_at' => now(),
        'updated_at' => now(),
    ]);
    DB::table('attractions')->insert([
        'city_id' => $otherCityId,
        'name' => 'In City Two',
        'slug' => 'in-city-two',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $response = $this->getJson("/api/v1/attractions?city_id={$otherCityId}");

    $response->assertOk()
        ->assertJsonCount(1, 'data');
});

it('allows filtering attractions by search', function () {
    $user = createTourist();
    Sanctum::actingAs($user);

    $cityId = DB::table('cities')->insertGetId([
        'name' => 'Search City',
        'region' => 'Region',
        'description' => 'City for search',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    DB::table('attractions')->insert([
        'city_id' => $cityId,
        'name' => 'Eiffel Tower',
        'slug' => 'eiffel-tower',
        'created_at' => now(),
        'updated_at' => now(),
    ]);
    DB::table('attractions')->insert([
        'city_id' => $cityId,
        'name' => 'Louvre Museum',
        'slug' => 'louvre-museum',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $response = $this->getJson('/api/v1/attractions?search=Eiffel');

    $response->assertOk()
        ->assertJsonCount(1, 'data');
});

it('allows admin to create an attraction', function () {
    $admin = createAdmin();
    Sanctum::actingAs($admin);

    $cityId = DB::table('cities')->insertGetId([
        'name' => 'Create City',
        'region' => 'Region',
        'description' => 'City for creation',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $response = $this->postJson('/api/v1/attractions', [
        'city_id' => $cityId,
        'name' => 'New Attraction',
        'description' => 'A new place',
        'address' => '123 Main St',
        'opening_hours' => '9am-5pm',
    ]);

    $response->assertCreated()
        ->assertJsonFragment(['name' => 'New Attraction']);
});

it('prevents hotel_manager from creating an attraction', function () {
    $hotelManager = createHotelManager();

    Sanctum::actingAs($hotelManager);

    $cityId = DB::table('cities')->insertGetId([
        'name' => 'Hotel City',
        'region' => 'Region',
        'description' => 'City for testing',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $response = $this->postJson('/api/v1/attractions', [
        'city_id' => $cityId,
        'name' => 'Hotel Attraction',
        'description' => 'Description',
        'address' => '456 Hotel Rd',
        'opening_hours' => '8am-6pm',
    ]);

    $response->assertForbidden();
});

it('prevents tourist from creating an attraction', function () {
    $tourist = createTourist();
    Sanctum::actingAs($tourist);

    $cityId = DB::table('cities')->insertGetId([
        'name' => 'Blocked City',
        'region' => 'Region',
        'description' => 'City for blocked test',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $response = $this->postJson('/api/v1/attractions', [
        'city_id' => $cityId,
        'name' => 'Tourist Attraction',
        'description' => 'Should fail',
    ]);

    $response->assertForbidden();
});

it('auto-generates slug from name when creating attraction', function () {
    $admin = createAdmin();
    Sanctum::actingAs($admin);

    $cityId = DB::table('cities')->insertGetId([
        'name' => 'Slug City',
        'region' => 'Region',
        'description' => 'City for slug test',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $this->postJson('/api/v1/attractions', [
        'city_id' => $cityId,
        'name' => 'My Great Attraction',
        'description' => 'Wonderful place',
    ]);

    $this->assertDatabaseHas('attractions', [
        'name' => 'My Great Attraction',
        'slug' => 'my-great-attraction',
    ]);
});

it('fails to create attraction with missing required fields', function () {
    $admin = createAdmin();
    Sanctum::actingAs($admin);

    $response = $this->postJson('/api/v1/attractions', []);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['city_id', 'name']);
});

it('returns attraction on show', function () {
    $user = createTourist();
    Sanctum::actingAs($user);

    $cityId = DB::table('cities')->insertGetId([
        'name' => 'Show City',
        'region' => 'Region',
        'description' => 'City for show test',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $attractionId = DB::table('attractions')->insertGetId([
        'city_id' => $cityId,
        'name' => 'Visible Attraction',
        'slug' => 'visible-attraction',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $response = $this->getJson("/api/v1/attractions/{$attractionId}");

    $response->assertOk()
        ->assertJsonFragment(['name' => 'Visible Attraction']);
});

it('returns 404 for non-existent attraction', function () {
    $user = createTourist();
    Sanctum::actingAs($user);

    $response = $this->getJson('/api/v1/attractions/9999');

    $response->assertNotFound();
});

it('allows owner to update attraction', function () {
    $admin = createAdmin();
    Sanctum::actingAs($admin);

    $cityId = DB::table('cities')->insertGetId([
        'name' => 'Update City',
        'region' => 'Region',
        'description' => 'City for update test',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $attractionId = DB::table('attractions')->insertGetId([
        'city_id' => $cityId,
        'name' => 'Old Name',
        'slug' => 'old-name',
        'created_by' => $admin->id,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $response = $this->putJson("/api/v1/attractions/{$attractionId}", [
        'city_id' => $cityId,
        'name' => 'Updated Name',
    ]);

    $response->assertOk()
        ->assertJsonFragment(['name' => 'Updated Name']);
});

it('allows owner to delete attraction', function () {
    $admin = createAdmin();
    Sanctum::actingAs($admin);

    $cityId = DB::table('cities')->insertGetId([
        'name' => 'Delete City',
        'region' => 'Region',
        'description' => 'City for delete test',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $attractionId = DB::table('attractions')->insertGetId([
        'city_id' => $cityId,
        'name' => 'Doomed Attraction',
        'slug' => 'doomed-attraction',
        'created_by' => $admin->id,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $response = $this->deleteJson("/api/v1/attractions/{$attractionId}");

    $response->assertOk();
    $this->assertSoftDeleted('attractions', ['id' => $attractionId]);
});

