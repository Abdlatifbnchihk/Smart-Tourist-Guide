<?php

namespace App\Http\Controllers\Driver;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDriverRequest;
use App\Http\Requests\UpdateDriverRequest;
use App\Http\Resources\DriverResource;
use App\Models\Driver;
use App\Models\City;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class DriverController extends Controller
{
    /**
     * Display a listing of drivers.
     */
    public function index(Request $request)
    {
        $query = Driver::query();

        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->has('city_id')) {
            $query->where('city_id', $request->city_id);
        }

        if ($request->has('is_verified') && $request->is_verified !== '') {
            $query->where('is_verified', filter_var($request->is_verified, FILTER_VALIDATE_BOOLEAN));
        }

        // Only show drivers with vehicles when browsing as tourist (no user_id filter)
        if (!$request->has('user_id')) {
            $query->has('vehicles');
        }

        $query->with(['user', 'city', 'vehicles']);

        $perPage = $request->get('per_page', 50);
        $drivers = $query->get();

        return DriverResource::collection($drivers);
    }

    /**
     * Get or create driver profile for authenticated user.
     */
    public function getOrCreateProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->role !== 'driver') {
            return response()->json([
                'message' => 'Only users with driver role can have a driver profile',
            ], Response::HTTP_FORBIDDEN);
        }

        $driver = Driver::where('user_id', $user->id)->first();

        if (!$driver) {
            $cityId = City::first()?->id ?? 1;
            $licenseNumber = strtoupper('DL-' . $user->id . '-' . uniqid());

            $driver = Driver::create([
                'user_id' => $user->id,
                'city_id' => $cityId,
                'license_number' => $licenseNumber,
            ]);
        }

        return response()->json([
            'data' => new DriverResource($driver->load(['user', 'city', 'vehicles'])),
        ]);
    }

    /**
     * Store a new driver profile.
     */
    public function store(StoreDriverRequest $request): JsonResponse
    {
        if ($request->user()->role !== 'driver') {
            return response()->json([
                'message' => 'Only users with driver role can create a driver profile',
            ], Response::HTTP_FORBIDDEN);
        }

        $validated = $request->validated();
        $validated['user_id'] = $request->user()->id;

        $driver = Driver::create($validated);

        return response()->json([
            'message' => 'Driver profile created successfully',
            'driver' => new DriverResource($driver->load(['user', 'city'])),
        ], Response::HTTP_CREATED);
    }

    /**
     * Display a driver profile.
     */
    public function show(string $id)
    {
        $driver = Driver::with(['user', 'city', 'vehicles', 'reviews.user'])->findOrFail($id);

        return new DriverResource($driver);
    }

    /**
     * Update a driver profile.
     */
    public function update(UpdateDriverRequest $request, string $id): JsonResponse
    {
        $driver = Driver::findOrFail($id);

        if ($request->user()->id !== $driver->user_id && $request->user()->role !== 'administrator') {
            return response()->json([
                'message' => 'You are not authorized to update this driver profile',
            ], Response::HTTP_FORBIDDEN);
        }

        $validated = $request->validated();

        $driver->update($validated);

        return response()->json([
            'message' => 'Driver profile updated successfully',
            'driver' => new DriverResource($driver->fresh(['user', 'city'])),
        ]);
    }

    /**
     * Toggle driver verification (admin only).
     */
    public function verify(Request $request, string $id): JsonResponse
    {
        if ($request->user()->role !== 'administrator') {
            return response()->json([
                'message' => 'Only administrators can verify drivers',
            ], Response::HTTP_FORBIDDEN);
        }

        $driver = Driver::findOrFail($id);

        $driver->update([
            'is_verified' => ! $driver->is_verified,
        ]);

        return response()->json([
            'message' => 'Driver verification toggled successfully',
            'driver' => new DriverResource($driver->fresh(['user', 'city'])),
        ]);
    }
}
