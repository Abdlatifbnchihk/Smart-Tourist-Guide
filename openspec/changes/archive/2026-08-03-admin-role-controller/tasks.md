## 1. Form Requests

- [x] 1.1 Create `app/Http/Requests/Admin/StoreRoleRequest.php` with validation rules for `name` (required|string|max:50|unique:roles,name), `slug` (required|string|max:50|unique:roles,slug), `description` (nullable|string|max:255)
- [x] 1.2 Create `app/Http/Requests/Admin/UpdateRoleRequest.php` with validation rules for `name` (sometimes|required|string|max:50|unique:roles,name,{id}), `slug` (sometimes|required|string|max:50|unique:roles,slug,{id}), `description` (nullable|string|max:255)

## 2. Controller Implementation

- [x] 2.1 Create `app/Http/Controllers/Admin/RoleController.php` with namespace `App\Http\Controllers\Admin`
- [x] 2.2 Implement `index()` method: paginate roles with `withCount('users')`, return JSON response
- [x] 2.3 Implement `store()` method: use `StoreRoleRequest`, create role, return 201 JSON with role data
- [x] 2.4 Implement `show()` method: find role by route model binding, load `users` relationship, return JSON with role and users
- [x] 2.5 Implement `update()` method: use `UpdateRoleRequest`, update role, return JSON with updated role
- [x] 2.6 Implement `destroy()` method: check `users_count`, if zero delete role and return 200 JSON success message, else return 409 Conflict with user count

## 3. Route Configuration

- [x] 3.1 Update `routes/api.php` line 65: change `role:admin` to `role:administrator` in the admin middleware group

## 4. Verification

- [x] 4.1 Verify the controller methods match the specification scenarios (list, create, show, update, delete)
- [x] 4.2 Verify validation rules enforce unique `name` and `slug` on create and update
- [x] 4.3 Verify deletion check prevents removal of roles with assigned users