# API Authentication

## Purpose

API token-based authentication using Laravel Sanctum with role-based access control via token abilities.

## Requirements

### Requirement: Sanctum package is installed and configured
The system SHALL have `laravel/sanctum` installed via Composer and properly configured.

#### Scenario: Sanctum package is present
- **WHEN** running `composer show laravel/sanctum`
- **THEN** the package SHALL be listed as installed

#### Scenario: Sanctum config file exists
- **WHEN** checking for `config/sanctum.php`
- **THEN** the configuration file SHALL exist

### Requirement: Personal access tokens table exists
The system SHALL have a `personal_access_tokens` table created via Sanctum migration.

#### Scenario: Migration has been run
- **WHEN** running `php artisan migrate`
- **THEN** the `personal_access_tokens` table SHALL exist with columns: `id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`

### Requirement: API tokens can be issued
The system SHALL allow authenticated users to create personal access tokens and provide public routes for user registration and login.

#### Scenario: User creates a token
- **WHEN** an authenticated user calls `$user->createToken('device-name')`
- **THEN** a new token SHALL be created and returned

#### Scenario: Token has correct abilities
- **WHEN** a token is created with specific abilities
- **THEN** the token's `abilities` field SHALL contain only the specified abilities

#### Scenario: User registers as Tourist
- **WHEN** a POST request is made to `/api/v1/auth/register` with `role = 'Tourist'`
- **THEN** a new user SHALL be created with `role = 'Tourist'`
- **AND** a token SHALL be returned

#### Scenario: User registers as Driver
- **WHEN** a POST request is made to `/api/v1/auth/register` with `role = 'Driver'`
- **THEN** a new user SHALL be created with `role = 'Driver'`
- **AND** a driver profile SHALL be auto-created with `user_id`, `first_name`, `last_name`, `city_id`, and `license_number`
- **AND** a token SHALL be returned

#### Scenario: Registration uses Form Request validation
- **WHEN** a POST request is made to `/api/v1/auth/register`
- **THEN** the request SHALL be validated via `RegisterUserRequest`
- **AND** validation rules SHALL include: `first_name`, `last_name`, `email`, `phone`, `password`, `role`
- **AND** when `role = 'Driver'`, additional required fields: `city_id`, `license_number`

#### Scenario: User can login via API
- **WHEN** a POST request is made to `/api/v1/auth/login` with valid credentials
- **THEN** a token SHALL be returned for the authenticated user

#### Scenario: User can logout via API
- **WHEN** an authenticated user makes a POST request to `/api/v1/auth/logout`
- **THEN** the current token SHALL be revoked

#### Scenario: User can get profile via API
- **WHEN** an authenticated user makes a GET request to `/api/v1/auth/me`
- **THEN** the user's profile data SHALL be returned

### Requirement: API tokens can be validated
The system SHALL validate incoming API tokens on protected routes.

#### Scenario: Valid token authenticates request
- **WHEN** a request includes a valid Bearer token in the Authorization header
- **THEN** the request SHALL be authenticated as the token's owner

#### Scenario: Invalid token is rejected
- **WHEN** a request includes an invalid or expired token
- **THEN** the system SHALL return a 401 Unauthorized response

### Requirement: API tokens can be revoked
The system SHALL allow users to revoke (delete) their tokens.

#### Scenario: User revokes a token
- **WHEN** a user calls `$token->delete()`
- **THEN** the token SHALL be removed from the database
- **AND** the token SHALL no longer authenticate requests

### Requirement: Token abilities support role-based access
The system SHALL support token abilities for role-based access control.

#### Scenario: Token with manage-bookings ability
- **WHEN** a token is created with `['manage-bookings']` ability
- **THEN** `$token->can('manage-bookings')` SHALL return true

#### Scenario: Token without ability is denied
- **WHEN** a token does not have a specific ability
- **THEN** `$token->can('that-ability')` SHALL return false

### Requirement: RegisterUserRequest validates registration fields
The `RegisterUserRequest` form request SHALL validate:
- `first_name`: required, string, max 100
- `last_name`: required, string, max 100
- `email`: required, email, max 150, unique users
- `phone`: required, string, max 20, unique users
- `password`: required, string, min 8, confirmed
- `role`: required, in: Tourist, Driver, Hotel Manager, Administrator
- When `role = 'Driver'`: `city_id` required, `license_number` required

#### Scenario: Valid registration data passes validation
- **WHEN** a registration request contains all required fields with valid values
- **THEN** validation SHALL pass

#### Scenario: Missing required field fails validation
- **WHEN** a registration request is missing a required field
- **THEN** validation SHALL fail with appropriate error message

#### Scenario: Invalid role value fails validation
- **WHEN** a registration request has `role = 'invalid'`
- **THEN** validation SHALL fail

### Requirement: LoginUserRequest validates login fields
The `LoginUserRequest` form request SHALL validate:
- `email`: required, email
- `password`: required

#### Scenario: Valid login credentials pass validation
- **WHEN** a login request contains valid email and password
- **THEN** validation SHALL pass

### Requirement: No Role model references
The authentication system SHALL NOT import or reference any `Role` model. Only ENUM string values SHALL be used for role assignment.

#### Scenario: No Role model import in AuthController
- **WHEN** the `AuthController` is loaded
- **THEN** no `use App\Models\Role` import SHALL exist

#### Scenario: No role_id references
- **WHEN** creating a user during registration
- **THEN** the `role` field SHALL be set directly from the request ENUM value
- **AND** no `role_id` field SHALL be included
