<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRestaurantRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $restaurantId = $this->route('restaurant')->id;

        return [
            'city_id' => 'required|exists:cities,city_id',
            'name' => 'required|string|max:150|unique:restaurants,name,' . $restaurantId . ',id',
            'description' => 'nullable|string',
            'address' => 'nullable|string|max:255',
            'cuisine' => 'required|string|max:100',
            'phone' => 'nullable|string|max:20',
            'price_range' => 'nullable|integer|between:1,4',
        ];
    }
}