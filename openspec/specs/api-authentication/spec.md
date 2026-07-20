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
The system SHALL allow authenticated users to create personal access tokens.

#### Scenario: User creates a token
- **WHEN** an authenticated user calls `$user->createToken('device-name')`
- **THEN** a new token SHALL be created and returned

#### Scenario: Token has correct abilities
- **WHEN** a token is created with specific abilities
- **THEN** the token's `abilities` field SHALL contain only the specified abilities

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
