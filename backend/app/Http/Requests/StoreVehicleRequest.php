<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreVehicleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'brand' => 'required|string|max:100',
            'model' => 'required|string|max:100',
            'type' => 'required|in:sedan,suv,van,minibus',
            'seats' => 'required|integer|min:1',
            'registration_number' => 'required|string|max:50|unique:vehicles',
            'air_conditioning' => 'boolean',
            'price_per_km' => 'required|numeric|gt:0',
        ];
    }
}
