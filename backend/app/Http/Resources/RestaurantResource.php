<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RestaurantResource extends JsonResource
{
    protected $isFavorite;

    public function __construct($resource, $isFavorite = false)
    {
        parent::__construct($resource);
        $this->isFavorite = $isFavorite;
    }

    public function toArray(Request $request): array
    {
        return [
            'restaurant_id' => $this->id,
            'city_id' => $this->city_id,
            'name' => $this->name,
            'description' => $this->description,
            'address' => $this->address,
            'cuisine' => $this->cuisine,
            'phone' => $this->phone,
            'price_range' => $this->price_range,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'city' => new CityResource($this->whenLoaded('city')),
            'reviews' => ReviewResource::collection($this->whenLoaded('reviews')),
            'average_rating' => $this->whenLoaded('reviews', function () {
                $reviews = $this->reviews;
                if ($reviews->isEmpty()) {
                    return null;
                }
                return round($reviews->avg('rating'), 1);
            }),
            'reviews_count' => $this->whenCounted('reviews'),
            'is_favorite' => $this->isFavorite,
        ];
    }
}
