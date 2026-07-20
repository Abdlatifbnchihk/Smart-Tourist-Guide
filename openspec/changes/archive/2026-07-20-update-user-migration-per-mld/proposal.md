## Why

The current users migration and model are based on an outdated schema that uses a separate `roles` table with a `role_id` foreign key. The MLD design (docs/database.md) specifies role-based access via an ENUM column directly on the `users` table, eliminates the `roles` table, splits `name` into `first_name`/`last_name`, adds a `status` ENUM for account moderation, and makes `phone` required and unique. This change aligns the implementation with the approved database design.

## What Changes

- **BREAKING**: Remove `role_id` foreign key and `roles` table dependency → replace with `role` ENUM column (`Tourist`, `Driver`, `Hotel Manager`, `Administrator`)
- **BREAKING**: Split `name` column into `first_name` and `last_name` (both VARCHAR(100), NOT NULL)
- **BREAKING**: `phone` changes from nullable to NOT NULL with UNIQUE constraint
- Add `status` ENUM column (`Pending`, `Approved`, `Rejected`, `Suspended`) with default `Pending`
- Rename `is_active` to `active` (boolean, default true)
- Remove `avatar` column (not in MLD)
- Remove `email_verified_at` column (not in MLD)
- Update User model: remove `role()` belongsTo relationship, add ENUM casts, update `$fillable`, update relationships to match new schema (remove `hotel()`, rename booking relationships)
- Remove Role model reference from User model

## Capabilities

### New Capabilities
- `user-identity`: User registration, authentication, and profile management with ENUM-based role and status fields

### Modified Capabilities
<!-- No existing specs to modify -->

## Impact

- **Migration**: `0001_01_01_000000_create_users_table.php` — full rewrite of users table schema
- **Model**: `app/Models/User.php` — update fillable, casts, relationships, remove Role dependency
- **Enums**: `app/Enums/Role.php` and `app/Enums/UserStatus.php` — already exist, verify values match MLD
- **AuthController**: Registration logic must set `role` ENUM directly instead of `role_id`
- **RBAC Middleware**: Must check `$user->role === 'admin'` instead of `$user->role_id === 1`
- **UserResource**: Must return `role` string, `first_name`, `last_name`, `status` instead of `name`, `role_id`
- **Frontend**: Any component displaying `user.name` must use `user.first_name + user.last_name`
