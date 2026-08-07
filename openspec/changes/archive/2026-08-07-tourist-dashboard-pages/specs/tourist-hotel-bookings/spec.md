## ADDED Requirements

### Requirement: Tourist can view their hotel bookings list
The system SHALL display a paginated list of the authenticated tourist's hotel bookings at route `/my-bookings/hotel`.

#### Scenario: Successful booking list load
- **WHEN** a logged-in tourist navigates to `/my-bookings/hotel`
- **THEN** the system fetches `GET /api/v1/hotel-bookings` and displays a table with columns: Booking #, Hotel Name, Room, Dates (start to end), Status badge, Total Price

#### Scenario: Empty booking list
- **WHEN** a logged-in tourist navigates to `/my-bookings/hotel` and has no hotel bookings
- **THEN** the system displays an empty state message "No hotel bookings found"

#### Scenario: Loading state
- **WHEN** hotel bookings are being fetched from the API
- **THEN** the system displays skeleton loading placeholders

### Requirement: Tourist can cancel a hotel booking
The system SHALL allow the tourist to cancel a hotel booking that is in `Pending` or `Confirmed` status.

#### Scenario: Cancel pending booking
- **WHEN** the tourist clicks the "Cancel" button on a booking with status `Pending`
- **THEN** the system sends `PATCH /api/v1/hotel-bookings/{id}/cancel` and refreshes the list
- **AND** the booking status updates to `Cancelled`

#### Scenario: Cancel confirmed booking
- **WHEN** the tourist clicks the "Cancel" button on a booking with status `Confirmed`
- **THEN** the system sends `PATCH /api/v1/hotel-bookings/{id}/cancel` and refreshes the list
- **AND** the booking status updates to `Cancelled`

#### Scenario: Cannot cancel completed booking
- **WHEN** the tourist views a booking with status `Completed` or `Cancelled`
- **THEN** the cancel button is not displayed

### Requirement: Tourist can navigate to booking detail
The system SHALL allow the tourist to click on a booking to view its full detail at `/my-bookings/{id}`.

#### Scenario: Navigate to detail
- **WHEN** the tourist clicks on a booking row or a "View" button
- **THEN** the system navigates to `/my-bookings/{id}` with the booking detail view
