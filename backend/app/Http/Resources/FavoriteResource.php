<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FavoriteResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'created_at' => $this->created_at,
            'hotel_id' => $this->hotel_id,
            'attraction_id' => $this->attraction_id,
            'restaurant_id' => $this->restaurant_id,
            'hotel' => new HotelResource($this->whenLoaded('hotel')),
            'attraction' => new AttractionResource($this->whenLoaded('attraction')),
            'restaurant' => new RestaurantResource($this->whenLoaded('restaurant')),
        ];
    }
}
