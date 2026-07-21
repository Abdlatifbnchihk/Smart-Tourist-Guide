<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCityRequest;
use App\Http\Requests\UpdateCityRequest;
use App\Http\Resources\CityResource;
use App\Models\City;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CityController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $cities = City::withCount(['hotels', 'attractions', 'restaurants'])
            ->get();

        return CityResource::collection($cities);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCityRequest $request): JsonResponse
    {
        $city = City::create($request->validated());

        return response()->json([
            'message' => 'City created successfully',
            'city' => new CityResource($city),
        ], Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show(City $city)
    {
        $city->load(['hotels', 'attractions', 'restaurants']);

        return new CityResource($city);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCityRequest $request, City $city): JsonResponse
    {
        $city->update($request->validated());

        return response()->json([
            'message' => 'City updated successfully',
            'city' => new CityResource($city->fresh(['hotels', 'attractions', 'restaurants'])),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(City $city): JsonResponse
    {
        $city->delete();

        return response()->json([
            'message' => 'City deleted successfully',
        ]);
    }
}