## Context

The `AuthController` currently handles registration with inline validation and creates users with the ENUM `role` column directly. The MLD schema specifies that users with `role = 'Driver'` must have a `drivers` profile. Currently, driver profiles are not auto-created on registration, requiring a separate step. This change adds Form Request classes for cleaner validation and auto-creates driver profiles.

## Goals / Non-Goals

**Goals:**
- Create `RegisterUserRequest` form request for registration validation
- Create `LoginUserRequest` form request for login validation
- Auto-create `drivers` profile when a user registers with `role = 'Driver'`
- Ensure no `role_id` references exist in the codebase

**Non-Goals:**
- Modifying the database schema (ENUM role already exists)
- Changing API response structure
- Adding new authentication flows
- Modifying token creation logic

## Decisions

### 1. Form Request classes for validation
**Decision**: Extract validation logic into dedicated Form Request classes.

**Rationale**: Follows Laravel best practices for separation of concerns. Makes validation reusable and testable. Cleaner controller code.

### 2. Auto-create driver profile on registration
**Decision**: When `role = 'Driver'`, automatically create a `drivers` record with `user_id`, `first_name`, and `last_name` from the registration request.

**Rationale**: The MLD specifies that drivers must have a profile. Auto-creation simplifies the registration flow and ensures data consistency.

**Implementation**: After creating the user, check if `role == 'Driver'` and create a `Driver` record with:
- `user_id` = new user's ID
- `first_name` = from request
- `last_name` = from request
- `city_id` = from request (required for drivers)
- `license_number` = from request (required for drivers)

### 3. No Role model references
**Decision**: Use only the ENUM string values (`'Tourist'`, `'Driver'`, `'Hotel Manager'`, `'Administrator'`). No `Role` model or `role_id` column.

**Rationale**: The MLD design uses an ENUM column, not a foreign key to a roles table.

## Risks / Trade-offs

- **[Risk]** Driver profile creation may fail if required fields are missing → **Mitigation**: Include `city_id` and `license_number` as required fields in `RegisterUserRequest` when `role = 'Driver'`.
- **[Trade-off]** Auto-creating driver profile adds complexity to registration → **Accepted**: Improves UX and ensures MLD compliance.

## Migration Plan

1. Create `RegisterUserRequest` and `LoginUserRequest` classes
2. Update `AuthController` to use Form Requests
3. Add driver profile auto-creation logic
4. Test registration flow for all roles
