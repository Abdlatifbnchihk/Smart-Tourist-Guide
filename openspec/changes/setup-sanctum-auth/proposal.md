## Why

The Smart Tourist Guide backend needs secure, token-based API authentication to protect all endpoints. Laravel Sanctum provides lightweight SPA authentication and API token auth, which is essential for role-based access control and securing tourist, driver, and admin operations.

## What Changes

- Install and configure Laravel Sanctum for API token authentication
- Add `HasApiTokens` trait to the User model
- Configure Sanctum middleware for stateful domains (local development)
- Set up token abilities for role-based access control (RBAC)
- Configure CORS and stateful domains for local development (`localhost:8000`, `localhost:5173`)

## Capabilities

### New Capabilities

- `api-auth`: API token-based authentication using Laravel Sanctum, including token issuance, revocation, abilities for RBAC, and middleware configuration

### Modified Capabilities

- `user-identity`: Add `HasApiTokens` trait to User model (minor modification, no requirement changes)

## Impact

- **Dependencies**: Requires `laravel/sanctum` package
- **Code**: User model modified to include `HasApiTokens` trait
- **Configuration**: `bootstrap/app.php` middleware updated, `config/sanctum.php` published, `.env` updated with `SANCTUM_STATEFUL_DOMAINS`
- **Database**: New `personal_access_tokens` table created via migration
