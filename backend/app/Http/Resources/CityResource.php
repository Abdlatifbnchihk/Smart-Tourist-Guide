<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CityResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'city_id' => $this->city_id,
            'name' => $this->name,
            'region' => $this->region,
            'description' => $this->description,
            'hotels_count' => $this->whenCounted('hotels'),
            'attractions_count' => $this->whenCounted('attractions'),
            'restaurants_count' => $this->whenCounted('restaurants'),
            'hotels' => $this->whenLoaded('hotels'),
            'attractions' => $this->whenLoaded('attractions'),
            'restaurants' => $this->whenLoaded('restaurants'),
        ];
    }
}