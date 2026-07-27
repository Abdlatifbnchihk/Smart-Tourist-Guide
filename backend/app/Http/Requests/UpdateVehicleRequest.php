<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateVehicleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $vehicleId = $this->route('id');

        return [
            'brand' => 'sometimes|required|string|max:100',
            'model' => 'sometimes|required|string|max:100',
            'type' => 'sometimes|required|in:sedan,suv,van,minibus',
            'seats' => 'sometimes|required|integer|min:1',
            'registration_number' => [
                'sometimes',
                'required',
                'string',
                'max:50',
                Rule::unique('vehicles')->ignore($vehicleId, 'vehicle_id'),
            ],
            'air_conditioning' => 'boolean',
            'price_per_km' => 'sometimes|required|numeric|gt:0',
        ];
    }
}
