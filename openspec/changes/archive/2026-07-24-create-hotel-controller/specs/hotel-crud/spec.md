## ADDED Requirements

### Requirement: Hotel can be created
The system SHALL allow hotel_owner users to create new hotels with valid data.

#### Scenario: Successful hotel creation
- **WHEN** hotel_owner sends POST request with valid data (city_id, name, address)
- **THEN** hotel is created and response returns 201 with hotel data

#### Scenario: Validation fails
- **WHEN** hotel_owner sends POST request with missing required fields
- **THEN** response returns 422 with validation errors

### Requirement: Hotel listing is paginated
The system SHALL return paginated list of hotels with default 15 items per page.

#### Scenario: List hotels
- **WHEN** GET request is made to /api/v1/hotels
- **THEN** response returns paginated hotels with city data

### Requirement: Hotel detail includes relationships
The system SHALL return hotel with city, rooms, reviews, and average_rating in detail view.

#### Scenario: Get hotel detail
- **WHEN** GET request is made to /api/v1/hotels/{id}
- **THEN** response returns hotel with city, rooms, reviews, and average_rating

### Requirement: Hotel can be updated by owner
The system SHALL only allow the hotel_owner who created the hotel to update it.

#### Scenario: Owner updates hotel
- **WHEN** hotel_owner who created hotel sends PUT request with valid data
- **THEN** hotel is updated and response returns 200 with updated data

#### Scenario: Non-owner cannot update
- **WHEN** different hotel_owner sends PUT request
- **THEN** response returns 403 Forbidden

### Requirement: Hotel can be soft deleted by owner
The system SHALL only allow the hotel_owner who created the hotel to soft delete it.

#### Scenario: Owner deletes hotel
- **WHEN** hotel_owner who created hotel sends DELETE request
- **THEN** hotel is soft deleted and response returns 200

#### Scenario: Non-owner cannot delete
- **WHEN** different hotel_owner sends DELETE request
- **THEN** response returns 403 Forbidden
