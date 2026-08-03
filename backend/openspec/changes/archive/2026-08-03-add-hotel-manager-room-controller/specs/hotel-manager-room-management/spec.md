## ADDED Requirements

### Requirement: List rooms for own hotels
The system SHALL return a paginated list of rooms belonging only to hotels created by the authenticated hotel manager.

#### Scenario: Manager retrieves room list
- **WHEN** a hotel manager sends GET `/api/hotel-manager/manage-rooms`
- **THEN** the system returns a paginated `RoomResource` collection containing only rooms where `hotel.created_by` equals the authenticated user's ID

#### Scenario: Empty hotel list
- **WHEN** a hotel manager with no hotels sends GET `/api/hotel-manager/manage-rooms`
- **THEN** the system returns an empty paginated collection

### Requirement: Create room under own hotel
The system SHALL allow a hotel manager to create a new room under a hotel they own.

#### Scenario: Successful room creation
- **WHEN** a hotel manager sends POST `/api/hotel-manager/manage-rooms` with valid fields (`hotel_id`, `number`, `type`, `capacity`, `price_per_night`, `available`) where `hotel_id` references a hotel they created
- **THEN** the system creates the room and returns a `RoomResource` with HTTP 201

#### Scenario: Attempt to create room under another manager's hotel
- **WHEN** a hotel manager sends POST `/api/hotel-manager/manage-rooms` with a `hotel_id` referencing a hotel they do not own
- **THEN** the system returns HTTP 403 with an authorization error message

#### Scenario: Duplicate room number in same hotel
- **WHEN** a hotel manager sends POST `/api/hotel-manager/manage-rooms` with a `number` that already exists for the specified `hotel_id`
- **THEN** the system returns HTTP 422 with a validation error indicating the room number is taken

### Requirement: View room details
The system SHALL allow a hotel manager to view details of a room belonging to one of their hotels.

#### Scenario: Manager views own room
- **WHEN** a hotel manager sends GET `/api/hotel-manager/manage-rooms/{room}` where the room's hotel was created by the authenticated user
- **THEN** the system returns a `RoomResource` with full room details

#### Scenario: Attempt to view room under another hotel
- **WHEN** a hotel manager sends GET `/api/hotel-manager/manage-rooms/{room}` where the room's hotel was NOT created by the authenticated user
- **THEN** the system returns HTTP 403

### Requirement: Update room
The system SHALL allow a hotel manager to update a room belonging to one of their hotels.

#### Scenario: Successful room update
- **WHEN** a hotel manager sends PUT/PATCH `/api/hotel-manager/manage-rooms/{room}` where the room's hotel was created by the authenticated user, with valid update fields
- **THEN** the system updates the room and returns the updated `RoomResource`

#### Scenario: Attempt to update room under another hotel
- **WHEN** a hotel manager sends PUT/PATCH `/api/hotel-manager/manage-rooms/{room}` where the room's hotel was NOT created by the authenticated user
- **THEN** the system returns HTTP 403

#### Scenario: Duplicate room number on update
- **WHEN** a hotel manager updates a room's `number` to a value that already exists in the same hotel
- **THEN** the system returns HTTP 422 with a validation error

### Requirement: Soft delete room
The system SHALL allow a hotel manager to soft-delete a room belonging to one of their hotels.

#### Scenario: Successful soft delete
- **WHEN** a hotel manager sends DELETE `/api/hotel-manager/manage-rooms/{room}` where the room's hotel was created by the authenticated user
- **THEN** the system soft-deletes the room (sets `deleted_at` timestamp) and returns a success message

#### Scenario: Attempt to soft delete room under another hotel
- **WHEN** a hotel manager sends DELETE `/api/hotel-manager/manage-rooms/{room}` where the room's hotel was NOT created by the authenticated user
- **THEN** the system returns HTTP 403

### Requirement: Restore soft-deleted room
The system SHALL allow a hotel manager to restore a previously soft-deleted room belonging to one of their hotels.

#### Scenario: Successful restore
- **WHEN** a hotel manager sends POST `/api/hotel-manager/manage-rooms/{room}/restore` where the room's hotel was created by the authenticated user and the room is soft-deleted
- **THEN** the system clears `deleted_at` and returns the restored `RoomResource`

#### Scenario: Attempt to restore room under another hotel
- **WHEN** a hotel manager sends POST `/api/hotel-manager/manage-rooms/{room}/restore` where the room's hotel was NOT created by the authenticated user
- **THEN** the system returns HTTP 403

### Requirement: Permanently delete room
The system SHALL allow a hotel manager to permanently delete a soft-deleted room belonging to one of their hotels.

#### Scenario: Successful permanent delete
- **WHEN** a hotel manager sends DELETE `/api/hotel-manager/manage-rooms/{room}/force-delete` where the room's hotel was created by the authenticated user and the room is soft-deleted
- **THEN** the system permanently removes the room record from the database and returns a success message

#### Scenario: Attempt to permanently delete room under another hotel
- **WHEN** a hotel manager sends DELETE `/api/hotel-manager/manage-rooms/{room}/force-delete` where the room's hotel was NOT created by the authenticated user
- **THEN** the system returns HTTP 403

### Requirement: Room number uniqueness per hotel
The system SHALL enforce that room numbers are unique within a single hotel but may be duplicated across different hotels.

#### Scenario: Same number in different hotels
- **WHEN** two hotels both have a room with number "101"
- **THEN** the system permits both rooms to exist without conflict

#### Scenario: Duplicate number in same hotel
- **WHEN** a hotel already has a room with number "101" and a manager attempts to create another room with number "101" in the same hotel
- **THEN** the system rejects the request with a validation error
