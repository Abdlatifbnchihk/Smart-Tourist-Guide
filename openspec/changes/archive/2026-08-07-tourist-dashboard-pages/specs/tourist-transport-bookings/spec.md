## ADDED Requirements

### Requirement: Tourist can view their transport bookings list
The system SHALL display a paginated list of the authenticated tourist's transport bookings at route `/my-bookings/transport`.

#### Scenario: Successful booking list load
- **WHEN** a logged-in tourist navigates to `/my-bookings/transport`
- **THEN** the system fetches `GET /api/v1/transport-bookings` and displays a table with columns: Booking #, Driver Name, Vehicle, Dates (start to end), Status badge, Total Price

#### Scenario: Empty booking list
- **WHEN** a logged-in tourist navigates to `/my-bookings/transport` and has no transport bookings
- **THEN** the system displays an empty state message "No transport bookings found"

#### Scenario: Loading state
- **WHEN** transport bookings are being fetched from the API
- **THEN** the system displays skeleton loading placeholders

### Requirement: Tourist can cancel a transport booking
The system SHALL allow the tourist to cancel a transport booking that is in `Pending` or `Confirmed` status.

#### Scenario: Cancel pending booking
- **WHEN** the tourist clicks the "Cancel" button on a booking with status `Pending`
- **THEN** the system sends `PATCH /api/v1/transport-bookings/{id}/cancel` and refreshes the list
- **AND** the booking status updates to `Cancelled`

#### Scenario: Cancel confirmed booking
- **WHEN** the tourist clicks the "Cancel" button on a booking with status `Confirmed`
- **THEN** the system sends `PATCH /api/v1/transport-bookings/{id}/cancel` and refreshes the list
- **AND** the booking status updates to `Cancelled`

#### Scenario: Cannot cancel completed booking
- **WHEN** the tourist views a booking with status `Completed`, `InProgress`, or `Cancelled`
- **THEN** the cancel button is not displayed

### Requirement: Tourist can navigate to booking detail
The system SHALL allow the tourist to click on a transport booking to view its full detail at `/my-bookings/{id}`.

#### Scenario: Navigate to detail
- **WHEN** the tourist clicks on a booking row or a "View" button
- **THEN** the system navigates to `/my-bookings/{id}` with the booking detail view
