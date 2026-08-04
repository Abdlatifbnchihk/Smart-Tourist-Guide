## ADDED Requirements

### Requirement: Cities page displays all cities
The cities page SHALL display a grid of all Moroccan cities fetched from the API.

#### Scenario: Cities load successfully
- **WHEN** user navigates to `/cities`
- **THEN** page displays grid of city cards with data from `GET /api/v1/cities`

#### Scenario: Cities loading state
- **WHEN** cities are being fetched
- **THEN** page displays loading indicator

#### Scenario: Cities fetch error
- **WHEN** API request fails
- **THEN** page displays error message

### Requirement: City card displays city information
Each city card SHALL display name, region, description, hotel count, attraction count, and restaurant count.

#### Scenario: City card renders with data
- **WHEN** city card receives city data
- **THEN** card displays city name, region badge, description snippet, and stats (hotels, attractions, restaurants)

### Requirement: Search filters cities by name
The cities page SHALL provide a search input that filters cities by name.

#### Scenario: User searches for city
- **WHEN** user types in search input
- **THEN** city list filters to show only cities matching the search term

#### Scenario: Search with no results
- **WHEN** search term matches no cities
- **THEN** page displays "No cities found" message

### Requirement: City card click navigates to detail
Clicking a city card SHALL navigate to the city detail page.

#### Scenario: User clicks city card
- **WHEN** user clicks on a city card
- **THEN** system navigates to `/cities/{city_id}`

### Requirement: Cities page responsive layout
The cities page SHALL display cities in a responsive grid layout.

#### Scenario: Desktop layout
- **WHEN** page renders on desktop (>= 1024px)
- **THEN** cities display in 3-column grid

#### Scenario: Tablet layout
- **WHEN** page renders on tablet (768px - 1023px)
- **THEN** cities display in 2-column grid

#### Scenario: Mobile layout
- **WHEN** page renders on mobile (< 768px)
- **THEN** cities display in 1-column grid