<?php

namespace App\Http\Requests;

use App\Models\Room;
use Illuminate\Foundation\Http\FormRequest;

class UpdateRoomRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Route parameter is 'id' from PUT rooms/{id}
        $roomId = $this->route('id');

        if (!$roomId) {
            return false;
        }

        $room = Room::withTrashed()->find($roomId);

        if (!$room || !$room->hotel) {
            return false;
        }

        $user = $this->user();
        
        // Allow if user is the hotel creator, admin, or hotel_manager
        return $room->hotel->created_by === $user->id || 
               in_array($user->role, ['administrator', 'hotel_manager']);
    }

    public function rules(): array
    {
        $roomId = $this->route('id');
        $room = $roomId ? \App\Models\Room::withTrashed()->find($roomId) : null;

        return [
            'number' => [
                'sometimes', 'required', 'string', 'max:20',
                \Illuminate\Validation\Rule::unique('rooms', 'number')
                    ->ignore($roomId, 'room_id')
                    ->where('hotel_id', $room?->hotel_id),
            ],
            'type' => 'sometimes|required|string|max:50',
            'capacity' => 'sometimes|required|integer|min:1',
            'price_per_night' => 'sometimes|required|numeric|gt:0',
            'available' => 'boolean',
        ];
    }
}
