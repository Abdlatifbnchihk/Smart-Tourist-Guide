<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateHotelRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'city_id' => 'sometimes|required|exists:cities,city_id',
            'name' => 'sometimes|required|string|max:150',
            'address' => 'sometimes|required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:150',
            'description' => 'nullable|string',
            'stars' => 'nullable|integer|min:1|max:5',
        ];
    }
}
