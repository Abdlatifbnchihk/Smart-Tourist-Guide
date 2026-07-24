## ADDED Requirements

### Requirement: Attraction resource format
The system SHALL return attraction data in consistent JSON format using AttractionResource.

#### Scenario: Successful resource response
- **WHEN** attraction is retrieved
- **THEN** response contains: id, name, slug, description, address, opening_hours, city relationship, created_at, updated_at

### Requirement: Include city relationship
The system SHALL include city relationship in attraction responses.

#### Scenario: City included in response
- **WHEN** attraction is retrieved
- **THEN** response includes city object with id, name, region

### Requirement: Include reviews in detail
The system SHALL include reviews when retrieving attraction details.

#### Scenario: Reviews in detail response
- **WHEN** attraction is retrieved via GET `/api/v1/attractions/{id}`
- **THEN** response includes reviews array with user name, rating, comment

### Requirement: Calculate average rating
The system SHALL calculate and include average rating in attraction responses.

#### Scenario: Average rating calculation
- **WHEN** attraction has reviews with ratings 4, 5, 3
- **THEN** response includes average_rating: 4.0

#### Scenario: No reviews
- **WHEN** attraction has no reviews
- **THEN** response includes average_rating: null

### Requirement: Resource collection format
The system SHALL return attraction collections in paginated format.

#### Scenario: Paginated collection
- **WHEN** attraction list is retrieved
- **THEN** response contains data array with AttractionResource objects, plus pagination metadata (current_page, last_page, per_page, total)

### Requirement: Conditional relationships
The system SHALL include relationships based on context.

#### Scenario: Index response lightweight
- **WHEN** attraction list is retrieved
- **THEN** response includes city but excludes reviews for performance

#### Scenario: Detail response full
- **WHEN** single attraction is retrieved
- **THEN** response includes city and reviews with user information
