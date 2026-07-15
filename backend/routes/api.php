<?php

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
});
