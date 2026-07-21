## MODIFIED Requirements

### Requirement: EnsureRoleIs middleware uses ENUM role string

The `EnsureRoleIs` middleware SHALL check the user's `role` column (ENUM string) directly instead of querying a roles table or using `role_id`. The middleware SHALL accept a comma-separated list of allowed roles and compare against `$user->role` using strict string comparison.

#### Scenario: Middleware allows access for matching single role

- **WHEN** a user with `role = 'Administrator'` accesses a route protected by `middleware('role:Administrator')`
- **THEN** the request SHALL proceed normally

#### Scenario: Middleware denies access for non-matching role

- **WHEN** a user with `role = 'Tourist'` accesses a route protected by `middleware('role:Administrator')`
- **THEN** the system SHALL return a 403 Forbidden response

#### Scenario: Middleware allows access for multiple roles

- **WHEN** a user with `role = 'Driver'` accesses a route protected by `middleware('role:Administrator,Driver')`
- **THEN** the request SHALL proceed normally

#### Scenario: Middleware denies access when not in multiple role list

- **WHEN** a user with `role = 'Tourist'` accesses a route protected by `middleware('role:Administrator,Driver')`
- **THEN** the system SHALL return a 403 Forbidden response

#### Scenario: No Role model reference in middleware

- **WHEN** the `EnsureRoleIs` middleware is loaded
- **THEN** no `use App\Models\Role` import SHALL exist
- **AND** no database query to a `roles` table SHALL occur

#### Scenario: Middleware registered in Kernel

- **WHEN** checking `app/Http/Kernel.php`
- **THEN** the middleware alias `'role'` SHALL be registered pointing to `EnsureRoleIs::class`
