<?php

namespace App\Http\Controllers\Api\V1\Catalog;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRestaurantRequest;
use App\Http\Requests\UpdateRestaurantRequest;
use App\Http\Resources\RestaurantResource;
use App\Models\Restaurant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class RestaurantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $restaurants = Restaurant::with('city', 'reviews')->get();

        $user = $request->user();
        $favoriteIds = [];
        if ($user) {
            $favoriteIds = $user->favorites()->whereNotNull('restaurant_id')->pluck('restaurant_id')->toArray();
        }

        return RestaurantResource::collection(
            $restaurants->map(function ($restaurant) use ($favoriteIds) {
                $restaurant->is_favorite = in_array($restaurant->id, $favoriteIds);
                return $restaurant;
            })
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRestaurantRequest $request): JsonResponse
    {
        $restaurant = Restaurant::create($request->validated());

        return response()->json([
            'message' => 'Restaurant created successfully',
            'restaurant' => new RestaurantResource($restaurant),
        ], Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, $id)
    {
        $restaurant = Restaurant::with('city', 'reviews')->findOrFail($id);

        $isFavorite = false;
        if ($request->user()) {
            $isFavorite = \App\Models\Favorite::where('user_id', $request->user()->id)
                ->where('restaurant_id', $restaurant->id)
                ->exists();
        }

        return new RestaurantResource($restaurant, $isFavorite);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRestaurantRequest $request, Restaurant $restaurant): JsonResponse
    {
        $restaurant->update($request->validated());

        return response()->json([
            'message' => 'Restaurant updated successfully',
            'restaurant' => new RestaurantResource($restaurant->fresh('city')),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Restaurant $restaurant): JsonResponse
    {
        $restaurant->delete();

        return response()->json([
            'message' => 'Restaurant deleted successfully',
        ]);
    }
}
