<?php

namespace App\Http\Controllers\Api\V1\Catalog;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAttractionRequest;
use App\Http\Requests\UpdateAttractionRequest;
use App\Http\Resources\AttractionResource;
use App\Models\Attraction;
use App\Models\Favorite;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Str;

class AttractionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Attraction::query();

        if ($request->has('city_id')) {
            $query->where('city_id', $request->city_id);
        }

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        if ($request->has('min_rating')) {
            $query->whereHas('reviews', function ($q) use ($request) {
                $q->groupBy('attraction_id')
                    ->havingRaw('AVG(rating) >= ?', [$request->min_rating]);
            });
        }

        if ($request->has('search')) {
            $query->where('name', 'LIKE', '%'.$request->search.'%');
        }

        $query->with('city', 'reviews');

        $perPage = $request->get('per_page', 15);
        $attractions = $query->paginate($perPage);

        $user = $request->user();
        $favoriteIds = [];
        if ($user) {
            $favoriteIds = Favorite::where('user_id', $user->id)
                ->whereNotNull('attraction_id')
                ->pluck('attraction_id')
                ->toArray();
        }

        $resource = AttractionResource::collection($attractions);

        if ($user) {
            $resource->additional(['is_favorite_map' => []]);
            $attractions->getCollection()->transform(function ($attraction) use ($favoriteIds) {
                $attraction->is_favorite = in_array($attraction->id, $favoriteIds);
                return $attraction;
            });
        }

        return AttractionResource::collection($attractions);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAttractionRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $validated['slug'] = Str::slug($validated['name']);

        $originalSlug = $validated['slug'];
        $counter = 1;

        while (Attraction::where('slug', $validated['slug'])->exists()) {
            $validated['slug'] = $originalSlug.'-'.$counter;
            $counter++;
        }

        $validated['created_by'] = $request->user()->id;

        $attraction = Attraction::create($validated);

        return response()->json([
            'message' => 'Attraction created successfully',
            'attraction' => new AttractionResource($attraction->load('city')),
        ], Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, $id)
    {
        $attraction = Attraction::with(['city', 'reviews.user'])->findOrFail($id);

        $isFavorite = false;
        if ($request->user()) {
            $isFavorite = Favorite::where('user_id', $request->user()->id)
                ->where('attraction_id', $attraction->id)
                ->exists();
        }

        return new AttractionResource($attraction, $isFavorite);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAttractionRequest $request, Attraction $attraction): JsonResponse
    {
        if ($request->user()->id !== $attraction->created_by && $request->user()->role !== 'administrator') {
            return response()->json([
                'message' => 'You are not authorized to update this attraction',
            ], Response::HTTP_FORBIDDEN);
        }

        $validated = $request->validated();

        if (isset($validated['name']) && $validated['name'] !== $attraction->name) {
            $validated['slug'] = Str::slug($validated['name']);

            $originalSlug = $validated['slug'];
            $counter = 1;
            while (Attraction::where('slug', $validated['slug'])->where('id', '!=', $attraction->id)->exists()) {
                $validated['slug'] = $originalSlug.'-'.$counter;
                $counter++;
            }
        }

        $attraction->update($validated);

        return response()->json([
            'message' => 'Attraction updated successfully',
            'attraction' => new AttractionResource($attraction->fresh(['city', 'reviews.user'])),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Attraction $attraction, Request $request): JsonResponse
    {
        if ($request->user()->id !== $attraction->created_by && $request->user()->role !== 'administrator') {
            return response()->json([
                'message' => 'You are not authorized to delete this attraction',
            ], Response::HTTP_FORBIDDEN);
        }

        $attraction->delete();

        return response()->json([
            'message' => 'Attraction deleted successfully',
        ]);
    }
}
