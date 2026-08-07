## ADDED Requirements

### Requirement: Tourist can view booking detail for any booking type
The system SHALL display full booking details at route `/my-bookings/:id`, detecting the booking type from the API response.

#### Scenario: View hotel booking detail
- **WHEN** the tourist navigates to `/my-bookings/{id}` and the booking is a hotel booking
- **THEN** the system displays: booking number, status badge, hotel name, room number/type, dates, total price, and booking date

#### Scenario: View transport booking detail
- **WHEN** the tourist navigates to `/my-bookings/{id}` and the booking is a transport booking
- **THEN** the system displays: booking number, status badge, driver name, vehicle info, distance, booking type, dates, total price, and booking date

#### Scenario: Booking not found
- **WHEN** the tourist navigates to `/my-bookings/{id}` and the booking does not exist or belongs to another user
- **THEN** the system displays a "Booking not found" message

### Requirement: Tourist can cancel booking from detail view
The system SHALL provide cancel action on the booking detail page when the booking status allows cancellation.

#### Scenario: Cancel from detail view
- **WHEN** the tourist clicks the "Cancel Booking" button on a booking with status `Pending` or `Confirmed`
- **THEN** the system sends the appropriate cancel API call and updates the displayed status

#### Scenario: No cancel action for non-cancellable bookings
- **WHEN** the booking status is `Completed`, `Cancelled`, or `InProgress`
- **THEN** the cancel button is not displayed on the detail page
