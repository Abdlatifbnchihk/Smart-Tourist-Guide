<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRoleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $roleId = $this->route('role')->id;

        return [
            'name' => 'sometimes|required|string|max:50|unique:roles,name,'.$roleId,
            'slug' => 'sometimes|required|string|max:50|unique:roles,slug,'.$roleId,
            'description' => 'nullable|string|max:255',
        ];
    }
}