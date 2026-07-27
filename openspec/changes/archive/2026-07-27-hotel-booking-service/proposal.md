## Why

Hotel bookings currently lack a proper backend service layer with business logic for availability checking, price computation, and status transitions. The application needs a dedicated `HotelBookingService` to handle core booking workflows: room availability validation, overlapping booking detection, server-side price calculation, and state machine enforcement. Without this, booking logic would leak into controllers or be missing entirely.

## What Changes

- Add `HotelBookingService` with methods: `create()`, `cancel()`, `confirm()`, `complete()`
- Validate room availability against overlapping confirmed bookings vs `quantity_available`
- Compute `total_price` server-side: `price_per_night × nights` (Carbon `diffInDays`)
- Enforce status transitions: `pending→confirmed→completed`, or `cancelled` from `pending`/`confirmed`
- Reject overlapping bookings if available quantity would be exceeded
- Validate `check_out` is strictly after `check_in`
- Throw exceptions for invalid transitions

## Capabilities

### New Capabilities

- `hotel-booking-service`: Core booking business logic — availability validation, price computation, status machine, overlap detection

### Modified Capabilities

- `room-crud`: Room availability is now also validated by the booking service (availability check uses overlapping confirmed bookings)

## Impact

- New file: `backend/app/Services/HotelBookingService.php`
- New tests: `backend/tests/Unit/Services/HotelBookingServiceTest.php`
- Modified: `backend/app/Models/Room.php` (add `bookings()` relationship if missing)
- New migration: `backend/database/migrations/2026_07_26_000004_add_quantity_available_to_rooms_table.php` (add `quantity_available` column)
- Existing `hotel-bookings` table and model used as-is
