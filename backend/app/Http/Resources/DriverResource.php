<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DriverResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'city_id' => $this->city_id,
            'license_number' => $this->license_number,
            'years_of_experience' => $this->years_of_experience,
            'languages' => $this->languages,
            'available' => $this->available,
            'is_verified' => $this->is_verified,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'user' => new UserResource($this->whenLoaded('user')),
            'city' => new CityResource($this->whenLoaded('city')),
            'vehicles' => VehicleResource::collection($this->whenLoaded('vehicles')),
            'reviews' => ReviewResource::collection($this->whenLoaded('reviews')),
        ];
    }
}
