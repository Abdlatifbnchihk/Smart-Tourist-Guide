<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'email' => 'required|email|max:150|unique:users,email',
            'phone' => 'required|string|max:20|unique:users,phone',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:Tourist,Driver,Hotel Manager,Administrator',
            'status' => 'sometimes|in:Pending,Approved,Rejected,Suspended',
        ];

        if ($this->input('role') === 'Driver') {
            $rules['city_id'] = 'required|exists:cities,city_id';
            $rules['license_number'] = 'required|string|max:100|unique:drivers,license_number';
        }

        return $rules;
    }
}
