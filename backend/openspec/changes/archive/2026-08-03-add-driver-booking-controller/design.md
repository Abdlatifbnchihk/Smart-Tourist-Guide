## Context

The Smart Tourist Guide backend has an existing `Booking` model with a `driver_id` foreign key and a `Driver` model linked to users via `user_id`. Routes for `driver/transport-bookings` are registered under the `role:driver` middleware, but the referenced controller does not exist. The `BookingStatus` enum already defines: Pending, Confirmed, InProgress, Cancelled, Completed.

## Goals / Non-Goals

**Goals:**
- Implement a `BookingController` in the `Driver` namespace with `index`, `show`, and `updateStatus` methods.
- Enforce that every booking operation is scoped to the authenticated driver (via `Driver.user_id`).
- Validate status transitions as a finite state machine.
- Create the `Driver` controller directory if it doesn't exist.

**Non-Goals:**
- Modifying the `Booking` model schema or adding migrations.
- Implementing full CRUD (create, delete) for bookings through this driver endpoint.
- Changing existing `TransportBookingController` or `HotelBookingController` behaviour.

## Decisions

| Decision | Choice | Rationale |
|---|---|---|
| **Controller location** | `app/Http/Controllers/Driver/BookingController.php` | Matches the import already in `routes/api.php:11` and the namespace convention used by `Driver\VehicleController`. |
| **Status update method** | `updateStatus` instead of generic `update` | Only status should be mutable through this endpoint. Prevents accidental field modification. The route already uses `update` action, but we map it to `updateStatus` internally. |
| **Ownership resolution** | Join through `Driver` model: `Booking.driver_id → Driver.id → Driver.user_id === auth->id` | Two-step join is necessary because `Booking` links to `Driver`, not directly to `User`. |
| **Status transition validation** | Case-by-case switch in the controller | Simple and explicit for 5 states. A separate state machine class is overkill for this scope. |
| **Route override** | Map the apiResource `update` action to `updateStatus` method | The existing route definition already calls `update`. Renaming in the controller method keeps the route file untouched. |

**Alternatives considered:**
- *Policy-based authorization*: Cleaner but adds a new file for a single controller; can be refactored later.
- *State machine package (spatie/laravel-data)*: Overkill for 5 states with simple transitions.

## Risks / Trade-offs

- [Invalid transition attempt] → Validation returns 422 with clear message listing allowed next states.
- [Driver record not found] → If authenticated user has no Driver record, return 404 or empty list gracefully.
- [Race condition on status update] → Database-level optimistic locking not implemented; acceptable for this scale.
