# RBAC Middleware

## Purpose

Role-based access control middleware for route protection using ENUM role string comparison.

## Requirements

### Requirement: EnsureRoleIs middleware validates user role via ENUM comparison

The system SHALL provide an `EnsureRoleIs` middleware that checks if the authenticated user's `role` column matches one of the allowed roles passed as a parameter. The comparison SHALL be performed using strict string equality against the ENUM values: `Tourist`, `Driver`, `Hotel Manager`, `Administrator`.

#### Scenario: Middleware accepts single role parameter

- **WHEN** the middleware is invoked with `role:Administrator`
- **THEN** it SHALL extract `Administrator` as the single allowed role

#### Scenario: Middleware accepts multiple role parameters

- **WHEN** the middleware is invoked with `role:Administrator,Driver`
- **THEN** it SHALL extract `['Administrator', 'Driver']` as the allowed roles array

#### Scenario: Middleware uses strict string comparison

- **WHEN** comparing `$user->role` against allowed roles
- **THEN** the comparison SHALL use `===` operator (strict equality)

#### Scenario: Middleware returns 403 on role mismatch

- **WHEN** the user's role does not match any allowed role
- **THEN** the middleware SHALL `abort(403, 'Unauthorized')`

#### Scenario: Middleware requires authenticated user

- **WHEN** an unauthenticated request reaches the middleware
- **THEN** the middleware SHALL redirect to login or return 401 (depending on route type)

### Requirement: Kernel registers EnsureRoleIs middleware alias

The `app/Http/Kernel.php` file SHALL register the `EnsureRoleIs` middleware with the alias `'role'` in the `$middlewareAliases` array.

#### Scenario: Middleware alias exists in Kernel

- **WHEN** checking `app/Http/Kernel.php`
- **THEN** the `$middlewareAliases` array SHALL contain `'role' => \App\Http\Middleware\EnsureRoleIs::class`

#### Scenario: No duplicate middleware registration

- **WHEN** checking `app/Http/Kernel.php`
- **THEN** the `'role'` alias SHALL NOT be registered in both `$middleware` and `$middlewareAliases`
