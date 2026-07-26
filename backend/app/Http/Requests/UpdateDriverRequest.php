<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDriverRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $driverId = $this->route('id');

        return [
            'city_id' => 'sometimes|required|exists:cities,id',
            'license_number' => [
                'sometimes',
                'required',
                'string',
                'max:20',
                Rule::unique('drivers')->ignore($driverId),
            ],
            'years_of_experience' => 'nullable|integer|min:0',
            'languages' => 'nullable|string|max:255',
            'available' => 'boolean',
        ];
    }
}
