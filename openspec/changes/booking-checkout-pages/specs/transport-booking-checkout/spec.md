## ADDED Requirements

### Requirement: Transport checkout page displays driver/vehicle list
The system SHALL fetch and display a list of available drivers with their vehicles for selection.

#### Scenario: Page loads with driver list
- **WHEN** user navigates to `/booking/transport`
- **THEN** the page fetches drivers from `GET /api/v1/drivers` and displays name, rating, vehicle brand/model, and price per km

#### Scenario: User selects a driver/vehicle
- **WHEN** user clicks on a driver/vehicle card
- **THEN** the selection is highlighted and the vehicle_id and driver_id are captured

### Requirement: Transport checkout page has distance input
The system SHALL provide a numeric input for distance in kilometers.

#### Scenario: User enters distance
- **WHEN** user enters a distance value in km
- **THEN** the price estimate updates as `price_per_km x distance`

### Requirement: Transport checkout page has date pickers
The system SHALL provide date input fields for pickup and dropoff dates.

#### Scenario: User selects dates
- **WHEN** user selects pickup and dropoff dates
- **THEN** the dates are captured and included in the booking submission

### Requirement: Transport checkout page has booking type selector
The system SHALL provide a selector for booking type with options: "Hotel + Driver" and "Airport Transfer".

#### Scenario: User selects booking type
- **WHEN** user selects a booking type
- **THEN** the selection is captured and included in the booking submission

### Requirement: Transport checkout page displays price estimate
The system SHALL calculate and display the price estimate as price_per_km multiplied by distance.

#### Scenario: Price updates when distance changes
- **WHEN** user changes the distance or selects a different vehicle
- **THEN** the price estimate recalculates and displays as `price_per_km x distance = total`

### Requirement: Transport checkout page submits booking
The system SHALL submit the booking to `POST /api/v1/transport-bookings` with vehicle_id, driver_id, distance_km, booking_type, start_date, and end_date.

#### Scenario: Successful booking creation
- **WHEN** user clicks "Confirm Booking" with valid data
- **THEN** the system calls the API and displays a success message with booking number

#### Scenario: Booking creation fails
- **WHEN** the API returns an error
- **THEN** the system displays the error message to the user

### Requirement: Transport checkout page requires authentication
The system SHALL require user authentication to access the transport checkout page.

#### Scenario: Unauthenticated user redirected to login
- **WHEN** unauthenticated user navigates to `/booking/transport`
- **THEN** the system redirects to `/login` page
