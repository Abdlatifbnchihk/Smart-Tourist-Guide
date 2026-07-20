## Why

The AuthController currently uses inline validation and doesn't auto-create driver profiles on registration. The MLD schema specifies that users with `role = 'Driver'` must have a drivers profile. This change adds Form Request classes for cleaner validation and auto-creates driver profiles when a user registers with the Driver role.

## What Changes

- Create `RegisterUserRequest` form request class with role field validation (ENUM values)
- Create `LoginUserRequest` form request class for login validation
- Update `AuthController::register()` to use `RegisterUserRequest` and auto-create driver profile
- Update `AuthController::login()` to use `LoginUserRequest`
- Ensure no `role_id` references exist (only ENUM role string)

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `api-authentication`: Registration now includes driver profile auto-creation and uses Form Request classes for validation.

## Impact

- **Backend**: New Form Request classes in `app/Http/Requests/`
- **Backend**: Modified `AuthController` to use Form Requests and auto-create driver profiles
- **No database changes**: Uses existing ENUM role column and drivers table
- **No breaking changes**: Existing API behavior preserved; driver profile creation is additive
