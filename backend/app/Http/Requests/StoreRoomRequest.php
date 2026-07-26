<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRoomRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'number' => 'required|string|max:20',
            'type' => 'required|string|max:50',
            'capacity' => 'required|integer|min:1',
            'price_per_night' => 'required|numeric|gt:0',
            'available' => 'boolean',
        ];
    }
}
