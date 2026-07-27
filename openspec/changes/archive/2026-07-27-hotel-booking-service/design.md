## Context

The Smart Tourist Guide platform has Room and Hotel models but no booking business logic layer. Bookings need server-side validation for room availability (considering `quantity_available` and overlapping confirmed bookings), price computation, and status transitions. The existing `hotel-bookings` table and model are assumed to exist with fields: `room_id`, `check_in`, `check_out`, `total_price`, `status` (pending/confirmed/completed/cancelled).

## Goals / Non-Goals

**Goals:**
- Encapsulate all booking business logic in a single `HotelBookingService`
- Validate room availability against overlapping confirmed bookings
- Compute `total_price` server-side using `price_per_night × nights`
- Enforce status state machine: `pending→confirmed→completed`, or `cancelled` from `pending`/`confirmed`
- Reject bookings where `check_out <= check_in`
- Throw exceptions for invalid transitions and unavailable rooms

**Non-Goals:**
- Payment processing (handled separately)
- Booking controller/API endpoints (separate concern)
- Email notifications or reminders
- User-facing booking UI

## Decisions

### Service class vs Trait
**Decision:** Service class (`App\Services\HotelBookingService`)
**Rationale:** Service classes are easier to test, inject, and discover. A trait would couple business logic to a model, making it harder to swap or extend.

### Availability check approach
**Decision:** Query overlapping confirmed bookings for the room, sum booked quantity, compare against `quantity_available`
**Rationale:** Direct query is simple and correct. The overlap condition: `check_in < booking.check_out AND check_out > booking.check_in` (standard interval overlap). Only `confirmed` bookings count toward availability.

### Price computation
**Decision:** `$totalPrice = $room->price_per_night * $checkIn->diffInDays($checkOut)`
**Rationale:** Uses Carbon for reliable date math. `diffInDays` returns integer days. Server-side only — never trust client-provided `total_price`.

### Status transitions
**Decision:** Array-based state machine
```php
private array $validTransitions = [
    'pending'   => ['confirmed', 'cancelled'],
    'confirmed' => ['completed', 'cancelled'],
    'completed' => [],
    'cancelled' => [],
];
```
**Rationale:** Simple, explicit, no external dependencies. Covers all required transitions.

### Exception handling
**Decision:** Throw `RuntimeException` for invalid transitions, `DomainException` for unavailable rooms
**Rationale:** Domain-specific exceptions make error handling in controllers clearer. `RuntimeException` for state violations, `DomainException` for business rule violations.

### Migration for `quantity_available`
**Decision:** Add `quantity_available` column to `rooms` table (default: 1)
**Rationale:** Most hotel rooms have quantity tracking. Default of 1 preserves backward compatibility.

## Risks / Trade-offs

- **Race conditions on availability check** → Mitigated by database-level locking (SELECT FOR UPDATE within a transaction)
- **Timezone handling** → Use Carbon with explicit timezone; store dates as `date` type (no timezone needed)
- **Backward compatibility** → Default `quantity_available = 1` ensures existing rooms work without migration

## Migration Plan

1. Run migration to add `quantity_available` column to `rooms` table
2. Create `HotelBookingService` class
3. Create unit tests
4. Wire service into booking controllers when ready

## Open Questions

- Should `quantity_available` apply per-room-type or per individual room record?
- Should past bookings be queryable or soft-deleted?
