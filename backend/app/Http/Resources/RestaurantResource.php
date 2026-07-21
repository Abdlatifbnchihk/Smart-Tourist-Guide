<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RestaurantResource extends JsonResource
{
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
            'city' => $this->whenLoaded('city'),
        ];
    }
}