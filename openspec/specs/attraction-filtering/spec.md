## Purpose

This capability provides filtering functionality for attractions in the Smart Tourist Guide platform. It allows users to filter attractions by city, category, price range, and rating.

## Requirements

### Requirement: Filter by city
The system SHALL filter attractions by city_id when provided as query parameter.

#### Scenario: Filter by city
- **WHEN** authenticated user sends GET request with `city_id=1`
- **THEN** system returns only attractions in that city

#### Scenario: Invalid city filter
- **WHEN** authenticated user sends GET request with non-existent `city_id`
- **THEN** system returns empty list with 200 status

### Requirement: Filter by category
The system SHALL filter attractions by category when provided as query parameter.

#### Scenario: Filter by category
- **WHEN** authenticated user sends GET request with `category=museum`
- **THEN** system returns only attractions matching that category

### Requirement: Filter by price range
The system SHALL filter attractions by minimum and maximum price when provided.

#### Scenario: Filter by min price
- **WHEN** authenticated user sends GET request with `min_price=10`
- **THEN** system returns only attractions with price >= 10

#### Scenario: Filter by max price
- **WHEN** authenticated user sends GET request with `max_price=50`
- **THEN** system returns only attractions with price <= 50

#### Scenario: Filter by price range
- **WHEN** authenticated user sends GET request with `min_price=10&max_price=50`
- **THEN** system returns only attractions with price between 10 and 50

### Requirement: Filter by rating
The system SHALL filter attractions by minimum rating when provided.

#### Scenario: Filter by min rating
- **WHEN** authenticated user sends GET request with `min_rating=4`
- **THEN** system returns only attractions with average rating >= 4

### Requirement: Combine multiple filters
The system SHALL support combining multiple filters in a single request.

#### Scenario: Combined filters
- **WHEN** authenticated user sends GET request with `city_id=1&min_rating=4&category=museum`
- **THEN** system returns attractions matching ALL specified filters

#### Scenario: No results
- **WHEN** filters produce no matching attractions
- **THEN** system returns empty list with 200 status
