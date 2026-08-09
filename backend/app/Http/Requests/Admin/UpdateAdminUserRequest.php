<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAdminUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $userId = $this->route('user')->id;

        return [
            'first_name' => 'sometimes|string|max:100',
            'last_name' => 'sometimes|string|max:100',
            'email' => 'sometimes|email|max:150|unique:users,email,'.$userId.',id',
            'phone' => 'sometimes|string|max:20|unique:users,phone,'.$userId.',id',
            'role' => 'sometimes|string|in:Tourist,Driver,Hotel Manager,Administrator,tourist,driver,hotel_manager,administrator',
            'status' => 'sometimes|string|in:Pending,Approved,Rejected,Suspended,pending,approved,rejected,suspended',
            'active' => 'sometimes|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'role.in' => 'The selected role is invalid.',
        ];
    }
}
