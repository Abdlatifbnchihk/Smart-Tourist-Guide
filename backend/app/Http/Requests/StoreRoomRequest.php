<?php

namespace App\Http\Requests;

use App\Models\Hotel;
use Illuminate\Foundation\Http\FormRequest;

class StoreRoomRequest extends FormRequest
{
    public function authorize(): bool
    {
        $hotelId = $this->input('hotel_id');

        if (!$hotelId) {
            return false;
        }

        $hotel = Hotel::find($hotelId);

        return $hotel && $hotel->created_by === $this->user()->id;
    }

    public function rules(): array
    {
        return [
            'hotel_id' => 'required|exists:hotels,hotel_id',
            'number' => ['required', 'string', 'max:20', \Illuminate\Validation\Rule::unique('rooms', 'number')->where('hotel_id', $this->input('hotel_id'))],
            'type' => 'required|string|max:50',
            'capacity' => 'required|integer|min:1',
            'price_per_night' => 'required|numeric|gt:0',
            'available' => 'boolean',
        ];
    }
}
