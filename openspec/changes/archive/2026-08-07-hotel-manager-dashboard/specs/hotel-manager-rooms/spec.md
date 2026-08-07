## ADDED Requirements

### Requirement: List rooms for a hotel
The system SHALL display a list of all rooms for a specific hotel at `/hotel-manager/hotels/:id/rooms`.

#### Scenario: View rooms list
- **WHEN** hotel manager navigates to `/hotel-manager/hotels/:id/rooms`
- **THEN** system displays a table/list of rooms with columns: room number, type, capacity, price per night, quantity available, availability status, and action buttons

#### Scenario: Empty rooms list
- **WHEN** hotel has no rooms
- **THEN** system displays a message indicating no rooms exist with a link to add one

#### Scenario: Show deleted rooms
- **WHEN** hotel manager views rooms list
- **THEN** system shows soft-deleted rooms with a visual indicator (e.g., strikethrough, grayed out) and restore option

### Requirement: Add new room
The system SHALL provide a form to create a new room at `/hotel-manager/rooms/new`.

#### Scenario: Navigate to create room form
- **WHEN** hotel manager clicks "Add Room" button on rooms list
- **THEN** system navigates to `/hotel-manager/rooms/new` with hotel ID pre-selected

#### Scenario: Submit valid room form
- **WHEN** hotel manager fills in all required fields (number, type, capacity, price_per_night, quantity_available, available) and clicks "Save"
- **THEN** system sends POST request to `/api/v1/hotel-manager/manage-rooms` and redirects to rooms list on success

#### Scenario: Submit invalid room form
- **WHEN** hotel manager submits form with missing required fields
- **THEN** system displays validation errors for each missing field

### Requirement: Edit existing room
The system SHALL provide a form to edit an existing room at `/hotel-manager/rooms/:id/edit`.

#### Scenario: Navigate to edit room form
- **WHEN** hotel manager clicks "Edit" button on a room in the list
- **THEN** system navigates to `/hotel-manager/rooms/:id/edit` with form pre-populated with room data

#### Scenario: Update room
- **WHEN** hotel manager modifies room fields and clicks "Update"
- **THEN** system sends PUT request to `/api/v1/hotel-manager/manage-rooms` with room ID and updated data

#### Scenario: Cancel room edit
- **WHEN** hotel manager clicks "Cancel" while editing
- **THEN** system navigates back to rooms list without saving changes

### Requirement: Soft-delete room
The system SHALL allow hotel managers to soft-delete rooms, marking them as deleted without removing from database.

#### Scenario: Delete room
- **WHEN** hotel manager clicks "Delete" button on a room
- **THEN** system displays confirmation dialog asking "Are you sure you want to delete this room?"

#### Scenario: Confirm soft-delete
- **WHEN** hotel manager confirms deletion
- **THEN** system sends DELETE request to `/api/v1/hotel-manager/manage-rooms` with room ID, room appears grayed out in list

#### Scenario: Cancel soft-delete
- **WHEN** hotel manager cancels deletion
- **THEN** system closes confirmation dialog without deleting

### Requirement: Restore soft-deleted room
The system SHALL allow hotel managers to restore soft-deleted rooms.

#### Scenario: Restore room
- **WHEN** hotel manager clicks "Restore" button on a deleted room
- **THEN** system sends PUT request to restore room, room appears active in list again

### Requirement: Room form fields
The system SHALL include the following fields in the room form: number (text), type (select: single/double/suite/etc.), capacity (number), price_per_night (number), quantity_available (number), available (toggle switch).

#### Scenario: Validate room number
- **WHEN** hotel manager submits form with empty room number
- **THEN** system displays error "Room number is required"

#### Scenario: Validate price
- **WHEN** hotel manager enters negative price
- **THEN** system displays error "Price must be a positive number"

#### Scenario: Toggle availability
- **WHEN** hotel manager toggles availability switch
- **THEN** system updates the available status without requiring save (immediate effect)
