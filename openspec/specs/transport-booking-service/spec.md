## Purpose

Transport booking business logic for airport transfers and hotel+driver combo bookings. Handles vehicle-driver validation, distance-based price computation, and transport-specific status transitions (Pending → Confirmed → InProgress → Completed).

## Requirements

### Requirement: Create a transport booking with vehicle-driver validation
The system SHALL validate that the selected vehicle belongs to the selected driver before creating a transport booking. The system SHALL compute total_price as price_per_km x distance_km.

#### Scenario: Create airport transfer booking successfully
- **WHEN** a user requests an airport transfer with a valid vehicle_id and driver_id where the vehicle belongs to the driver
- **THEN** the booking is created with status `Pending`, `booking_type` = `Airport Transfer`, and `total_price` computed as `vehicle.price_per_night x distance_km`

#### Scenario: Create hotel+driver booking successfully
- **WHEN** a user requests a hotel+driver booking with valid room_id, vehicle_id, and driver_id
- **THEN** the booking is created with status `Pending`, `booking_type` = `Hotel + Driver`, and `total_price` computed as `(room.price_per_night x nights) + (vehicle.price_per_km x distance_km)`

#### Scenario: Reject booking with mismatched vehicle and driver
- **WHEN** a user requests a transport booking where the vehicle does not belong to the specified driver
- **THEN** the system throws an exception with message "Vehicle does not belong to this driver"

#### Scenario: Reject booking with non-existent vehicle
- **WHEN** a user requests a transport booking with a vehicle_id that does not exist
- **THEN** the system throws a ModelNotFoundException

### Requirement: Compute transport price server-side
The system SHALL compute `total_price` for transport bookings as `price_per_km x distance_km` using the vehicle's `price_per_km` value. The system SHALL NOT accept client-provided `total_price`.

#### Scenario: Transport price computed correctly
- **WHEN** a transport booking is created for a vehicle with `price_per_km` of 10 and `distance_km` of 50
- **THEN** `total_price` is 500

#### Scenario: Client-provided total_price is ignored for transport
- **WHEN** a user includes `total_price` in a transport booking request
- **THEN** the system ignores it and computes the correct value server-side

### Requirement: Enforce transport status transitions
The system SHALL enforce valid status transitions for transport bookings: `Pending->Confirmed->InProgress->Completed`, or `Cancelled` from `Pending` or `Confirmed`. Completed and Cancelled bookings cannot be transitioned.

#### Scenario: Confirm a pending transport booking
- **WHEN** a pending transport booking is confirmed
- **THEN** the booking status changes to `Confirmed`

#### Scenario: Start a confirmed transport booking
- **WHEN** a confirmed transport booking is started
- **THEN** the booking status changes to `InProgress`

#### Scenario: Complete an in-progress transport booking
- **WHEN** an in-progress transport booking is completed
- **THEN** the booking status changes to `Completed`

#### Scenario: Cancel a pending transport booking
- **WHEN** a pending transport booking is cancelled
- **THEN** the booking status changes to `Cancelled`

#### Scenario: Cancel a confirmed transport booking
- **WHEN** a confirmed transport booking is cancelled
- **THEN** the booking status changes to `Cancelled`

#### Scenario: Cannot confirm a completed transport booking
- **WHEN** a completed transport booking is confirmed
- **THEN** the system throws a RuntimeException with message "Cannot transition from Completed to Confirmed"

#### Scenario: Cannot start a pending transport booking
- **WHEN** a pending transport booking is started
- **THEN** the system throws a RuntimeException with message "Cannot transition from Pending to InProgress"

#### Scenario: Cannot transition a cancelled transport booking
- **WHEN** a cancelled transport booking is confirmed, started, or completed
- **THEN** the system throws a RuntimeException with message "Cannot transition from Cancelled"

### Requirement: Validate distance is positive
The system SHALL reject transport bookings where `distance_km` is not a positive number.

#### Scenario: Valid distance
- **WHEN** `distance_km` is 50
- **THEN** booking proceeds with price computation

#### Scenario: Zero distance rejected
- **WHEN** `distance_km` is 0
- **THEN** the system throws an exception with message "Distance must be greater than zero"

#### Scenario: Negative distance rejected
- **WHEN** `distance_km` is -10
- **THEN** the system throws an exception with message "Distance must be greater than zero"
