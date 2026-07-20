## 1. Form Request Classes

- [x] 1.1 Create `RegisterUserRequest` in `app/Http/Requests/RegisterUserRequest.php` with validation rules: `first_name` (required|string|max:100), `last_name` (required|string|max:100), `email` (required|email|max:150|unique:users), `phone` (required|string|max:20|unique:users), `password` (required|string|min:8|confirmed), `role` (required|in:Tourist,Driver,Hotel Manager,Administrator)
- [x] 1.2 Add conditional validation to `RegisterUserRequest`: when `role = 'Driver'`, require `city_id` (required|exists:cities,id) and `license_number` (required|string|max:100|unique:drivers,license_number)
- [x] 1.3 Create `LoginUserRequest` in `app/Http/Requests/LoginUserRequest.php` with validation rules: `email` (required|email), `password` (required)

## 2. AuthController Updates

- [x] 2.1 Update `AuthController::register()` to accept `RegisterUserRequest` instead of `Request`
- [x] 2.2 Update `AuthController::register()` to auto-create `Driver` profile when `role = 'Driver'` with fields: `user_id`, `first_name`, `last_name`, `city_id`, `license_number`
- [x] 2.3 Update `AuthController::login()` to accept `LoginUserRequest` instead of `Request`
- [x] 2.4 Remove any `role_id` references from AuthController (if present)

## 3. Verification

- [x] 3.1 Verify no `App\Models\Role` import exists in `AuthController`
- [x] 3.2 Verify registration creates user with ENUM role string (not role_id)
- [x] 3.3 Verify driver profile is auto-created when registering with `role = 'Driver'`
- [x] 3.4 Verify token includes role string in response
