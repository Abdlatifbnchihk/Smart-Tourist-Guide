<?php

namespace App\Http\Requests;

use App\Models\Room;
use Illuminate\Foundation\Http\FormRequest;

class UpdateRoomRequest extends FormRequest
{
    public function authorize(): bool
    {
        $room = $this->route('room');

        if (!$room) {
            return false;
        }

        $room = is_numeric($room) ? Room::withTrashed()->find($room) : $room;

        return $room && $room->hotel && $room->hotel->created_by === $this->user()->id;
    }

    public function rules(): array
    {
        $roomId = $this->route('room');
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
