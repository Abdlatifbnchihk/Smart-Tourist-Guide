## Context

The admin panel includes a Role Management frontend page (B5) that requires a backend API to perform CRUD operations on roles. A `Role` model already exists with `name`, `slug`, and `description` fields, and a migration for the `roles` table is present. However, the corresponding `RoleController` is missing, though the route `Route::apiResource('roles', RoleController::class)` is already defined in `routes/api.php` under the admin middleware group. The middleware currently uses `role:admin`, which does not match the valid role string `Administrator`. This controller will complete the admin role management feature.

## Goals / Non-Goals

**Goals:**
- Provide a RESTful API for administrators to manage roles (list, create, view, update, delete)
- Include user count with each role listing
- Validate uniqueness of `name` and `slug` on create and update
- Prevent deletion of roles that have users assigned
- Align the middleware parameter with the actual role string (`Administrator`)

**Non-Goals:**
- Modifying the existing role assignment logic (users still use a `role` string column, not a foreign key)
- Changing the `Role` model relationships or database schema
- Implementing role-based permissions beyond the existing ENUM system
- Adding new frontend components (only the backend API)

## Decisions

### 1. Use existing `Role` model and migration
**Decision:** Leverage the existing `Role` model and `roles` table; no schema changes required.  
**Rationale:** The model already defines the correct fillable fields and a `users()` relationship, which can be used for user counts and deletion checks. This avoids unnecessary database changes.

### 2. Create dedicated Form Requests for validation
**Decision:** Create `StoreRoleRequest` and `UpdateRoleRequest` form request classes.  
**Rationale:** Follows the existing pattern in the admin module (see `StoreUserRequest`, `UpdateAdminUserRequest`). Centralizes validation rules, improves readability, and ensures consistency.

### 3. Return JSON responses without a dedicated Resource class
**Decision:** Return plain JSON responses from the controller methods.  
**Rationale:** The role data is simple (only a few fields) and does not require transformation or embedding relationships beyond user counts. A resource class would be overkill; we can use `withCount('users')` and return the model directly.

### 4. Update the route middleware parameter from `admin` to `administrator`
**Decision:** Modify the existing route definition to use `role:administrator` instead of `role:admin`.  
**Rationale:** The `EnsureRoleIs` middleware compares against the exact role string `Administrator`. The current `admin` parameter would always deny access. This change is necessary for the controller to function.

### 5. Implement soft checks on role deletion
**Decision:** Before deleting a role, check if any users are assigned (using the `users()` relationship). If users exist, return an error response with a count.  
**Rationale:** Prevents accidental removal of roles that are in use, maintaining data integrity. The frontend can display the count to inform the administrator.

## Risks / Trade-offs

- **Risk:** Changing the middleware parameter may affect existing frontend calls that rely on the current (broken) route.  
  **Mitigation:** The route is currently non-functional due to the middleware mismatch; fixing it will enable the intended behavior.

- **Risk:** Using `withCount('users')` on every index request could impact performance if the roles table grows large.  
  **Mitigation:** The roles table is expected to remain small (likely < 10 entries). If performance becomes an issue, caching can be added later.

- **Trade-off:** Not using a Resource class means the response structure may need manual adjustment if additional fields are added later.  
  **Justification:** Simplicity outweighs future flexibility for this straightforward CRUD endpoint.