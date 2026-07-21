## Why

The UserController, UserResource, and related Form Requests don't align with the MLD schema. They reference `name` (should be `first_name` + `last_name`), `role_id` (should be `role` ENUM string), and lack driver profile management. These need updating to match the database design before API consumers depend on incorrect field names.

## What Changes

- **BREAKING**: UserResource removes `role_id`, adds `role` string, `first_name`, `last_name`, `status` string
- **BREAKING**: UserController `profile()` returns user with direct relationships (no role_id)
- **BREAKING**: UserController `updateProfile()` accepts `first_name`, `last_name` (not `name`)
- Add driver profile update method to UserController
- Create UpdateUserRequest with correct fields
- Create UserController if not exists

## Capabilities

### Modified Capabilities
- `user-identity`: User profile API returns MLD-aligned fields, no `name` or `role_id` references

### New Capabilities
- `user-api`: UserController, UserResource, and UpdateUserRequest for user profile management

## Impact

- `app/Http/Controllers/Api/UserController.php`: New or updated controller
- `app/Http/Resources/UserResource.php`: New or updated resource
- `app/Http/Requests/UpdateUserRequest.php`: New form request
- All API routes using `/api/v1/user/profile` or `/api/v1/user/profile/update`
