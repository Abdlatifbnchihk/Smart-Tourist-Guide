## Context

The Smart Tourist Guide platform has a `drivers` table, `Driver` model with relationships defined, and a route `apiResource('drivers', DriverController::class)` in `routes/api.php` line 82, but the `DriverController` does not exist. The driver module needs full CRUD with role-based access control for the transport/ride-booking feature.

Current state:
- `drivers` table exists with columns: `id`, `user_id` (UNIQUE FK), `city_id` (FK), `license_number`, `years_of_experience`, `languages`, `available`, timestamps
- `Driver` model has `belongsTo(User)`, `belongsTo(City)`, `hasMany(Vehicle)`, `hasMany(Booking)` relationships
- No `DriverController`, `DriverResource`, or form requests exist
- Route is defined but controller is missing

## Goals / Non-Goals

**Goals:**
- Create `DriverController` with index, store, show, update, verify methods
- Index: paginated list with city filter and verified-only toggle
- Store: driver creates own profile (role: driver only)
- Show: driver detail with vehicles, reviews
- Update: driver edits own profile (ownership check)
- Verify: admin toggles `is_verified` (admin only)
- `license_number` unique validation on create
- `DriverResource` with user, city, vehicles, reviews relationships

**Non-Goals:**
- Driver availability scheduling
- Ride matching algorithms
- Driver document upload/verification
- Earnings/payment management

## Decisions

### 1. Verification field approach
**Decision:** The `drivers` table does not currently have an `is_verified` column. A migration is needed to add it. The `PATCH /drivers/{id}/verify` endpoint toggles this boolean.

**Why:** Verification is a separate concern from profile data. Using PATCH (not PUT) since it's a partial update of a single field.

**Alternatives considered:**
- Separate `driver_verifications` table: Overkill for a simple boolean toggle
- Use existing `available` field: Conflates two different concepts (availability vs verification)

### 2. Ownership validation
**Decision:** In `update`, resolve driver via `{id}`, check `$request->user()->id === $driver->user_id || $request->user()->role === 'administrator'`.

**Why:** Follows the same pattern used in `HotelController` and `RoomController`. Consistent across the codebase.

### 3. Route structure
**Decision:** Keep `apiResource` for standard CRUD routes, add explicit `PATCH` route for verify.

**Why:** `apiResource` generates all standard routes (index, store, show, update, destroy). The verify endpoint is non-standard and needs an explicit route.

### 4. No soft deletes
**Decision:** Drivers do not use soft deletes. The `destroy` method permanently deletes the driver profile.

**Why:** Driver profiles are tied to user accounts. If a user is deleted, the driver profile cascades. No business need for recovery.

## Risks / Trade-offs

- **Risk:** Adding `is_verified` column requires a migration → **Mitigation:** Create migration as part of this change. Existing data defaults to `false`.
- **Risk:** `user_id` is UNIQUE — second call to store for same user fails → **Mitigation:** Validate unique in `StoreDriverRequest`, return clear 422 error.
- **Risk:** No `is_verified` column in original migration → **Mitigation:** New migration adds it. No data loss.
