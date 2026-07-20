## Context

The current users table uses a `role_id` foreign key to a separate `roles` table, a single `name` column, and has nullable `phone`. The MLD design (docs/database.md) specifies:
- ENUM-based `role` column directly on users (no roles table)
- `first_name` + `last_name` instead of `name`
- `phone` as NOT NULL and UNIQUE
- `status` ENUM for account moderation
- `active` boolean (renamed from `is_active`)

Current migration: `0001_01_01_000000_create_users_table.php`
Current model: `app/Models/User.php`

## Goals / Non-Goals

**Goals:**
- Rewrite users migration to match MLD schema exactly
- Update User model with correct fillable, casts, and relationships
- Remove all Role model dependencies
- Ensure backward compatibility with Laravel Sanctum authentication

**Non-Goals:**
- Modifying other migrations that depend on users (will be handled in separate tasks)
- Updating frontend components (separate task)
- Creating seeder data for users (separate task)

## Decisions

### Decision 1: Keep Laravel internal columns (remember_token, email_verified_at)

**Choice**: Keep `remember_token` and `email_verified_at` columns even though they're not in MLD.

**Rationale**: Laravel's authentication system (Sanctum/Breeze) relies on `remember_token` for "remember me" functionality. `email_verified_at` supports email verification flows. These are framework requirements that don't conflict with the MLD design.

**Alternative considered**: Remove them entirely → Rejected because it would break Laravel's built-in auth features.

### Decision 2: Use native ENUM columns instead of separate tables

**Choice**: Use MySQL ENUM type for `role` and `status` columns via Laravel's `enum()` method.

**Rationale**: Matches MLD design exactly. Simpler queries, no JOINs needed for role checks. ENUM values are enforced at database level.

**Alternative considered**: Use string columns with application-level validation → Rejected because ENUM provides database-level constraint.

### Decision 3: Migration strategy — new migration file

**Choice**: Create a new migration file that drops and recreates the users table, rather than altering the existing one.

**Rationale**: The schema changes are extensive (column renames, type changes, constraint changes). A clean migration is clearer and less error-prone than multiple alter statements. Since this is pre-production, no data migration is needed.

**Alternative considered**: Alter existing migration → Rejected because the changes are too extensive for clean alters.

## Risks / Trade-offs

- **[Risk]** Other migrations reference `users.id` with foreign keys → **Mitigation**: Ensure foreign key references use `user_id` column name consistently. Other migrations will be updated in their own tasks.

- **[Risk]** Existing code references `Role` model → **Mitigation**: Update User model to remove Role relationship. AuthController and middleware updates are in scope.

- **[Risk]** Frontend expects `user.name` → **Mitigation**: UserResource will return `first_name` and `last_name`. Frontend update is a separate task.

- **[Trade-off]** Removing `avatar` column → Users won't have profile pictures until a future migration adds it back. Acceptable for MVP.

## Migration Plan

1. Create new migration file: `update_users_table_per_mld.php`
2. Drop existing foreign keys on `role_id`
3. Drop and recreate `users` table with new schema
4. Update User model
5. Test authentication flow (register, login, logout)
6. Verify RBAC middleware works with ENUM role

## Open Questions

- Should `email_verified_at` be kept for future email verification? (Current decision: yes)
- Should `avatar` be added back in a future migration? (Current decision: out of scope)
