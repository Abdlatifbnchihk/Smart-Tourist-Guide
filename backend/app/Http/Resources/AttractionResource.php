<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AttractionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'address' => $this->address,
            'opening_hours' => $this->opening_hours,
            'city_id' => $this->city_id,
            'created_by' => $this->created_by,
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
        ];
    }
}
