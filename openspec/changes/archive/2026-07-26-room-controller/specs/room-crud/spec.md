## Purpose

Full CRUD operations for hotel rooms with ownership validation. Allows hotel owners to manage room inventory for their hotels.

## Requirements

### Requirement: List rooms for a hotel
The system SHALL return a paginated list of rooms for a given hotel via `GET /api/v1/hotels/{hotelId}/rooms`.

#### Scenario: List rooms for existing hotel
- **WHEN** GET request is made to `/api/v1/hotels/1/rooms`
- **THEN** response returns paginated rooms belonging to hotel 1 with hotel relationship

#### Scenario: List rooms for non-existent hotel
- **WHEN** GET request is made to `/api/v1/hotels/999/rooms`
- **THEN** response returns 404 Not Found

### Requirement: Hotel owner can create a room
The system SHALL allow the hotel owner to create a room via `POST /api/v1/hotels/{hotelId}/rooms`.

#### Scenario: Owner creates room successfully
- **WHEN** hotel owner sends POST with valid data (number, type, capacity, price_per_night)
- **THEN** room is created under the specified hotel and response returns 201 with room data

#### Scenario: Non-owner cannot create room
- **WHEN** a different user sends POST to create a room on someone else's hotel
- **THEN** response returns 403 Forbidden

#### Scenario: Admin can create room
- **WHEN** administrator sends POST with valid data
- **THEN** room is created and response returns 201

#### Scenario: Validation fails
- **WHEN** owner sends POST with missing required fields or invalid price_per_night (<= 0)
- **THEN** response returns 422 with validation errors

### Requirement: Get room detail
The system SHALL return room detail with hotel relationship via `GET /api/v1/rooms/{id}`.

#### Scenario: Get existing room
- **WHEN** GET request is made to `/api/v1/rooms/1`
- **THEN** response returns room with hotel relationship and availability info

#### Scenario: Get non-existent room
- **WHEN** GET request is made to `/api/v1/rooms/999`
- **THEN** response returns 404 Not Found

### Requirement: Hotel owner can update a room
The system SHALL only allow the hotel owner (or admin) to update a room via `PUT /api/v1/rooms/{id}`.

#### Scenario: Owner updates room
- **WHEN** hotel owner who owns the parent hotel sends PUT with valid data
- **THEN** room is updated and response returns 200 with updated room data

#### Scenario: Non-owner cannot update
- **WHEN** different user sends PUT request
- **THEN** response returns 403 Forbidden

### Requirement: Hotel owner can soft delete a room
The system SHALL only allow the hotel owner (or admin) to soft delete a room via `DELETE /api/v1/rooms/{id}`.

#### Scenario: Owner deletes room
- **WHEN** hotel owner who owns the parent hotel sends DELETE request
- **THEN** room is soft deleted (deleted_at set) and response returns 200

#### Scenario: Non-owner cannot delete
- **WHEN** different user sends DELETE request
- **THEN** response returns 403 Forbidden

#### Scenario: Soft deleted room excluded from listings
- **WHEN** rooms are listed after soft delete
- **THEN** the deleted room does not appear in results
