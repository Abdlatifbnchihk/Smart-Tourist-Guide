<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreHotelRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'city_id' => 'required|exists:cities,id',
            'name' => 'required|string|max:150',
            'address' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:150',
            'description' => 'nullable|string',
            'stars' => 'nullable|integer|min:1|max:5',
        ];
    }
}
