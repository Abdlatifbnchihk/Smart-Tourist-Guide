## Context

The `EnsureRoleIs` middleware is the core RBAC mechanism for route protection. Currently it may reference a `roles` table or `role_id` foreign key pattern, but the database design (MLD) uses an ENUM column `role` directly on the `users` table with values: `Tourist`, `Driver`, `Hotel Manager`, `Administrator`.

The middleware must be updated to align with this design by checking the ENUM string value directly on the user model.

## Goals / Non-Goals

**Goals:**
- Update `EnsureRoleIs` to check `$user->role` string (ENUM) instead of `$user->role_id`
- Remove any `App\Models\Role` import or roles table queries
- Support multiple role checks (e.g., `['Administrator', 'Driver']`)
- Maintain backward compatibility with existing route definitions

**Non-Goals:**
- Changing the database schema (already correct)
- Adding new role types
- Implementing permission-based access (only role-based)
- Modifying the User model (already correct per specs)

## Decisions

### Decision 1: Use string comparison for role checks

**Choice:** `$user->role === 'Administrator'`

**Alternatives considered:**
- Using `Role` enum: `$user->role === Role::Administrator` — requires importing the enum, adds dependency
- Database query: `$user->roles()->contains(...)` — requires roles table, doesn't match MLD

**Rationale:** String comparison is simple, direct, and matches the ENUM column type. The Role enum class exists but middleware should be lightweight.

### Decision 2: Accept string or array of allowed roles

**Choice:** Middleware accepts `$role` parameter as string or array

```php
// Single role
->middleware('role:Administrator')

// Multiple roles
->middleware('role:Administrator,Driver')
```

**Rationale:** Flexible for routes that need single or multiple role access.

### Decision 3: Return 403 Forbidden for unauthorized access

**Choice:** Abort with 403 when user role doesn't match

**Rationale:** Standard HTTP response for authorization failures. Consistent with Laravel conventions.

## Risks / Trade-offs

**[Risk]** Existing routes may use `role_id` syntax → **Mitigation:** Audit all route definitions during implementation, update any that use old pattern

**[Risk]** Role string case sensitivity → **Mitigation:** Use exact ENUM values from database (`Tourist`, not `tourist`)

**[Risk]** Middleware registered incorrectly in Kernel → **Mitigation:** Verify alias is `'role' => EnsureRoleIs::class`
