<?php

namespace App\Http\Requests;

use App\Models\Hotel;
use Illuminate\Foundation\Http\FormRequest;

class StoreRoomRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Get hotel_id from route parameter or request body
        $hotelId = $this->route('hotelId') ?? $this->input('hotel_id');

        if (!$hotelId) {
            return false;
        }

        $hotel = Hotel::find($hotelId);

        if (!$hotel) {
            return false;
        }

        $user = $this->user();

        // Allow if user is the hotel creator, admin, or hotel_manager
        return $hotel->created_by === $user->id ||
            in_array($user->role, ['administrator', 'hotel_manager']);
    }

    public function rules(): array
    {
        // Get hotel_id from route parameter or request body
        $hotelId = $this->route('hotelId') ?? $this->input('hotel_id');

        return [
            'hotel_id' => ['required', 'integer', 'exists:hotels,id'],
            'number' => ['required', 'string', 'max:20', \Illuminate\Validation\Rule::unique('rooms', 'number')->where('hotel_id', $hotelId)],
            'type' => 'required|string|max:50',
            'capacity' => 'required|integer|min:1',
            'price_per_night' => 'required|numeric|gt:0',
            'available' => 'boolean',
        ];
    }
}
