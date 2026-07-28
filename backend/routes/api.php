<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\AiController;
use App\Http\Controllers\Api\V1\AttractionController;
use App\Http\Controllers\Api\V1\HotelBookingController;
use App\Http\Controllers\Api\V1\HotelController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CityController;
use App\Http\Controllers\Driver\BookingController;
use App\Http\Controllers\DriverController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\RestaurantController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\TransportBookingController;
use App\Http\Controllers\VehicleController;
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
            Route::apiResource('users', AdminController::class);
            Route::apiResource('roles', RoleController::class);
        });

        // Catalog routes
        Route::apiResource('cities', CityController::class);
        Route::apiResource('restaurants', RestaurantController::class);

        // Attraction routes with mixed access
        Route::get('attractions', [AttractionController::class, 'index']);
        Route::get('attractions/{attraction}', [AttractionController::class, 'show']);
        Route::post('attractions', [AttractionController::class, 'store'])->middleware('role:admin,hotel_manager');
        Route::put('attractions/{attraction}', [AttractionController::class, 'update']);
        Route::delete('attractions/{attraction}', [AttractionController::class, 'destroy']);

        // Hotel routes with mixed access
        Route::get('hotels', [HotelController::class, 'index']);
        Route::get('hotels/{hotel}', [HotelController::class, 'show']);
        Route::post('hotels', [HotelController::class, 'store'])->middleware('role:hotel_manager');
        Route::put('hotels/{hotel}', [HotelController::class, 'update']);
        Route::delete('hotels/{hotel}', [HotelController::class, 'destroy']);

        // Room routes (nested under hotels for create/list, standalone for show/update/delete)
        Route::get('hotels/{hotelId}/rooms', [RoomController::class, 'index']);
        Route::post('hotels/{hotelId}/rooms', [RoomController::class, 'store'])->middleware('role:hotel_manager');
        Route::get('rooms/{id}', [RoomController::class, 'show']);
        Route::put('rooms/{id}', [RoomController::class, 'update']);
        Route::delete('rooms/{id}', [RoomController::class, 'destroy']);
        Route::put('rooms/{id}/restore', [RoomController::class, 'restore']);
        Route::delete('rooms/{id}/force', [RoomController::class, 'forceDestroy']);

        Route::apiResource('drivers', DriverController::class)->except('destroy');
        Route::patch('drivers/{id}/verify', [DriverController::class, 'verify'])->middleware('role:administrator');

        // Vehicle routes (nested under drivers for create/list, standalone for show/update/delete)
        Route::get('drivers/{driverId}/vehicles', [VehicleController::class, 'index']);
        Route::post('drivers/{driverId}/vehicles', [VehicleController::class, 'store'])->middleware('role:driver');
        Route::get('vehicles/{id}', [VehicleController::class, 'show']);
        Route::put('vehicles/{id}', [VehicleController::class, 'update']);
        Route::delete('vehicles/{id}', [VehicleController::class, 'destroy']);

        // Booking routes
        Route::apiResource('hotel-bookings', HotelBookingController::class)->parameters(['hotel-bookings' => 'booking']);
        Route::patch('hotel-bookings/{booking}/cancel', [HotelBookingController::class, 'cancel']);
        Route::patch('hotel-bookings/{booking}/status', [HotelBookingController::class, 'status']);
        Route::apiResource('transport-bookings', TransportBookingController::class);

        // Review routes
        Route::apiResource('reviews', ReviewController::class);

        // Favorite routes
        Route::get('/favorites', [FavoriteController::class, 'index']);
        Route::post('/favorites/toggle', [FavoriteController::class, 'toggle']);

        // Hotel Manager routes
        Route::middleware('role:hotel_manager')->prefix('hotel-manager')->group(function () {
            Route::apiResource('manage-hotel', App\Http\Controllers\HotelManager\HotelController::class);
            Route::apiResource('manage-rooms', App\Http\Controllers\HotelManager\RoomController::class);
        });

        // Driver routes
        Route::middleware('role:driver')->prefix('driver')->group(function () {
            Route::apiResource('manage-vehicle', App\Http\Controllers\Driver\VehicleController::class);
            Route::apiResource('transport-bookings', BookingController::class)->only(['index', 'show', 'update']);
        });

        // AI routes
        Route::post('/ai/itinerary', [AiController::class, 'generateItinerary']);
    });
});
