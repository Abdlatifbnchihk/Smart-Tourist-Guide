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
    // Route::post('/auth/register', [AuthController::class, 'register']);
    // Route::post('/auth/login', [AuthController::class, 'login']);

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

        // Auth routes
        // Route::post('/auth/logout', [AuthController::class, 'logout']);
        // Route::get('/auth/me', [AuthController::class, 'me']);

        // Admin routes
        Route::middleware('role:admin')->prefix('admin')->group(function () {
            // Route::apiResource('users', UserController::class);
            // Route::apiResource('roles', RoleController::class);
        });

        // Catalog routes
        // Route::apiResource('cities', CityController::class);
        // Route::apiResource('attractions', AttractionController::class);
        // Route::apiResource('hotels', HotelController::class);
        // Route::apiResource('rooms', RoomController::class);
        // Route::apiResource('drivers', DriverController::class);
        // Route::apiResource('vehicles', VehicleController::class);

        // Booking routes
        // Route::apiResource('hotel-bookings', HotelBookingController::class);
        // Route::apiResource('transport-bookings', TransportBookingController::class);

        // Review routes
        // Route::apiResource('reviews', ReviewController::class);

        // Favorite routes
        // Route::get('/favorites', [FavoriteController::class, 'index']);
        // Route::post('/favorites/toggle', [FavoriteController::class, 'toggle']);

        // AI routes
        // Route::post('/ai/itinerary', [AiController::class, 'generateItinerary']);
    });
});
