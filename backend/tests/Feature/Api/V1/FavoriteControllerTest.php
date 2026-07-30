<?php

namespace Tests\Feature\Api\V1;

use App\Models\Favorite;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class FavoriteControllerTest extends TestCase
{
    use RefreshDatabase;

    private int $touristId;

    private int $otherTouristId;

    private int $hotelId;

    private int $attractionId;

    private int $restaurantId;

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

        // Create other tourist
        $this->otherTouristId = DB::table('users')->insertGetId([
            'first_name' => 'Other',
            'last_name' => 'Tourist',
            'email' => 'other@test.com',
            'phone' => '0987654321',
            'password' => bcrypt('password'),
            'role' => 'tourist',
            'status' => 'Approved',
            'active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Create hotel manager
        $hotelManagerId = DB::table('users')->insertGetId([
            'first_name' => 'Hotel',
            'last_name' => 'Manager',
            'email' => 'manager@test.com',
            'phone' => '1111111111',
            'password' => bcrypt('password'),
            'role' => 'hotel_manager',
            'status' => 'Approved',
            'active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Create hotel
        $this->hotelId = DB::table('hotels')->insertGetId([
            'name' => 'Test Hotel',
            'address' => '123 Test St',
            'city_id' => $cityId,
            'created_by' => $hotelManagerId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Create attraction
        $this->attractionId = DB::table('attractions')->insertGetId([
            'name' => 'Test Attraction',
            'description' => 'A beautiful attraction',
            'city_id' => $cityId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Create restaurant
        $this->restaurantId = DB::table('restaurants')->insertGetId([
            'name' => 'Test Restaurant',
            'description' => 'A great restaurant',
            'city_id' => $cityId,
            'cuisine' => 'Italian',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Create initial favorite for testing delete
        DB::table('favorites')->insert([
            'user_id' => $this->touristId,
            'hotel_id' => $this->hotelId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function test_list_all_favorites(): void
    {
        Sanctum::actingAs(User::find($this->touristId));

        $response = $this->getJson('/api/v1/favorites');

        $response->assertOk()
            ->assertJsonCount(1, 'data');
    }

    public function test_filter_favorites_by_hotel_type(): void
    {
        // Add attraction favorite
        DB::table('favorites')->insert([
            'user_id' => $this->touristId,
            'attraction_id' => $this->attractionId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Sanctum::actingAs(User::find($this->touristId));

        $response = $this->getJson('/api/v1/favorites?type=hotel');

        $response->assertOk()
            ->assertJsonCount(1, 'data');
    }

    public function test_filter_favorites_by_attraction_type(): void
    {
        // Add attraction favorite
        DB::table('favorites')->insert([
            'user_id' => $this->touristId,
            'attraction_id' => $this->attractionId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Sanctum::actingAs(User::find($this->touristId));

        $response = $this->getJson('/api/v1/favorites?type=attraction');

        $response->assertOk()
            ->assertJsonCount(1, 'data');
    }

    public function test_add_new_favorite(): void
    {
        Sanctum::actingAs(User::find($this->touristId));

        $response = $this->postJson('/api/v1/favorites/toggle', [
            'type' => 'attraction',
            'id' => $this->attractionId,
        ]);

        $response->assertCreated()
            ->assertJsonPath('action', 'added')
            ->assertJsonPath('favorite.attraction_id', $this->attractionId);
    }

    public function test_remove_existing_favorite(): void
    {
        Sanctum::actingAs(User::find($this->touristId));

        $response = $this->postJson('/api/v1/favorites/toggle', [
            'type' => 'hotel',
            'id' => $this->hotelId,
        ]);

        $response->assertOk()
            ->assertJsonPath('action', 'removed');
    }

    public function test_invalid_type_validation_error(): void
    {
        Sanctum::actingAs(User::find($this->touristId));

        $response = $this->postJson('/api/v1/favorites/toggle', [
            'type' => 'invalid',
            'id' => 1,
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['type']);
    }

    public function test_nonexistent_entity_validation_error(): void
    {
        Sanctum::actingAs(User::find($this->touristId));

        $response = $this->postJson('/api/v1/favorites/toggle', [
            'type' => 'hotel',
            'id' => 99999,
        ]);

        $response->assertUnprocessable();
    }

    public function test_delete_favorite_by_id(): void
    {
        $favorite = DB::table('favorites')->where('user_id', $this->touristId)->first();

        Sanctum::actingAs(User::find($this->touristId));

        $response = $this->deleteJson("/api/v1/favorites/{$favorite->id}");

        $response->assertOk()
            ->assertJsonPath('message', 'Favorite removed successfully');
    }

    public function test_delete_nonexistent_favorite(): void
    {
        Sanctum::actingAs(User::find($this->touristId));

        $response = $this->deleteJson('/api/v1/favorites/99999');

        $response->assertNotFound();
    }

    public function test_delete_other_users_favorite(): void
    {
        // Create favorite for other user
        $otherFavoriteId = DB::table('favorites')->insertGetId([
            'user_id' => $this->otherTouristId,
            'hotel_id' => $this->hotelId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Sanctum::actingAs(User::find($this->touristId));

        $response = $this->deleteJson("/api/v1/favorites/{$otherFavoriteId}");

        $response->assertForbidden();
    }
}
