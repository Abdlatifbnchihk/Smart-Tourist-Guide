<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\Driver;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function profile(Request $request): UserResource
    {
        $user = $request->user()->load('driver');

        return new UserResource($user);
    }

    public function updateProfile(UpdateUserRequest $request): JsonResponse
    {
        $user = $request->user();
        $user->update($request->validated());

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => new UserResource($user->fresh('driver')),
        ]);
    }

    public function updateDriverProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->role !== 'Driver') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'license_number' => 'sometimes|string|max:100|unique:drivers,license_number,' . $user->driver->driver_id . ',driver_id',
            'years_of_experience' => 'sometimes|nullable|integer|min:0',
            'languages' => 'sometimes|nullable|string|max:255',
            'available' => 'sometimes|boolean',
        ]);

        $user->driver->update($validated);

        return response()->json([
            'message' => 'Driver profile updated successfully',
            'driver' => $user->driver,
        ]);
    }
}
