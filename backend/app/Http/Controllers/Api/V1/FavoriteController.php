<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\FavoriteResource;
use App\Models\Favorite;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class FavoriteController extends Controller
{
    /**
     * Display the authenticated user's favorites.
     */
    public function index(Request $request)
    {
        $query = Favorite::where('user_id', $request->user()->id);

        if ($request->has('type')) {
            $type = $request->input('type');

            if ($type === 'hotel') {
                $query->whereNotNull('hotel_id');
            } elseif ($type === 'attraction') {
                $query->whereNotNull('attraction_id');
            } elseif ($type === 'restaurant') {
                $query->whereNotNull('restaurant_id');
            }
        }

        $perPage = $request->get('per_page', 15);
        $favorites = $query->paginate($perPage);

        return FavoriteResource::collection($favorites);
    }

    /**
     * Toggle favorite - add if not exists, remove if exists.
     */
    public function toggle(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'type' => 'required|in:hotel,attraction,restaurant',
            'id' => 'required|integer',
        ]);

        $type = $validated['type'];
        $id = $validated['id'];
        $userId = $request->user()->id;

        // Check if entity exists using raw query
        $exists = DB::table("{$type}s")->where('id', $id)->exists();

        if (! $exists) {
            return response()->json([
                'message' => ucfirst($type).' not found',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        // Check if favorite exists
        $existingFavorite = Favorite::where('user_id', $userId)
            ->where("{$type}_id", $id)
            ->first();

        if ($existingFavorite) {
            $existingFavorite->delete();

            return response()->json([
                'message' => ucfirst($type.' removed from favorites'),
                'action' => 'removed',
            ]);
        }

        // Create new favorite
        $favorite = Favorite::create(array_merge(
            ['user_id' => $userId],
            ["{$type}_id" => $id]
        ));

        return response()->json([
            'message' => ucfirst($type.' added to favorites'),
            'action' => 'added',
            'favorite' => new FavoriteResource($favorite),
        ], Response::HTTP_CREATED);
    }

    /**
     * Remove the specified favorite.
     */
    public function destroy(Favorite $favorite, Request $request): JsonResponse
    {
        if ((int) $favorite->user_id !== (int) $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized',
            ], Response::HTTP_FORBIDDEN);
        }

        $favorite->delete();

        return response()->json([
            'message' => 'Favorite removed successfully',
        ]);
    }
}
