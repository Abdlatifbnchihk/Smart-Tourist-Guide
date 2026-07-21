<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $cityId = $this->route('city')->city_id;

        return [
            'name' => 'required|string|max:100|unique:cities,name,' . $cityId . ',city_id',
            'description' => 'nullable|string',
            'region' => 'nullable|string|max:100',
        ];
    }
}