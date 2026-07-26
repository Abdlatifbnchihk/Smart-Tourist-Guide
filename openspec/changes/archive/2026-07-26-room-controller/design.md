## Context

The Smart Tourist Guide platform has a `rooms` table, `Room` model, and `RoomResource` already defined, but the `RoomController` referenced in `routes/api.php` line 72 does not exist. The existing `RoomResource` uses outdated field names (`room_type`, `price`, `is_available`) that don't match the migration columns (`type`, `price_per_night`, `available`). The room management feature needs to be built from scratch with proper ownership validation, nested hotel routes, and soft deletes.

Current state:
- `rooms` table exists with columns: `room_id`, `hotel_id`, `number`, `type`, `capacity`, `price_per_night`, `available`, timestamps
- `Room` model has `belongsTo(Hotel)` and `hasMany(Booking)` relationships
- `RoomResource` exists but uses wrong field names
- Route `apiResource('rooms', RoomController::class)` is defined but controller is missing
- Hotels use `created_by` FK to track owner, with `SoftDeletes` trait

## Goals / Non-Goals

**Goals:**
- Create `RoomController` with full CRUD (index, store, show, update, destroy)
- Nest room creation/listing under parent hotel route (`/hotels/{hotelId}/rooms`)
- Standalone routes for show/update/destroy (`/rooms/{id}`)
- Ownership validation: only hotel owner or admin can create/update/delete rooms
- Update `RoomResource` to match actual migration columns and include hotel relationship
- Add soft deletes to rooms table and model
- Price validation: `price_per_night > 0`

**Non-Goals:**
- Booking/availability engine (already exists separately)
- Room image upload
- Room type taxonomy management
- Complex availability date-range calculations (just expose `available` boolean)

## Decisions

### 1. Nested vs standalone routes for room CRUD
**Decision:** Nest `store` and `index` under `/hotels/{hotelId}/rooms`, keep `show`/`update`/`destroy` standalone at `/rooms/{id}`.

**Why:** Nesting list/create under hotel makes the parent-child relationship explicit and allows validating the hotel exists before creating a room. Standalone show/update/delete by room ID is simpler for clients that already have the room ID.

**Alternatives considered:**
- All standalone `/rooms` routes: Loses the hotel context on create
- All nested `/hotels/{hotelId}/rooms`: Makes delete/update awkward when client only has room ID

### 2. Ownership validation approach
**Decision:** In `store`, resolve hotel via `{hotelId}` route param, check `$request->user()->id === $hotel->created_by || $request->user()->role === 'administrator'`. In `update`/`destroy`, resolve room via `{room}`, load `$room->hotel->created_by`, same check.

**Why:** Follows the same pattern used in `HotelController` (lines 94, 116). Consistent across the codebase.

**Alternatives considered:**
- Policy class: Overkill for this simple ownership check
- Middleware: Can't dynamically resolve room's parent hotel

### 3. Soft deletes on rooms
**Decision:** Add `deleted_at` column via new migration, add `SoftDeletes` trait to `Room` model.

**Why:** Consistent with hotels which already use soft deletes. Allows recovery of accidentally deleted rooms. Hotel's `onDelete: cascade` FK still works with soft deletes.

### 4. RoomResource field mapping
**Decision:** Update `RoomResource` to use actual migration column names: `number`, `type` (not `room_type`), `price_per_night` (not `price`), `available` (not `is_available`). Add `hotel` relationship.

**Why:** The current resource references fields that don't exist in the migration. Must align with actual schema.

## Risks / Trade-offs

- **Risk:** Existing clients may depend on old `RoomResource` field names (`room_type`, `price`, `is_available`) → **Mitigation:** This is a new feature (controller didn't exist), so no live clients yet. Breaking change is safe now.
- **Risk:** `rooms` table lacks `deleted_at` column → **Mitigation:** New migration adds it. Existing data unaffected.
- **Risk:** Room `number` uniqueness is not enforced at DB level (same hotel could have duplicate room numbers) → **Mitigation:** Out of scope for this change; can add unique constraint later.
