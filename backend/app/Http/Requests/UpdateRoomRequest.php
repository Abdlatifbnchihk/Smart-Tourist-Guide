<?php

namespace App\Http\Requests;

use App\Models\Room;
use Illuminate\Foundation\Http\FormRequest;

class UpdateRoomRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Route model binding resolves 'room' to a Room instance
        $room = $this->route('room');

        if (!$room || !$room instanceof Room) {
            return false;
        }

        if (!$room->hotel) {
            return false;
        }

        $user = $this->user();
        
        // Allow if user is the hotel creator, admin, or hotel_manager
        return $room->hotel->created_by === $user->id || 
               in_array($user->role, ['administrator', 'hotel_manager']);
    }

    public function rules(): array
    {
        $room = $this->route('room');
        $roomId = $room?->room_id;

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
