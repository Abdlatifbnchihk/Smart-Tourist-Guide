<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Smart Tourist Guide API Routes - Versioned under /api/v1
|
*/

Route::prefix('v1')->group(function () {

    // Health check (public)
    Route::get('/health', function () {
        return response()->json([
            'status' => 'ok',
            'timestamp' => now()->toISOString(),
        ]);
    });

    // Auth routes (public)
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);

    // Protected routes (require authentication)
    Route::middleware('auth:sanctum')->group(function () {

        // Test route for Sanctum verification
        Route::get('/test-auth', function () {
            return response()->json(['message' => 'Authenticated successfully']);
        });

        // Token management routes
        Route::post('/tokens', [AuthController::class, 'issueToken']);
        Route::get('/tokens', [AuthController::class, 'listTokens']);
        Route::delete('/tokens/{tokenId}', [AuthController::class, 'revokeToken']);
        Route::delete('/tokens', [AuthController::class, 'revokeAllTokens']);

        // Auth routes (protected)
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me', [AuthController::class, 'me']);

        // Admin routes
        Route::middleware('role:admin')->prefix('admin')->group(function () {
            Route::apiResource('users', \App\Http\Controllers\Admin\AdminController::class);
            Route::apiResource('roles', \App\Http\Controllers\Admin\RoleController::class);
        });

        // Catalog routes
        Route::apiResource('cities', \App\Http\Controllers\CityController::class);
        Route::apiResource('attractions', \App\Http\Controllers\AttractionController::class);
        Route::apiResource('hotels', \App\Http\Controllers\HotelController::class);
        Route::apiResource('rooms', \App\Http\Controllers\RoomController::class);
        Route::apiResource('drivers', \App\Http\Controllers\DriverController::class);
        Route::apiResource('vehicles', \App\Http\Controllers\VehicleController::class);

        // Booking routes
        Route::apiResource('hotel-bookings', \App\Http\Controllers\HotelBookingController::class);
        Route::apiResource('transport-bookings', \App\Http\Controllers\TransportBookingController::class);

        // Review routes
        Route::apiResource('reviews', \App\Http\Controllers\ReviewController::class);

        // Favorite routes
        Route::get('/favorites', [\App\Http\Controllers\FavoriteController::class, 'index']);
        Route::post('/favorites/toggle', [\App\Http\Controllers\FavoriteController::class, 'toggle']);

        // Hotel Manager routes
        Route::middleware('role:hotel_manager')->prefix('hotel-manager')->group(function () {
            Route::apiResource('manage-hotel', \App\Http\Controllers\HotelManager\HotelController::class);
            Route::apiResource('manage-rooms', \App\Http\Controllers\HotelManager\RoomController::class);
        });

        // Driver routes
        Route::middleware('role:driver')->prefix('driver')->group(function () {
            Route::apiResource('manage-vehicle', \App\Http\Controllers\Driver\VehicleController::class);
            Route::apiResource('transport-bookings', \App\Http\Controllers\Driver\BookingController::class)->only(['index', 'show', 'update']);
        });

        // AI routes
        Route::post('/ai/itinerary', [\App\Http\Controllers\AiController::class, 'generateItinerary']);
    });
});
