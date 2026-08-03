## ADDED Requirements

### Requirement: List assigned transport bookings
The system SHALL return a list of transport bookings assigned to the authenticated driver.

#### Scenario: Driver retrieves booking list
- **WHEN** a driver sends GET `/api/driver/transport-bookings`
- **THEN** the system returns bookings where `driver_id` references a Driver whose `user_id` equals the authenticated user's ID

#### Scenario: Driver with no assigned bookings
- **WHEN** a driver with no assigned bookings sends GET `/api/driver/transport-bookings`
- **THEN** the system returns an empty list

### Requirement: View assigned booking details
The system SHALL allow a driver to view details of a booking assigned to them.

#### Scenario: Driver views own booking
- **WHEN** a driver sends GET `/api/driver/transport-bookings/{booking}` where the booking's `driver_id` references a Driver whose `user_id` equals the authenticated user's ID
- **THEN** the system returns the full booking details

#### Scenario: Attempt to view unassigned booking
- **WHEN** a driver sends GET `/api/driver/transport-bookings/{booking}` where the booking is NOT assigned to them
- **THEN** the system returns HTTP 403

### Requirement: Update booking status with valid transitions
The system SHALL allow a driver to update the status of an assigned booking, enforcing valid status transitions.

#### Scenario: Driver confirms a pending booking
- **WHEN** a driver sends PATCH `/api/driver/transport-bookings/{booking}/status` with `status: "Confirmed"` where the booking is assigned to them and current status is `Pending`
- **THEN** the system updates the status to `Confirmed` and returns the updated booking

#### Scenario: Driver cancels a pending booking
- **WHEN** a driver sends PATCH `/api/driver/transport-bookings/{booking}/status` with `status: "Cancelled"` where the booking is assigned to them and current status is `Pending`
- **THEN** the system updates the status to `Cancelled` and returns the updated booking

#### Scenario: Driver starts a confirmed booking
- **WHEN** a driver sends PATCH `/api/driver/transport-bookings/{booking}/status` with `status: "InProgress"` where the booking is assigned to them and current status is `Confirmed`
- **THEN** the system updates the status to `InProgress` and returns the updated booking

#### Scenario: Driver cancels a confirmed booking
- **WHEN** a driver sends PATCH `/api/driver/transport-bookings/{booking}/status` with `status: "Cancelled"` where the booking is assigned to them and current status is `Confirmed`
- **THEN** the system updates the status to `Cancelled` and returns the updated booking

#### Scenario: Driver completes an in-progress booking
- **WHEN** a driver sends PATCH `/api/driver/transport-bookings/{booking}/status` with `status: "Completed"` where the booking is assigned to them and current status is `InProgress`
- **THEN** the system updates the status to `Completed` and returns the updated booking

#### Scenario: Invalid status transition rejected
- **WHEN** a driver sends PATCH `/api/driver/transport-bookings/{booking}/status` with a status that is not a valid next state from the current status
- **THEN** the system returns HTTP 422 with a validation error listing the allowed next states

#### Scenario: Attempt to update status of unassigned booking
- **WHEN** a driver sends PATCH `/api/driver/transport-bookings/{booking}/status` where the booking is NOT assigned to them
- **THEN** the system returns HTTP 403

### Requirement: Status transition rules
The system SHALL enforce the following valid status transitions:

#### Scenario: Pending allows Confirmed or Cancelled
- **WHEN** a booking has status `Pending`
- **THEN** the only valid next statuses are `Confirmed` and `Cancelled`

#### Scenario: Confirmed allows InProgress or Cancelled
- **WHEN** a booking has status `Confirmed`
- **THEN** the only valid next statuses are `InProgress` and `Cancelled`

#### Scenario: InProgress allows Completed
- **WHEN** a booking has status `InProgress`
- **THEN** the only valid next status is `Completed`

#### Scenario: Cancelled and Completed are terminal
- **WHEN** a booking has status `Cancelled` or `Completed`
- **THEN** no status transitions are allowed
