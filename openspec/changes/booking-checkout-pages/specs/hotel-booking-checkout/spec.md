## ADDED Requirements

### Requirement: Hotel checkout page displays room summary
The system SHALL display a summary of the selected room including hotel name, room type, price per night, and capacity on the checkout page.

#### Scenario: Page loads with room data
- **WHEN** user navigates to `/booking/hotel` with valid room data in location state
- **THEN** the page displays hotel name, room type, price per night, and room capacity

#### Scenario: No room data provided
- **WHEN** user navigates to `/booking/hotel` without room data
- **THEN** the page redirects to home or shows an error message

### Requirement: Hotel checkout page has date pickers
The system SHALL provide date input fields for check-in and check-out dates.

#### Scenario: User selects check-in date
- **WHEN** user selects a check-in date
- **THEN** the check-out date minimum is set to the day after check-in

#### Scenario: User selects check-out date before check-in
- **WHEN** user selects a check-out date that is before or equal to check-in date
- **THEN** the system shows a validation error

### Requirement: Hotel checkout page has guest count input
The system SHALL provide a numeric input for guest count.

#### Scenario: User enters guest count
- **WHEN** user enters a guest count
- **THEN** the value is captured and included in the booking submission

### Requirement: Hotel checkout page displays price calculation
The system SHALL calculate and display the total price as price_per_night multiplied by the number of nights.

#### Scenario: Price updates when dates change
- **WHEN** user changes check-in or check-out dates
- **THEN** the total price recalculates and displays as `price_per_night x nights = total`

### Requirement: Hotel checkout page submits booking
The system SHALL submit the booking to `POST /api/v1/hotel-bookings` with room_id, start_date, and end_date.

#### Scenario: Successful booking creation
- **WHEN** user clicks "Confirm Booking" with valid data
- **THEN** the system calls the API and displays a success message with booking number

#### Scenario: Booking creation fails
- **WHEN** the API returns an error (e.g., room no longer available)
- **THEN** the system displays the error message to the user

### Requirement: Hotel checkout page requires authentication
The system SHALL require user authentication to access the hotel checkout page.

#### Scenario: Unauthenticated user redirected to login
- **WHEN** unauthenticated user navigates to `/booking/hotel`
- **THEN** the system redirects to `/login` page
