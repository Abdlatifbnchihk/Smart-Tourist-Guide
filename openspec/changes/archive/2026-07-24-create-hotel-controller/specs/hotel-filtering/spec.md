## ADDED Requirements

### Requirement: Hotels can be filtered by city
The system SHALL filter hotels by city_id when provided.

#### Scenario: Filter by city
- **WHEN** GET request includes city_id parameter
- **THEN** response returns only hotels in that city

### Requirement: Hotels can be filtered by star rating
The system SHALL filter hotels by star_rating when provided.

#### Scenario: Filter by stars
- **WHEN** GET request includes star_rating parameter
- **THEN** response returns only hotels with that star rating

### Requirement: Hotels can be filtered by price range
The system SHALL filter hotels by min_price and max_price when provided.

#### Scenario: Filter by price range
- **WHEN** GET request includes min_price and/or max_price parameters
- **THEN** response returns only hotels within that price range

### Requirement: Hotels can be searched by name
The system SHALL search hotels by name when search parameter is provided.

#### Scenario: Search by name
- **WHEN** GET request includes search parameter
- **THEN** response returns hotels with names containing the search term
