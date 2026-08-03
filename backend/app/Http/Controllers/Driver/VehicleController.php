<?php

namespace App\Http\Controllers\Driver;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreVehicleRequest;
use App\Http\Requests\UpdateVehicleRequest;
use App\Http\Resources\VehicleResource;
use App\Models\Driver;
use App\Models\Vehicle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class VehicleController extends Controller
{
    /**
     * List vehicles for a driver.
     */
    public function index(Request $request, string $driverId)
    {
        $driver = Driver::findOrFail($driverId);

        $query = $driver->vehicles()->with('driver');

        $perPage = $request->get('per_page', 15);
        $vehicles = $query->paginate($perPage);

        return VehicleResource::collection($vehicles);
    }

    /**
     * Store a new vehicle under a driver.
     */
    public function store(StoreVehicleRequest $request, string $driverId): JsonResponse
    {
        $driver = Driver::findOrFail($driverId);

        if ($request->user()->id !== $driver->user_id && $request->user()->role !== 'administrator') {
            return response()->json([
                'message' => 'You are not authorized to add vehicles to this driver profile',
            ], Response::HTTP_FORBIDDEN);
        }

        $validated = $request->validated();
        $validated['driver_id'] = $driver->id;

        $vehicle = Vehicle::create($validated);

        return response()->json([
            'message' => 'Vehicle created successfully',
            'vehicle' => new VehicleResource($vehicle->load('driver')),
        ], Response::HTTP_CREATED);
    }

    /**
     * Display a vehicle.
     */
    public function show(string $id)
    {
        $vehicle = Vehicle::with('driver')->findOrFail($id);

        return new VehicleResource($vehicle);
    }

    /**
     * Update a vehicle.
     */
    public function update(UpdateVehicleRequest $request, string $id): JsonResponse
    {
        $vehicle = Vehicle::with('driver')->findOrFail($id);

        if ($request->user()->id !== $vehicle->driver->user_id && $request->user()->role !== 'administrator') {
            return response()->json([
                'message' => 'You are not authorized to update this vehicle',
            ], Response::HTTP_FORBIDDEN);
        }

        $validated = $request->validated();

        $vehicle->update($validated);

        return response()->json([
            'message' => 'Vehicle updated successfully',
            'vehicle' => new VehicleResource($vehicle->fresh('driver')),
        ]);
    }

    /**
     * Delete a vehicle.
     */
    public function destroy(Request $request, string $id): JsonResponse
    {
        $vehicle = Vehicle::with('driver')->findOrFail($id);

        if ($request->user()->id !== $vehicle->driver->user_id && $request->user()->role !== 'administrator') {
            return response()->json([
                'message' => 'You are not authorized to delete this vehicle',
            ], Response::HTTP_FORBIDDEN);
        }

        $vehicle->delete();

        return response()->json([
            'message' => 'Vehicle deleted successfully',
        ]);
    }
}
