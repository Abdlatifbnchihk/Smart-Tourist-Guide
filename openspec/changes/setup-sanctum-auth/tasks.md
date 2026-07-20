## 1. Installation

- [x] 1.1 Run `composer require laravel/sanctum` to install the package
- [x] 1.2 Run `php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"` to publish config and migration
- [x] 1.3 Run `php artisan migrate` to create the `personal_access_tokens` table

## 2. Model Configuration

- [x] 2.1 Add `HasApiTokens` trait to `app/Models/User.php`

## 3. Middleware Configuration

- [x] 3.1 Add Sanctum middleware to `bootstrap/app.php` for API authentication

## 4. Environment Configuration

- [x] 4.1 Add `SANCTUM_STATEFUL_DOMAINS=localhost:8000,localhost:5173` to `.env`
- [x] 4.2 Verify `SANCTUM_STATEFUL_DOMAINS` is loaded in config

## 5. Verification

- [x] 5.1 Verify `personal_access_tokens` table exists via migration
- [x] 5.2 Verify User model can create tokens with `$user->createToken()`
- [ ] 5.3 Verify unauthenticated requests to protected routes return HTTP 401
