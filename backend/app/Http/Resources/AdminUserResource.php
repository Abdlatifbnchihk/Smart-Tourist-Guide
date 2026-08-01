<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminUserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'user_id' => $this->id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'role' => is_string($this->role) ? $this->role : $this->role->value,
            'status' => $this->status ? (is_string($this->status) ? $this->status : $this->status->value) : 'Pending',
            'active' => $this->active,
            'driver' => $this->whenLoaded('driver'),
            'bookings_count' => $this->whenCounted('bookings'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
