<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'rating' => $this->rating,
            'comment' => $this->comment,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'user' => [
                'id' => $this->user->id,
                'first_name' => $this->user->first_name,
                'last_name' => $this->user->last_name,
            ],
            'hotel' => $this->when($this->hotel_id, function () {
                return [
                    'id' => $this->hotel->id,
                    'name' => $this->hotel->name,
                ];
            }),
            'driver' => $this->when($this->driver_id, function () {
                return [
                    'id' => $this->driver->id,
                    'license_plate' => $this->driver->license_plate,
                ];
            }),
            'attraction' => $this->when($this->attraction_id, function () {
                return [
                    'id' => $this->attraction->id,
                    'name' => $this->attraction->name,
                ];
            }),
        ];
    }
}
