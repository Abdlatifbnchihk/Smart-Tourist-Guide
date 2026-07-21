## Why

The `EnsureRoleIs` middleware currently references a `roles` table and `role_id` foreign key, but the MLD design uses an ENUM column `role` directly on the `users` table. The middleware must be updated to check role string values (`'Administrator'`, `'Driver'`, `'Tourist'`, `'Hotel Manager'`) instead of querying a roles table.

## What Changes

- **BREAKING**: `EnsureRoleIs` middleware changes from checking `$user->role_id` to checking `$user->role` (ENUM string)
- Remove any `App\Models\Role` import or `roles` table query from middleware
- Verify `Kernel.php` middleware alias is correctly registered
- Pattern: `$user->role === 'Administrator'` instead of `$user->role_id === 1`

## Capabilities

### Modified Capabilities
- `user-identity`: Middleware requirement changes to use ENUM role string values instead of role_id foreign key

### New Capabilities
- `rbac-middleware`: Role-based access control middleware that validates user roles using ENUM string comparison

## Impact

- `app/Http/Middleware/EnsureRoleIs.php`: Core logic change
- `app/Http/Kernel.php`: Verify middleware alias registration
- All route groups using `EnsureRoleIs` middleware
- No database changes (schema already correct)
