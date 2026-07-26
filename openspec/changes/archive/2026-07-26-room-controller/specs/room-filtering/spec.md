## Purpose

Filtering and search capabilities for the room listing endpoint.

## Requirements

### Requirement: Filter rooms by type
The system SHALL allow filtering rooms by `type` query parameter.

#### Scenario: Filter by room type
- **WHEN** GET request is made to `/api/v1/hotels/1/rooms?type=deluxe`
- **THEN** response returns only rooms with type containing "deluxe"

### Requirement: Filter rooms by availability
The system SHALL allow filtering rooms by `available` query parameter.

#### Scenario: Filter by availability
- **WHEN** GET request is made to `/api/v1/hotels/1/rooms?available=1`
- **THEN** response returns only rooms where available is true

### Requirement: Filter rooms by price range
The system SHALL allow filtering rooms by `min_price` and/or `max_price` query parameters.

#### Scenario: Filter by min price
- **WHEN** GET request is made to `/api/v1/hotels/1/rooms?min_price=100`
- **THEN** response returns only rooms with price_per_night >= 100

#### Scenario: Filter by max price
- **WHEN** GET request is made to `/api/v1/hotels/1/rooms?max_price=500`
- **THEN** response returns only rooms with price_per_night <= 500

#### Scenario: Filter by price range
- **WHEN** GET request is made to `/api/v1/hotels/1/rooms?min_price=100&max_price=500`
- **THEN** response returns only rooms with price_per_night between 100 and 500

### Requirement: Paginated room listing
The system SHALL return paginated results with configurable per_page parameter.

#### Scenario: Default pagination
- **WHEN** GET request is made without per_page parameter
- **THEN** response returns 15 rooms per page (default)

#### Scenario: Custom pagination
- **WHEN** GET request is made with `per_page=5`
- **THEN** response returns 5 rooms per page
