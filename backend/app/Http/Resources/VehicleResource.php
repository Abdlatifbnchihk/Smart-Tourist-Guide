<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VehicleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->vehicle_id,
            'driver_id' => $this->driver_id,
            'brand' => $this->brand,
            'model' => $this->model,
            'type' => $this->type,
            'seats' => $this->seats,
            'registration_number' => $this->registration_number,
            'air_conditioning' => $this->air_conditioning,
            'price_per_km' => $this->price_per_km,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'driver' => new DriverResource($this->whenLoaded('driver')),
        ];
    }
}
