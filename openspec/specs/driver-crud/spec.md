## Purpose

Full CRUD operations for driver profiles with role-based access control and admin verification.

## Requirements

### Requirement: List drivers with filters
The system SHALL return a paginated list of drivers via `GET /api/v1/drivers` with optional city and verification filters.

#### Scenario: List all drivers
- **WHEN** GET request is made to `/api/v1/drivers`
- **THEN** response returns paginated drivers with user and city data

#### Scenario: Filter by city
- **WHEN** GET request is made to `/api/v1/drivers?city_id=1`
- **THEN** response returns only drivers in that city

#### Scenario: Filter by verified only
- **WHEN** GET request is made to `/api/v1/drivers?verified=1`
- **THEN** response returns only drivers where is_verified is true

### Requirement: Driver creates own profile
The system SHALL allow users with `driver` role to create a driver profile via `POST /api/v1/drivers`.

#### Scenario: Driver creates profile successfully
- **WHEN** driver sends POST with valid data (city_id, license_number)
- **THEN** profile is created and response returns 201 with driver data

#### Scenario: Non-driver cannot create profile
- **WHEN** user with non-driver role sends POST
- **THEN** response returns 403 Forbidden

#### Scenario: Duplicate license number rejected
- **WHEN** driver sends POST with license_number that already exists
- **THEN** response returns 422 with validation error

#### Scenario: Duplicate user profile rejected
- **WHEN** driver sends POST and already has a driver profile
- **THEN** response returns 422 with validation error

### Requirement: Get driver detail
The system SHALL return driver detail with user, city, vehicles, and reviews via `GET /api/v1/drivers/{id}`.

#### Scenario: Get existing driver
- **WHEN** GET request is made to `/api/v1/drivers/1`
- **THEN** response returns driver with user, city, vehicles, and reviews

#### Scenario: Get non-existent driver
- **WHEN** GET request is made to `/api/v1/drivers/999`
- **THEN** response returns 404 Not Found

### Requirement: Driver edits own profile
The system SHALL only allow the driver (or admin) to update their profile via `PUT /api/v1/drivers/{id}`.

#### Scenario: Owner updates profile
- **WHEN** driver who owns the profile sends PUT with valid data
- **THEN** profile is updated and response returns 200 with updated data

#### Scenario: Non-owner cannot update
- **WHEN** different user sends PUT request
- **THEN** response returns 403 Forbidden

### Requirement: Admin toggles verification
The system SHALL only allow administrators to toggle `is_verified` via `PATCH /api/v1/drivers/{id}/verify`.

#### Scenario: Admin toggles verification
- **WHEN** admin sends PATCH request
- **THEN** is_verified is toggled and response returns 200 with updated driver

#### Scenario: Non-admin cannot verify
- **WHEN** non-admin user sends PATCH request
- **THEN** response returns 403 Forbidden
