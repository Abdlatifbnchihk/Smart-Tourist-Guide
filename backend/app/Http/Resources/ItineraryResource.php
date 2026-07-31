<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ItineraryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'city' => $this->resource['city'],
            'preferences' => $this->resource['preferences'],
            'budget' => $this->resource['budget'],
            'total_days' => $this->resource['total_days'],
            'itinerary' => $this->resource['itinerary'],
            'estimated_total_cost' => $this->resource['estimated_total_cost'],
        ];
    }
}
