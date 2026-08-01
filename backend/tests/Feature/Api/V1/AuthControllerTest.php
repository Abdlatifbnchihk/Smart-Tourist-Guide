<?php

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;

uses(RefreshDatabase::class);

beforeEach(function () {
    disableForeignKeys();
});

test('tourist can register successfully', function () {
    $response = $this->postJson('/api/v1/auth/register', [
        'first_name' => 'John',
        'last_name' => 'Doe',
        'email' => 'john@example.com',
        'phone' => '1234567890',
        'password' => 'password123',
        'password_confirmation' => 'password123',
        'role' => 'tourist',
    ]);

    $response->assertStatus(201)
        ->assertJsonStructure([
            'user' => ['id', 'first_name', 'last_name', 'email', 'role'],
            'token',
        ]);

    $this->assertDatabaseHas('users', [
        'email' => 'john@example.com',
        'role' => 'tourist',
    ]);
});

test('driver can register with city_id and license_number', function () {
    $city = createCity();

    $response = $this->postJson('/api/v1/auth/register', [
        'first_name' => 'Ahmed',
        'last_name' => 'Hassan',
        'email' => 'ahmed@example.com',
        'phone' => '0987654321',
        'password' => 'password123',
        'password_confirmation' => 'password123',
        'role' => 'driver',
        'city_id' => $city->id,
        'license_number' => 'LIC001',
    ]);

    $response->assertStatus(201)
        ->assertJsonStructure([
            'user' => ['id', 'first_name', 'last_name', 'email', 'role'],
            'token',
        ]);

    $this->assertDatabaseHas('users', [
        'email' => 'ahmed@example.com',
        'role' => 'driver',
    ]);

    $this->assertDatabaseHas('drivers', [
        'license_number' => 'LIC001',
    ]);
});

test('registration fails with missing required fields', function () {
    $response = $this->postJson('/api/v1/auth/register', []);

    $response->assertStatus(422)
        ->assertJsonValidationErrors([
            'first_name', 'last_name', 'email', 'phone', 'password', 'role',
        ]);
});

test('registration fails with duplicate email', function () {
    createTourist(['email' => 'existing@example.com']);

    $response = $this->postJson('/api/v1/auth/register', [
        'first_name' => 'Jane',
        'last_name' => 'Doe',
        'email' => 'existing@example.com',
        'phone' => '1122334455',
        'password' => 'password123',
        'password_confirmation' => 'password123',
        'role' => 'tourist',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['email']);
});

test('registration fails with short password', function () {
    $response = $this->postJson('/api/v1/auth/register', [
        'first_name' => 'John',
        'last_name' => 'Doe',
        'email' => 'john@example.com',
        'phone' => '1234567890',
        'password' => 'short',
        'password_confirmation' => 'short',
        'role' => 'tourist',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['password']);
});

test('login with valid credentials', function () {
    createTourist([
        'email' => 'login@example.com',
        'password' => bcrypt('password123'),
    ]);

    $response = $this->postJson('/api/v1/auth/login', [
        'email' => 'login@example.com',
        'password' => 'password123',
    ]);

    $response->assertOk()
        ->assertJsonStructure([
            'user' => ['id', 'email'],
            'token',
        ]);
});

test('login fails with wrong password', function () {
    createTourist([
        'email' => 'login@example.com',
        'password' => bcrypt('password123'),
    ]);

    $response = $this->postJson('/api/v1/auth/login', [
        'email' => 'login@example.com',
        'password' => 'wrongpassword',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['email']);
});

test('login fails with non-existent email', function () {
    $response = $this->postJson('/api/v1/auth/login', [
        'email' => 'nonexistent@example.com',
        'password' => 'password123',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['email']);
});

test('logout revokes current token', function () {
    $user = actingAsTourist();

    $response = $this->postJson('/api/v1/auth/logout');

    $response->assertOk()
        ->assertJson(['message' => 'Logged out successfully']);

    $this->assertDatabaseCount('personal_access_tokens', 0);
});

test('me returns authenticated user', function () {
    $user = actingAsTourist();

    $response = $this->getJson('/api/v1/auth/me');

    $response->assertOk()
        ->assertJsonFragment([
            'email' => $user->email,
            'role' => $user->role,
        ]);
});

test('me fails without token', function () {
    $response = $this->getJson('/api/v1/auth/me');

    $response->assertStatus(401);
});

test('issueToken creates new token', function () {
    $user = actingAsTourist();

    $response = $this->postJson('/api/v1/tokens', [
        'name' => 'test-token',
    ]);

    $response->assertStatus(201)
        ->assertJsonStructure([
            'token',
            'token_id',
            'name',
            'abilities',
            'created_at',
        ]);

    $this->assertDatabaseHas('personal_access_tokens', [
        'name' => 'test-token',
    ]);
});

test('listTokens returns tokens', function () {
    $user = actingAsTourist();
    $user->createToken('token-one');
    $user->createToken('token-two');

    $response = $this->getJson('/api/v1/tokens');

    $response->assertOk()
        ->assertJsonStructure(['tokens'])
        ->assertJsonCount(2, 'tokens');
});

test('revokeToken deletes specific token', function () {
    $user = actingAsTourist();
    $token = $user->createToken('revoke-me');

    $response = $this->deleteJson('/api/v1/tokens/' . $token->accessToken->id);

    $response->assertOk()
        ->assertJson(['message' => 'Token revoked successfully']);

    $this->assertDatabaseMissing('personal_access_tokens', [
        'id' => $token->accessToken->id,
    ]);
});

test('revokeAllTokens deletes all tokens', function () {
    $user = actingAsTourist();
    $user->createToken('token-one');
    $user->createToken('token-two');

    $response = $this->deleteJson('/api/v1/tokens');

    $response->assertOk()
        ->assertJson(['message' => 'All tokens revoked successfully']);

    $this->assertDatabaseCount('personal_access_tokens', 0);
});
