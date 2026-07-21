## ADDED Requirements

### Requirement: Restaurant index endpoint returns restaurants
The system SHALL provide a `GET /api/v1/restaurants` endpoint that returns a list of restaurants.

#### Scenario: Index returns restaurants
- **WHEN** a request is made to `GET /api/v1/restaurants`
- **THEN** the response SHALL contain a list of restaurants with fields `restaurant_id`, `city_id`, `name`, `description`, `address`, `cuisine`, `phone`, `price_range`

### Requirement: Restaurant show endpoint returns restaurant with city relationship
The system SHALL provide a `GET /api/v1/restaurants/{id}` endpoint that returns a single restaurant with city relationship loaded.

#### Scenario: Show returns restaurant with city
- **WHEN** a request is made to `GET /api/v1/restaurants/{id}`
- **THEN** the response SHALL contain the restaurant with `city` relationship loaded

### Requirement: Restaurant store endpoint validates MLD-aligned fields
The system SHALL provide a `POST /api/v1/restaurants` endpoint that validates input according to MLD schema.

#### Scenario: Store accepts valid data
- **WHEN** a POST request is made to `/api/v1/restaurants` with `city_id`, `name`, `address`, `cuisine`
- **THEN** the request SHALL pass validation

#### Scenario: Store accepts optional fields
- **WHEN** a POST request is made to `/api/v1/restaurants` with `description`, `phone`, `price_range`
- **THEN** the request SHALL pass validation

#### Scenario: Store validates price_range
- **WHEN** a POST request is made to `/api/v1/restaurants` with `price_range` = 5
- **THEN** the request SHALL fail validation

### Requirement: Restaurant update endpoint validates MLD-aligned fields
The system SHALL provide a `PUT /api/v1/restaurants/{id}` endpoint that validates input according to MLD schema.

#### Scenario: Update accepts valid data
- **WHEN** a PUT request is made to `/api/v1/restaurants/{id}` with `city_id`, `name`, `address`, `cuisine`
- **THEN** the request SHALL pass validation

#### Scenario: Update validates price_range
- **WHEN** a PUT request is made to `/api/v1/restaurants/{id}` with `price_range` = 0
- **THEN** the request SHALL fail validation

### Requirement: Restaurant resource transforms model to API response
The system SHALL provide a RestaurantResource that transforms the Restaurant model to API response with MLD-aligned fields.

#### Scenario: Resource includes correct fields
- **WHEN** a Restaurant model is passed to RestaurantResource
- **THEN** the output SHALL contain `restaurant_id`, `city_id`, `name`, `description`, `address`, `cuisine`, `phone`, `price_range`, `created_at`, `updated_at`

#### Scenario: Resource includes city relationship when loaded
- **WHEN** a Restaurant model with loaded `city` relationship is passed to RestaurantResource
- **THEN** the output SHALL contain `city` object