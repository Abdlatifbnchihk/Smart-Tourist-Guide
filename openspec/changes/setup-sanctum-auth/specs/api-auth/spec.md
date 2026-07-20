## ADDED Requirements

### Requirement: Sanctum is installed and configured
The system SHALL install `laravel/sanctum` and publish its configuration and migration files. The `personal_access_tokens` table SHALL exist after migration.

#### Scenario: Sanctum package is installed
- **WHEN** the developer runs `composer require laravel/sanctum`
- **THEN** the `laravel/sanctum` package SHALL be added to `composer.json` dependencies

#### Scenario: Sanctum migration is published and run
- **WHEN** the developer runs `php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"` and `php artisan migrate`
- **THEN** the `personal_access_tokens` table SHALL exist in the database

### Requirement: User model has HasApiTokens trait
The User model SHALL use the `HasApiTokens` trait from Sanctum to enable token creation and management.

#### Scenario: User can create API tokens
- **WHEN** a User instance calls `$user->createToken('token-name')`
- **THEN** a new personal access token SHALL be created and returned

#### Scenario: User can revoke tokens
- **WHEN** a User instance calls `$user->tokens()->delete()`
- **THEN** all tokens for that user SHALL be revoked

### Requirement: Sanctum middleware is configured
The application SHALL configure Sanctum middleware in `bootstrap/app.php` to authenticate incoming API requests.

#### Scenario: API routes use Sanctum authentication
- **WHEN** an API request is made to a route protected by `auth:sanctum` middleware
- **THEN** the request SHALL be authenticated using a valid API token

#### Scenario: Unauthenticated requests are rejected
- **WHEN** an API request is made to a protected route without a valid token
- **THEN** the system SHALL respond with HTTP 401 Unauthorized

### Requirement: Stateful domains are configured for local development
The system SHALL configure `SANCTUM_STATEFUL_DOMAINS` in `.env` to allow `localhost:8000` and `localhost:5173` for local development.

#### Scenario: Local development domains are stateful
- **WHEN** the application runs locally
- **THEN** requests from `localhost:8000` and `localhost:5173` SHALL be treated as stateful (first-party) requests

### Requirement: Token abilities support role-based access control
The system SHALL support assigning abilities to tokens that can be used for RBAC. Abilities SHALL be checked via `$token->can('ability-name')` or `Gate::forUser($user)->allows('ability-name')`.

#### Scenario: Token is created with abilities
- **WHEN** a token is created with abilities `['admin', 'manage-users']`
- **THEN** the token SHALL be able to perform actions requiring those abilities

#### Scenario: Token without ability is rejected
- **WHEN** a token is created with abilities `['driver']`
- **THEN** the token SHALL NOT be able to perform actions requiring `admin` ability
