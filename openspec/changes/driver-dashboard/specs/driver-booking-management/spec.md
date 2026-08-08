## ADDED Requirements

### Requirement: Assigned Bookings List
The system SHALL display transport bookings assigned to the driver at `/driver/bookings`.

#### Scenario: Bookings load successfully
- **WHEN** driver navigates to `/driver/bookings`
- **THEN** system fetches `GET /api/v1/driver/transport-bookings` and displays bookings in a table

#### Scenario: Booking table columns
- **WHEN** booking list is displayed
- **THEN** table shows: Booking Number, Guest, Route (start/end dates), Status, Actions (View)

#### Scenario: Filter by status
- **WHEN** driver selects a status filter
- **THEN** system filters bookings client-side by the selected status

#### Scenario: Empty bookings list
- **WHEN** driver has no assigned bookings
- **THEN** system displays "No bookings found" message

### Requirement: Booking Detail Page
The system SHALL display full booking details at `/driver/bookings/:id`.

#### Scenario: Booking detail loads
- **WHEN** driver navigates to `/driver/bookings/:id`
- **THEN** system fetches `GET /api/v1/driver/transport-bookings/{booking}` and displays full booking details

#### Scenario: Booking detail shows guest info
- **WHEN** booking detail is displayed
- **THEN** system shows: guest name, phone, booking number, status, start date, end date, total price

#### Scenario: Booking detail shows status actions
- **WHEN** booking is in a state that allows transitions
- **THEN** system displays appropriate action buttons based on current status

### Requirement: Update Booking Status
The system SHALL allow drivers to update booking status following valid transitions.

#### Scenario: Confirm a pending booking
- **WHEN** booking status is "Pending" and driver clicks "Confirm"
- **THEN** system sends `PUT /api/v1/driver/transport-bookings/{booking}` with `status: "Confirmed"`

#### Scenario: Start an in-progress trip
- **WHEN** booking status is "Confirmed" and driver clicks "Start Trip"
- **THEN** system sends `PUT /api/v1/driver/transport-bookings/{booking}` with `status: "InProgress"`

#### Scenario: Complete a trip
- **WHEN** booking status is "InProgress" and driver clicks "Complete"
- **THEN** system sends `PUT /api/v1/driver/transport-bookings/{booking}` with `status: "Completed"`

#### Scenario: Cancel a booking
- **WHEN** booking status is "Pending" or "Confirmed" and driver clicks "Cancel"
- **THEN** system displays confirmation modal, then sends `PUT /api/v1/driver/transport-bookings/{booking}` with `status: "Cancelled"`

#### Scenario: Invalid status transition
- **WHEN** driver attempts an invalid status transition
- **THEN** system displays error message from backend
