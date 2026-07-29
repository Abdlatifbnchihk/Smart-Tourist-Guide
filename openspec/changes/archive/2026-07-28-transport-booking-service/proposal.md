## Why

The system needs transport booking functionality (airport transfers, hotel+driver combos) but currently only has hotel booking logic. Jira ticket STG-41 requires a TransportBookingService. Since the database already uses a single `bookings` table with `booking_type` discriminator and nullable `room_id`/`driver_id` FKs, we extend the existing booking infrastructure rather than creating a separate table.

## What Changes

- Add `in_progress` status to `BookingStatus` enum (transport bookings have a start→in_progress→completed flow)
- Add `price_per_km` column to `vehicles` table for fare computation
- Create `TransportBookingService` with transport-specific business logic
- Extend `HotelBookingController` (or create unified `BookingController`) to handle transport booking types
- Add transport-specific validation rules
- Add unit tests for transport booking service

## Capabilities

### New Capabilities
- `transport-booking-service`: Core transport booking business logic — price computation (price_per_km × distance_km), vehicle-driver validation, status transitions (pending→confirmed→in_progress→completed), cancellation

### Modified Capabilities
- `hotel-booking-service`: Add `in_progress` to valid status transitions (shared enum)

## Impact

- **Backend Service**: New `app/Services/TransportBookingService.php`
- **Enum**: `app/Enums/BookingStatus.php` — add `InProgress` case
- **Migration**: Add `price_per_km` to vehicles table
- **Model**: `app/Models/Vehicle.php` — add `price_per_km` to fillable
- **Controller**: Extend booking controller to handle transport types
- **Tests**: New `TransportBookingServiceTest.php`
