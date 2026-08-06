## ADDED Requirements

### Requirement: Display room list
The system SHALL display available rooms for a hotel when user navigates to `/hotels/:hotel-id/rooms`.

#### Scenario: View rooms
- **WHEN** user navigates to `/hotels/{hotelId}/rooms`
- **THEN** system displays list of rooms with number, type, capacity, price per night, and availability status

### Requirement: Filter by room type
The system SHALL allow filtering rooms by room type.

#### Scenario: Filter by single type
- **WHEN** user selects a room type filter
- **THEN** system displays only rooms matching that type

### Requirement: Filter by availability
The system SHALL allow filtering rooms by availability status.

#### Scenario: Filter by availability
- **WHEN** user selects availability filter
- **THEN** system displays only rooms matching that availability status

### Requirement: Filter by price range
The system SHALL allow filtering rooms by minimum and maximum price.

#### Scenario: Filter by price range
- **WHEN** user sets min and/or max price filter
- **THEN** system displays only rooms within that price range

### Requirement: Select room for booking
The system SHALL allow users to select a room and navigate to booking checkout.

#### Scenario: Select available room
- **WHEN** user clicks on an available room
- **THEN** system navigates to booking checkout with selected room

#### Scenario: Cannot select unavailable room
- **WHEN** user clicks on an unavailable room
- **THEN** system does not navigate and shows room is unavailable
