## 1. Form Request

- [x] 1.1 Create `UpdateUserRequest` in `app/Http/Requests/UpdateUserRequest.php` with rules: `first_name` (required|string|max:100), `last_name` (required|string|max:100), `email` (required|email|max:150), `phone` (required|string|max:20)
- [x] 1.2 Ensure `name` is NOT in the validation rules

## 2. UserResource

- [x] 2.1 Create `UserResource` in `app/Http/Resources/UserResource.php` with fields: `user_id`, `first_name`, `last_name`, `email`, `phone`, `role`, `status`, `active`
- [x] 2.2 Ensure `role_id` and `name` are NOT in the resource output
- [x] 2.3 Add `driver` relationship to resource output when loaded

## 3. UserController

- [x] 3.1 Create `UserController` in `app/Http/Controllers/Api/UserController.php`
- [x] 3.2 Implement `profile()` method: return authenticated user with `driver` relationship loaded using `UserResource`
- [x] 3.3 Implement `updateProfile()` method: accept `UpdateUserRequest`, update `first_name`, `last_name` on authenticated user
- [x] 3.4 Implement `updateDriverProfile()` method: validate driver-specific fields (`license_number`, `years_of_experience`, `languages`, `available`), update Driver model, check user has `role = 'Driver'`

## 4. Verification

- [x] 4.1 Verify UserResource outputs `role` string (not `role_id`) (verified: line 18)
- [x] 4.2 Verify UserResource outputs `first_name`, `last_name` (not `name`) (verified: lines 14-15)
- [x] 4.3 Verify UpdateUserRequest has no `name` rule (verified: only first_name, last_name, email, phone)
- [x] 4.4 Verify UserController profile returns correct MLD fields (verified: uses UserResource)
- [x] 4.5 Verify driver update checks role before updating (verified: line 36 checks role === 'Driver')
