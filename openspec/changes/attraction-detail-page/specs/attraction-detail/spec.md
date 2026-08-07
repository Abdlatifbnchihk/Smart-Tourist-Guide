## ADDED Requirements

### Requirement: Attraction detail page displays full attraction information
The system SHALL display a dedicated page at `/attractions/:id` showing attraction name, description, address, opening hours, and city reference with link to city detail.

#### Scenario: Page loads with attraction data
- **WHEN** user navigates to `/attractions/:id` with a valid attraction ID
- **THEN** the page displays the attraction name, description, address, opening hours, and city name linked to `/cities/:city_id`

#### Scenario: Attraction not found
- **WHEN** user navigates to `/attractions/:id` with an invalid attraction ID
- **THEN** the page displays a not found message or redirects to home

### Requirement: Attraction detail page displays average rating
The system SHALL display the attraction's average rating as a star display on the detail page.

#### Scenario: Rating displayed with stars
- **WHEN** the attraction detail page loads
- **THEN** the average rating is shown as filled/empty stars (e.g., 4.5 out of 5 stars)

### Requirement: Attraction detail page displays reviews list
The system SHALL display a list of reviews for the attraction, each showing the reviewer name, rating, and review text.

#### Scenario: Reviews section shows all reviews
- **WHEN** the attraction detail page loads
- **THEN** a reviews section displays all reviews with user name, star rating, and review text

#### Scenario: No reviews exist
- **WHEN** the attraction has no reviews
- **THEN** the reviews section displays a "No reviews yet" message

### Requirement: Attraction detail page has favorites toggle
The system SHALL provide an "Add to Favorites" button that toggles the favorite state for authenticated users.

#### Scenario: User adds attraction to favorites
- **WHEN** authenticated user clicks "Add to Favorites" button
- **THEN** the system calls `POST /api/v1/favorites` with `type: "attraction"` and attraction ID, and button changes to "Remove from Favorites"

#### Scenario: User removes attraction from favorites
- **WHEN** authenticated user clicks "Remove from Favorites" button
- **THEN** the system calls `POST /api/v1/favorites` with `type: "attraction"` and attraction ID, and button changes to "Add to Favorites"

#### Scenario: Unauthenticated user sees favorites button
- **WHEN** unauthenticated user views attraction detail page
- **THEN** the favorites button is displayed but clicking it redirects to login page

### Requirement: Attraction detail page requires authentication
The system SHALL require user authentication to access the attraction detail page.

#### Scenario: Unauthenticated user redirected to login
- **WHEN** unauthenticated user navigates to `/attractions/:id`
- **THEN** the system redirects to `/login` page

### Requirement: Attraction detail page uses API data
The system SHALL fetch attraction data from `GET /api/v1/attractions/{attraction}` endpoint using the authenticated API client.

#### Scenario: API call with valid ID
- **WHEN** page loads with valid attraction ID
- **THEN** the system calls `GET /api/v1/attractions/{id}` with authentication token and displays the response data

#### Scenario: API error handling
- **WHEN** the API returns an error
- **THEN** the page displays an appropriate error message
