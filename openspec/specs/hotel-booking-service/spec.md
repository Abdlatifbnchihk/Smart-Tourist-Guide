## Purpose

Core booking business logic — availability validation, price computation, status machine, overlap detection.

## Requirements

### Requirement: Create a booking with availability validation
The system SHALL validate room availability before creating a booking. The system SHALL reject overlapping bookings if the number of confirmed bookings for the room during the requested period would exceed `quantity_available`.

#### Scenario: Create booking when room is available
- **WHEN** a user requests a booking for a room with no overlapping confirmed bookings
- **THEN** the booking is created with status `pending` and `total_price` computed as `price_per_night × nights`

#### Scenario: Create booking when room is unavailable
- **WHEN** a user requests a booking for a room where overlapping confirmed bookings would exceed `quantity_available`
- **THEN** the system throws an exception with message "Room is not available for the selected dates"

#### Scenario: Reject overlapping bookings at exact boundaries
- **WHEN** a user requests a booking where `check_in` equals an existing booking's `check_out` or `check_out` equals an existing booking's `check_in`
- **THEN** the booking is allowed (no overlap at exact boundaries)

### Requirement: Compute total price server-side
The system SHALL compute `total_price` as `price_per_night × number_of_nights` using Carbon `diffInDays`. The system SHALL NOT accept client-provided `total_price`.

#### Scenario: Price computed correctly
- **WHEN** a booking is created for a room with `price_per_night` of 100 and dates spanning 3 nights
- **THEN** `total_price` is 300

#### Scenario: Client-provided total_price is ignored
- **WHEN** a user includes `total_price` in the booking request
- **THEN** the system ignores it and computes the correct value server-side

### Requirement: Validate check_out is after check_in
The system SHALL reject bookings where `check_out` is not strictly after `check_in`.

#### Scenario: Valid date range
- **WHEN** `check_in` is 2026-08-01 and `check_out` is 2026-08-03
- **THEN** booking proceeds with availability validation

#### Scenario: Invalid date range
- **WHEN** `check_in` is 2026-08-03 and `check_out` is 2026-08-01
- **THEN** the system throws an exception with message "Check-out date must be after check-in date"

#### Scenario: Same-day booking rejected
- **WHEN** `check_in` equals `check_out`
- **THEN** the system throws an exception with message "Check-out date must be after check-in date"

### Requirement: Enforce status transitions
The system SHALL enforce valid status transitions: `pending→confirmed→completed`, or `cancelled` from `pending` or `confirmed`. Completed and cancelled bookings cannot be transitioned.

#### Scenario: Confirm a pending booking
- **WHEN** a pending booking is confirmed
- **THEN** the booking status changes to `confirmed`

#### Scenario: Complete a confirmed booking
- **WHEN** a confirmed booking is completed
- **THEN** the booking status changes to `completed`

#### Scenario: Cancel a pending booking
- **WHEN** a pending booking is cancelled
- **THEN** the booking status changes to `cancelled`

#### Scenario: Cancel a confirmed booking
- **WHEN** a confirmed booking is cancelled
- **THEN** the booking status changes to `cancelled`

#### Scenario: Cannot confirm a completed booking
- **WHEN** a completed booking is confirmed
- **THEN** the system throws a RuntimeException with message "Cannot transition from completed to confirmed"

#### Scenario: Cannot cancel a completed booking
- **WHEN** a completed booking is cancelled
- **THEN** the system throws a RuntimeException with message "Cannot transition from completed to cancelled"

#### Scenario: Cannot transition a cancelled booking
- **WHEN** a cancelled booking is confirmed or completed
- **THEN** the system throws a RuntimeException with message "Cannot transition from cancelled"
