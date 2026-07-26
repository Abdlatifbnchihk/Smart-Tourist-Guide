## Purpose

API resource formatting for room responses. Defines the shape of room data in API responses.

## Requirements

### Requirement: RoomResource includes correct field names
The system SHALL return room data using actual migration column names: `id`, `hotel_id`, `number`, `type`, `capacity`, `price_per_night`, `available`, `created_at`, `updated_at`.

#### Scenario: Room resource field mapping
- **WHEN** room data is returned via RoomResource
- **THEN** response contains `number`, `type`, `price_per_night`, `available` (not `room_type`, `price`, `is_available`)

### Requirement: RoomResource includes hotel relationship
The system SHALL include the parent hotel relationship in room detail responses when eager-loaded.

#### Scenario: Hotel included in room detail
- **WHEN** room detail is retrieved with hotel relationship loaded
- **THEN** response includes `hotel` object with hotel details

### Requirement: RoomResource handles missing relationships gracefully
The system SHALL return null/empty for relationships that are not eager-loaded.

#### Scenario: Hotel not loaded
- **WHEN** room is returned without hotel relationship loaded
- **THEN** `hotel` field is null or omitted
