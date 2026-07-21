## Purpose

Cities catalog entity for the Smart Tourist Guide Morocco platform. Each city can have hotels, restaurants, attractions, and drivers.

## Requirements

### Requirement: City index endpoint returns cities with counts
The system SHALL provide a `GET /api/v1/cities` endpoint that returns a list of cities with computed counts for hotels, attractions, and restaurants.

#### Scenario: Index returns cities with counts
- **WHEN** a request is made to `GET /api/v1/cities`
- **THEN** the response SHALL contain a list of cities, each including `hotels_count`, `attractions_count`, and `restaurants_count`

#### Scenario: Index does not return removed columns
- **WHEN** a request is made to `GET /api/v1/cities`
- **THEN** the response SHALL NOT contain `country`, `image`, `latitude`, or `longitude` fields

### Requirement: City show endpoint returns city with relationships
The system SHALL provide a `GET /api/v1/cities/{id}` endpoint that returns a single city with hotels, attractions, and restaurants relationships loaded.

#### Scenario: Show returns city with relationships
- **WHEN** a request is made to `GET /api/v1/cities/{id}`
- **THEN** the response SHALL contain the city with `hotels`, `attractions`, and `restaurants` relationships loaded

#### Scenario: Show does not return removed columns
- **WHEN** a request is made to `GET /api/v1/cities/{id}`
- **THEN** the response SHALL NOT contain `country`, `image`, `latitude`, or `longitude` fields

### Requirement: City store endpoint validates MLD-aligned fields
The system SHALL provide a `POST /api/v1/cities` endpoint that validates input according to MLD schema.

#### Scenario: Store accepts name and description
- **WHEN** a POST request is made to `GET /api/v1/cities` with `name` and `description`
- **THEN** the request SHALL pass validation

#### Scenario: Store accepts optional region
- **WHEN** a POST request is made to `GET /api/v1/cities` with `region`
- **THEN** the request SHALL pass validation

#### Scenario: Store rejects removed fields
- **WHEN** a POST request is made to `GET /api/v1/cities` with `country`, `image`, `latitude`, or `longitude`
- **THEN** the request SHALL fail validation

### Requirement: City update endpoint validates MLD-aligned fields
The system SHALL provide a `PUT /api/v1/cities/{id}` endpoint that validates input according to MLD schema.

#### Scenario: Update accepts name and description
- **WHEN** a PUT request is made to `GET /api/v1/cities/{id}` with `name` and `description`
- **THEN** the request SHALL pass validation

#### Scenario: Update accepts optional region
- **WHEN** a PUT request is made to `GET /api/v1/cities/{id}` with `region`
- **THEN** the request SHALL pass validation

#### Scenario: Update rejects removed fields
- **WHEN** a PUT request is made to `GET /api/v1/cities/{id}` with `country`, `image`, `latitude`, or `longitude`
- **THEN** the request SHALL fail validation

### Requirement: City resource transforms model to API response
The system SHALL provide a CityResource that transforms the City model to API response with MLD-aligned fields.

#### Scenario: Resource includes correct fields
- **WHEN** a City model is passed to CityResource
- **THEN** the output SHALL contain `city_id`, `name`, `region`, `description`, `hotels_count`, `attractions_count`, `restaurants_count`

#### Scenario: Resource excludes removed fields
- **WHEN** a City model is passed to CityResource
- **THEN** the output SHALL NOT contain `country`, `image`, `latitude`, or `longitude`