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
        $userId = $this->route('user')->user_id;

        return [
            'first_name' => 'sometimes|string|max:100',
            'last_name' => 'sometimes|string|max:100',
            'email' => 'sometimes|email|max:150|unique:users,email,' . $userId . ',user_id',
            'phone' => 'sometimes|string|max:20|unique:users,phone,' . $userId . ',user_id',
            'role' => 'sometimes|in:Tourist,Driver,Hotel Manager,Administrator',
            'status' => 'sometimes|in:Pending,Approved,Rejected,Suspended',
            'active' => 'sometimes|boolean',
        ];
    }
}
