## Why

The API route `driver/transport-bookings` is registered in `routes/api.php:137` referencing `App\Http\Controllers\Driver\BookingController`, but the controller class does not exist. The Driver namespace directory is also missing. Driver Dashboard pages (E4, E5) depend on this endpoint for drivers to view and manage their assigned transport bookings.

## What Changes

- **New** `app/Http/Controllers/Driver/BookingController.php` with methods: `index`, `show`, `updateStatus`.
- All methods enforce assignment scoping — a driver can only access bookings where `driver_id` references a Driver record linked to the authenticated user.
- Status transition validation enforces a finite state machine: Pending→Confirmed/Cancelled, Confirmed→InProgress/Cancelled, InProgress→Completed.
- `updateStatus` replaces a generic `update` to ensure only status changes are permitted through this endpoint.

## Capabilities

### New Capabilities
- `driver-transport-booking-management`: Driver-facing endpoints for listing, viewing, and updating status of transport bookings assigned to them, with status transition validation.

### Modified Capabilities

(none)

## Impact

- **New file**: `app/Http/Controllers/Driver/BookingController.php`
- **New directory**: `app/Http/Controllers/Driver/`
- **Existing dependencies reused**: `Booking` model (with `driver_id` relation), `Driver` model (with `user_id` relation), `BookingStatus` enum
- **No new packages or migrations required**
