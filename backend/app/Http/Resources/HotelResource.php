<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HotelResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'address' => $this->address,
            'phone' => $this->phone,
            'email' => $this->email,
            'description' => $this->description,
            'stars' => $this->stars,
            'city_id' => $this->city_id,
            'created_by' => $this->created_by,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'rooms_count' => $this->whenCounted('rooms'),
            'city' => new CityResource($this->whenLoaded('city')),
            'rooms' => RoomResource::collection($this->whenLoaded('rooms')),
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
