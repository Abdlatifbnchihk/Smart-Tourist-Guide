## Context

The Smart Tourist Guide platform uses Laravel with MySQL 8.0. The `docs/database.md` MLD defines the complete schema, but no models or migrations exist yet. The `drivers` table is a core catalog entity — it links a `users` record (role = Driver) to a city, holds transport credentials, and is referenced by `vehicles`, `bookings`, and `reviews`.

No models or migrations exist in the codebase yet. This is the first database implementation task.

## Goals / Non-Goals

**Goals:**
- Create a migration that exactly matches the MLD column definitions, types, defaults, and indexes
- Create the `Driver` Eloquent model with all four relationships (`belongsTo User`, `belongsTo City`, `hasMany Vehicles`, `hasMany Bookings`)
- Include a working `down()` method for rollback

**Non-Goals:**
- Factories, seeders, or test data
- Controllers, routes, or API endpoints
- Modifying existing tables (users, cities)
- Implementing the `reviews` relationship on Driver (reviews table doesn't exist yet)

## Decisions

**1. Follow MLD types exactly rather than Laravel conventions**
- `years_of_experience` → `TINYINT UNSIGNED` (not `integer`) per MLD `INT` note, but user spec says `TINYINT UNSIGNED`
- `license_number` → `VARCHAR(20)` per user spec (MLD says 100, but user override takes precedence)
- `user_id` → `BIGINT UNSIGNED` with UNIQUE constraint
- Rationale: MLD is the source of truth; user-provided column specs refine it

**2. Use `foreignId` with explicit constraints**
- Each FK uses `foreignId('column_name')->constrained('table')->cascadeOnDelete()` or `restrictOnDelete()` per relationship table
- `user_id`: `cascadeOnDelete` (driver deleted if user removed)
- `city_id`: `restrictOnDelete` (cannot delete city with drivers)

**3. Index strategy**
- PRIMARY KEY on `driver_id` (auto-increment)
- UNIQUE on `user_id` (one-to-one with users)
- INDEX on `available` (frequent filter for ride-matching queries)
- INDEX on `city_id` (geographic queries)

**4. Model fillable/guarded**
- Use `$fillable` for all columns except `driver_id` and timestamps (mass-assignment safe)
- Cast `available` to `boolean`

## Risks / Trade-offs

- **[Risk]** `license_number` VARCHAR(20) may be too short for some regions → Mitigation: MLD uses 100; user explicitly requested 20. Can be migrated later if needed.
- **[Risk]** No `city` relationship guard — a driver can be assigned to any city → Mitigation: Acceptable for now; city validation belongs in application layer.
