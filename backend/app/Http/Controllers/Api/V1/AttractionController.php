<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAttractionRequest;
use App\Http\Requests\UpdateAttractionRequest;
use App\Http\Resources\AttractionResource;
use App\Models\Attraction;
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

        // Filter by city_id
        if ($request->has('city_id')) {
            $query->where('city_id', $request->city_id);
        }

        // Filter by category
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        // Filter by price range
        if ($request->has('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        // Filter by rating (requires join with reviews)
        if ($request->has('min_rating')) {
            $query->whereHas('reviews', function ($q) use ($request) {
                $q->groupBy('attraction_id')
                    ->havingRaw('AVG(rating) >= ?', [$request->min_rating]);
            });
        }

        // Search by name
        if ($request->has('search')) {
            $query->where('name', 'LIKE', '%' . $request->search . '%');
        }

        // Eager load city relationship
        $query->with('city');

        // Paginate results
        $perPage = $request->get('per_page', 15);
        $attractions = $query->paginate($perPage);

        return AttractionResource::collection($attractions);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAttractionRequest $request): JsonResponse
    {
        $validated = $request->validated();

        // Auto-generate slug from name
        $validated['slug'] = Str::slug($validated['name']);

        // Ensure slug uniqueness
        $originalSlug = $validated['slug'];
        $counter = 1;
        
        while (Attraction::where('slug', $validated['slug'])->exists()) {
            $validated['slug'] = $originalSlug . '-' . $counter;
            $counter++;
        }

        // Set the creator
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
    public function show(Attraction $attraction)
    {
        $attraction->load(['city', 'reviews.user']);

        return new AttractionResource($attraction);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAttractionRequest $request, Attraction $attraction): JsonResponse
    {
        // Check ownership or admin role
        if ($request->user()->id !== $attraction->created_by && $request->user()->role !== 'Administrator') {
            return response()->json([
                'message' => 'You are not authorized to update this attraction',
            ], Response::HTTP_FORBIDDEN);
        }

        $validated = $request->validated();

        // Auto-generate slug from name if name changed
        if (isset($validated['name']) && $validated['name'] !== $attraction->name) {
            $validated['slug'] = Str::slug($validated['name']);

            // Ensure slug uniqueness
            $originalSlug = $validated['slug'];
            $counter = 1;
            while (Attraction::where('slug', $validated['slug'])->where('id', '!=', $attraction->id)->exists()) {
                $validated['slug'] = $originalSlug . '-' . $counter;
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
        // Check ownership or admin role
        if ($request->user()->id !== $attraction->created_by && $request->user()->role !== 'Administrator') {
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
