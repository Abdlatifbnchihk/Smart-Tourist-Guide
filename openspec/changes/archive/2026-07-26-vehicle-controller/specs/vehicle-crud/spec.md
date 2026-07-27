## Purpose

Full CRUD operations for vehicles with ownership validation. Allows drivers to manage their vehicle inventory.

## Requirements

### Requirement: List vehicles for a driver
The system SHALL return a paginated list of vehicles for a given driver via `GET /api/v1/drivers/{driverId}/vehicles`.

#### Scenario: List vehicles for existing driver
- **WHEN** GET request is made to `/api/v1/drivers/1/vehicles`
- **THEN** response returns paginated vehicles belonging to driver 1 with driver relationship

#### Scenario: List vehicles for non-existent driver
- **WHEN** GET request is made to `/api/v1/drivers/999/vehicles`
- **THEN** response returns 404 Not Found

### Requirement: Driver can create a vehicle
The system SHALL allow the driver to create a vehicle via `POST /api/v1/drivers/{driverId}/vehicles`.

#### Scenario: Owner creates vehicle successfully
- **WHEN** driver sends POST with valid data (brand, model, type, seats, registration_number, price_per_km)
- **THEN** vehicle is created under the specified driver and response returns 201 with vehicle data

#### Scenario: Non-owner cannot create vehicle
- **WHEN** a different user sends POST to create a vehicle on someone else's driver profile
- **THEN** response returns 403 Forbidden

#### Scenario: Duplicate registration number rejected
- **WHEN** driver sends POST with registration_number that already exists
- **THEN** response returns 422 with validation error

#### Scenario: Invalid vehicle type rejected
- **WHEN** driver sends POST with type not in (sedan, suv, van, minibus)
- **THEN** response returns 422 with validation error

#### Scenario: Invalid price_per_km rejected
- **WHEN** driver sends POST with price_per_km <= 0
- **THEN** response returns 422 with validation error

### Requirement: Get vehicle detail
The system SHALL return vehicle detail with driver relationship via `GET /api/v1/vehicles/{id}`.

#### Scenario: Get existing vehicle
- **WHEN** GET request is made to `/api/v1/vehicles/1`
- **THEN** response returns vehicle with driver relationship

#### Scenario: Get non-existent vehicle
- **WHEN** GET request is made to `/api/v1/vehicles/999`
- **THEN** response returns 404 Not Found

### Requirement: Driver can update a vehicle
The system SHALL only allow the vehicle's owner driver (or admin) to update via `PUT /api/v1/vehicles/{id}`.

#### Scenario: Owner updates vehicle
- **WHEN** driver who owns the vehicle sends PUT with valid data
- **THEN** vehicle is updated and response returns 200 with updated data

#### Scenario: Non-owner cannot update
- **WHEN** different user sends PUT request
- **THEN** response returns 403 Forbidden

### Requirement: Driver can delete a vehicle
The system SHALL only allow the vehicle's owner driver (or admin) to delete via `DELETE /api/v1/vehicles/{id}`.

#### Scenario: Owner deletes vehicle
- **WHEN** driver who owns the vehicle sends DELETE request
- **THEN** vehicle is deleted and response returns 200

#### Scenario: Non-owner cannot delete
- **WHEN** different user sends DELETE request
- **THEN** response returns 403 Forbidden
