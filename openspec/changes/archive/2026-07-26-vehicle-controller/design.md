## Context

The Smart Tourist Guide platform has a `vehicles` table, `Vehicle` model with relationships, and a route `apiResource('vehicles', VehicleController::class)` in `routes/api.php` line 84, but the `VehicleController` does not exist. The vehicle module needs full CRUD with ownership validation for the transport/ride-booking feature.

Current state:
- `vehicles` table exists with columns: `vehicle_id`, `driver_id` (FK), `brand`, `model`, `type`, `seats`, `registration_number` (UNIQUE), `air_conditioning`, timestamps
- `Vehicle` model has `belongsTo(Driver)`, `hasMany(Booking)` relationships
- No `VehicleController` exists
- Route is defined but controller is missing
- Table lacks `price_per_km` column needed for fare calculation

## Goals / Non-Goals

**Goals:**
- Create `VehicleController` with index, store, show, update, destroy methods
- Index: list vehicles for a driver via nested route
- Store: driver creates vehicle under their profile (ownership check)
- Show: vehicle detail with driver relationship
- Update: driver edits own vehicle (ownership check)
- Destroy: driver deletes own vehicle
- Add `price_per_km` column (DECIMAL(10,2), required, > 0)
- Type validation: sedan, suv, van, minibus only
- `registration_number` unique validation

**Non-Goals:**
- Vehicle image upload
- Vehicle maintenance tracking
- Vehicle availability scheduling

## Decisions

### 1. Nested vs standalone routes
**Decision:** Nest `store` and `index` under `/drivers/{driverId}/vehicles`, keep `show`/`update`/`destroy` standalone at `/vehicles/{id}`.

**Why:** Follows the same pattern as RoomController (nested under hotels). Makes parent-child relationship explicit.

### 2. Ownership validation
**Decision:** In `store`, resolve driver via `{driverId}`, check `$request->user()->id === $driver->user_id || admin`. In `update`/`destroy`, resolve vehicle, load `$vehicle->driver->user_id`, same check.

**Why:** Consistent with HotelController and RoomController patterns.

### 3. price_per_km column
**Decision:** Add `price_per_km` DECIMAL(10,2) NOT NULL column via new migration. Required field with `gt:0` validation.

**Why:** Needed for fare estimation in the booking engine.

### 4. Type validation
**Decision:** Use `in:sedan,suv,van,minibus` validation rule.

**Why:** Restricts vehicle types to known categories for ride matching.

## Risks / Trade-offs

- **Risk:** Adding `price_per_km` requires migration → **Mitigation:** New migration, existing data defaults to 0 then updated.
- **Risk:** `registration_number` is UNIQUE → clear 422 on duplicate.
- **Risk:** No `price_per_km` in original migration → **Mitigation:** New migration adds it.
