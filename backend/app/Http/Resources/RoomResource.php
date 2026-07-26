<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RoomResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'hotel_id' => $this->hotel_id,
            'number' => $this->number,
            'type' => $this->type,
            'capacity' => $this->capacity,
            'price_per_night' => $this->price_per_night,
            'available' => $this->available,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'hotel' => new HotelResource($this->whenLoaded('hotel')),
        ];
    }
}
