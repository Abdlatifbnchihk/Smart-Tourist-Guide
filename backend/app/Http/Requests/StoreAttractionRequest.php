<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAttractionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'city_id' => 'required|exists:cities,city_id',
            'name' => 'required|string|max:150|unique:attractions,name',
            'description' => 'nullable|string',
            'address' => 'nullable|string|max:255',
            'opening_hours' => 'nullable|string|max:100',
        ];
    }
}
