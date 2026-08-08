## ADDED Requirements

### Requirement: Vehicle List Page
The system SHALL display a list of the driver's vehicles at `/driver/vehicles`.

#### Scenario: Vehicles load successfully
- **WHEN** driver navigates to `/driver/vehicles`
- **THEN** system fetches `GET /api/v1/drivers/{driverId}/vehicles` and displays all vehicles in a table

#### Scenario: Vehicle table columns
- **WHEN** vehicle list is displayed
- **THEN** table shows: Brand/Model, Type, Seats, Registration Number, Air Conditioning, Price/km, Actions (Edit, Delete)

#### Scenario: Empty vehicle list
- **WHEN** driver has no vehicles
- **THEN** system displays "No vehicles found" message with Add New Vehicle button

### Requirement: Create Vehicle
The system SHALL allow drivers to create a new vehicle via a form.

#### Scenario: Open create form
- **WHEN** driver clicks "Add New Vehicle" button
- **THEN** system displays a modal with fields: Brand, Model, Type (select), Seats, Registration Number, Air Conditioning (toggle), Price per km

#### Scenario: Submit valid vehicle
- **WHEN** driver submits the form with valid data
- **THEN** system sends `POST /api/v1/drivers/{driverId}/vehicles` and refreshes the vehicle list

#### Scenario: Validation errors
- **WHEN** driver submits form with missing required fields
- **THEN** system displays validation errors under each invalid field

### Requirement: Edit Vehicle
The system SHALL allow drivers to edit an existing vehicle.

#### Scenario: Open edit form
- **WHEN** driver clicks "Edit" on a vehicle row
- **THEN** system displays a modal pre-filled with the vehicle's current data

#### Scenario: Submit updated vehicle
- **WHEN** driver submits the edit form
- **THEN** system sends `PUT /api/v1/vehicles/{id}` and refreshes the vehicle list

### Requirement: Delete Vehicle
The system SHALL allow drivers to delete a vehicle with confirmation.

#### Scenario: Confirm deletion
- **WHEN** driver clicks "Delete" on a vehicle row
- **THEN** system displays a confirmation modal asking "Are you sure?"

#### Scenario: Execute deletion
- **WHEN** driver confirms deletion
- **THEN** system sends `DELETE /api/v1/vehicles/{id}` and removes the vehicle from the list
