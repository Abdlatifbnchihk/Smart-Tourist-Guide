## 1. Middleware Implementation

- [x] 1.1 Create `EnsureRoleIs` middleware in `app/Http/Middleware/EnsureRoleIs.php` with `handle($request, Closure $next, ...$roles)` method
- [x] 1.2 Implement role parameter parsing: split comma-separated roles string into array
- [x] 1.3 Implement strict string comparison: `in_array($user->role, $roles)` with exact ENUM values
- [x] 1.4 Add `abort(403, 'Unauthorized')` when user role not in allowed roles
- [x] 1.5 Remove any `App\Models\Role` import or `roles` table query

## 2. Kernel Registration

- [x] 2.1 Open `app/Http/Kernel.php` and locate `$middlewareAliases` array (Laravel 11+ uses `bootstrap/app.php`)
- [x] 2.2 Add or verify `'role' => \App\Http\Middleware\EnsureRoleIs::class` entry in `withMiddleware` callback
- [x] 2.3 Verify no duplicate registration in `$middleware` property

## 3. Verification

- [x] 3.1 Verify `EnsureRoleIs` has no `Role` model import (verified: only Closure, Request, Response)
- [x] 3.2 Verify middleware uses `$user->role` string comparison (not `role_id`) (verified: `in_array($user->role, $roles)`)
- [x] 3.3 Verify Kernel has `'role'` alias registered correctly (verified in `bootstrap/app.php`)
- [x] 3.4 Test single role: `middleware('role:Administrator')` allows admin, blocks others (logic verified)
- [x] 3.5 Test multiple roles: `middleware('role:Administrator,Driver')` allows both, blocks tourist (logic verified)
