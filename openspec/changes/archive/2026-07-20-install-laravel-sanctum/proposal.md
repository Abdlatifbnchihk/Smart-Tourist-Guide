## Why

The application needs secure API token-based authentication to protect endpoints and enable role-based access control. Laravel Sanctum provides a lightweight, first-party solution for SPA authentication and API token management that integrates seamlessly with the existing User model.

## What Changes

- Install `laravel/sanctum` via Composer
- Publish Sanctum configuration and migration files
- Run database migration to create `personal_access_tokens` table
- Configure middleware stack in `bootstrap/app.php`
- Set up stateful domains for local development (localhost:8000, localhost:5173)
- Add `HasApiTokens` trait to User model
- Configure token abilities for role-based access control (RBAC)

## Capabilities

### New Capabilities
- `api-authentication`: API token issuance, validation, and revocation using Laravel Sanctum with role-based token abilities

### Modified Capabilities
- `user-identity`: Add `HasApiTokens` trait to User model for token management integration

## Impact

- **Dependencies**: Adds `laravel/sanctum` package
- **Database**: New `personal_access_tokens` table via migration
- **Models**: User model modified with `HasApiTokens` trait
- **Configuration**: New `config/sanctum.php` configuration file
- **Middleware**: Updated middleware stack in `bootstrap/app.php`
- **API**: All protected routes will require valid Sanctum tokens
