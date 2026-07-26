<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDriverRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'city_id' => 'required|exists:cities,id',
            'license_number' => 'required|string|max:20|unique:drivers',
            'years_of_experience' => 'nullable|integer|min:0',
            'languages' => 'nullable|string|max:255',
            'available' => 'boolean',
        ];
    }
}
