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

it('lists rooms for hotel', function () {
    $hotelManager = createHotelManager();
    $hotel = createHotel(['created_by' => $hotelManager->id]);
    $room1 = createRoom(['hotel_id' => $hotel->id]);
    $room2 = createRoom(['hotel_id' => $hotel->id]);
    actingAsTourist();

    $response = $this->getJson("/api/v1/hotels/{$hotel->id}/rooms");

    $response->assertOk()
        ->assertJsonCount(2, 'data');
});

it('filters rooms by type', function () {
    $hotelManager = createHotelManager();
    $hotel = createHotel(['created_by' => $hotelManager->id]);
    createRoom(['hotel_id' => $hotel->id, 'type' => 'single']);
    createRoom(['hotel_id' => $hotel->id, 'type' => 'double']);
    actingAsTourist();

    $response = $this->getJson("/api/v1/hotels/{$hotel->id}/rooms?type=single");

    $response->assertOk()
        ->assertJsonCount(1, 'data');
});

it('creates room for hotel owner', function () {
    $hotelManager = createHotelManager();
    $hotel = createHotel(['created_by' => $hotelManager->id]);

    Sanctum::actingAs($hotelManager);

    $response = $this->postJson("/api/v1/hotels/{$hotel->id}/rooms", [
        'number' => '101',
        'type' => 'single',
        'capacity' => 2,
        'price_per_night' => 100.00,
        'available' => true,
    ]);

    $response->assertCreated()
        ->assertJsonFragment(['number' => '101']);
});

it('fails to create room for non-owner non-admin', function () {
    $hotelManager = createHotelManager();
    $otherManager = createHotelManager();
    $hotel = createHotel(['created_by' => $hotelManager->id]);

    Sanctum::actingAs($otherManager);

    $response = $this->postJson("/api/v1/hotels/{$hotel->id}/rooms", [
        'number' => '101',
        'type' => 'single',
        'capacity' => 2,
        'price_per_night' => 100.00,
    ]);

    $response->assertForbidden();
});

it('fails to create room with missing fields', function () {
    $hotelManager = createHotelManager();
    $hotel = createHotel(['created_by' => $hotelManager->id]);

    Sanctum::actingAs($hotelManager);

    $response = $this->postJson("/api/v1/hotels/{$hotel->id}/rooms", []);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['number', 'type', 'capacity', 'price_per_night']);
});

it('shows room', function () {
    $hotelManager = createHotelManager();
    $hotel = createHotel(['created_by' => $hotelManager->id]);
    $room = createRoom(['hotel_id' => $hotel->id]);
    actingAsTourist();

    $response = $this->getJson("/api/v1/rooms/{$room->room_id}");

    $response->assertOk()
        ->assertJsonFragment(['room_id' => $room->room_id]);
});

test('show returns 404 for non-existent room', function () {
    actingAsTourist();

    $response = $this->getJson('/api/v1/rooms/9999');

    $response->assertNotFound();
});

it('allows hotel owner to update room', function () {
    $hotelManager = createHotelManager();
    $hotel = createHotel(['created_by' => $hotelManager->id]);
    $room = createRoom(['hotel_id' => $hotel->id]);

    Sanctum::actingAs($hotelManager);

    $response = $this->putJson("/api/v1/rooms/{$room->room_id}", [
        'number' => '102',
        'type' => 'double',
    ]);

    $response->assertOk()
        ->assertJsonFragment(['number' => '102']);
});

it('fails to update room for non-owner', function () {
    $hotelManager = createHotelManager();
    $otherManager = createHotelManager();
    $hotel = createHotel(['created_by' => $hotelManager->id]);
    $room = createRoom(['hotel_id' => $hotel->id]);

    Sanctum::actingAs($otherManager);

    $response = $this->putJson("/api/v1/rooms/{$room->room_id}", [
        'number' => '102',
    ]);

    $response->assertForbidden();
});

it('soft-deletes room', function () {
    $hotelManager = createHotelManager();
    $hotel = createHotel(['created_by' => $hotelManager->id]);
    $room = createRoom(['hotel_id' => $hotel->id]);

    Sanctum::actingAs($hotelManager);

    $response = $this->deleteJson("/api/v1/rooms/{$room->room_id}");

    $response->assertOk();

    $this->assertSoftDeleted('rooms', ['room_id' => $room->room_id]);
});

it('restores soft-deleted room', function () {
    $hotelManager = createHotelManager();
    $hotel = createHotel(['created_by' => $hotelManager->id]);
    $room = createRoom(['hotel_id' => $hotel->id]);

    Sanctum::actingAs($hotelManager);

    $this->deleteJson("/api/v1/rooms/{$room->room_id}");

    $response = $this->putJson("/api/v1/rooms/{$room->room_id}/restore");

    $response->assertOk();

    $this->assertDatabaseHas('rooms', ['room_id' => $room->room_id, 'deleted_at' => null]);
});
