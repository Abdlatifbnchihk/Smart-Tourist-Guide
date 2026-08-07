## ADDED Requirements

### Requirement: Admin attraction management page
The system SHALL provide an attraction management page at `/admin/attractions` accessible to administrator role users.

#### Scenario: Admin navigates to attractions management
- **WHEN** administrator user clicks "Attractions" in admin sidebar
- **THEN** the system displays the attraction management page with a list of attractions

### Requirement: Admin attraction page has filter sidebar
The system SHALL display a filter sidebar on the admin attraction management page with filters for city_id, category, min_price, max_price, min_rating, and search.

#### Scenario: Filter sidebar displayed
- **WHEN** admin loads the attraction management page
- **THEN** a sidebar is displayed with input fields for city_id, category, min_price, max_price, min_rating, and search

#### Scenario: Filter by city
- **WHEN** admin selects a city from the city_id filter
- **THEN** the attraction list updates to show only attractions in that city

#### Scenario: Filter by category
- **WHEN** admin enters a category in the category filter
- **THEN** the attraction list updates to show only attractions matching that category

#### Scenario: Filter by price range
- **WHEN** admin enters min_price and/or max_price values
- **THEN** the attraction list updates to show only attractions within that price range

#### Scenario: Filter by minimum rating
- **WHEN** admin enters a minimum rating value
- **THEN** the attraction list updates to show only attractions with average_rating >= that value

#### Scenario: Search attractions
- **WHEN** admin enters text in the search filter
- **THEN** the attraction list updates to show attractions matching the search text

### Requirement: Admin attraction list displays attraction data
The system SHALL display attraction data in the admin list including name, city, average rating, and opening hours.

#### Scenario: List shows attraction information
- **WHEN** admin views the attraction list
- **THEN** each attraction row shows name, city name, average rating, and opening hours

### Requirement: Admin attraction management uses API
The system SHALL fetch attraction data from `GET /api/v1/attractions` with query parameters for filtering.

#### Scenario: API call with filter params
- **WHEN** admin applies filters
- **THEN** the system calls `GET /api/v1/attractions` with appropriate query parameters (city_id, category, min_price, max_price, min_rating, search)

### Requirement: Admin attraction management requires admin role
The system SHALL restrict attraction management page access to administrator role users only.

#### Scenario: Non-admin user redirected
- **WHEN** non-admin user navigates to `/admin/attractions`
- **THEN** the system redirects to home or unauthorized page
