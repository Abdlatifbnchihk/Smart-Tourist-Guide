## ADDED Requirements

### Requirement: Tourist can view favorites with tab filtering
The system SHALL display a favorites page at route `/favorites` with tab-based filtering.

#### Scenario: Display all favorites
- **WHEN** a logged-in tourist navigates to `/favorites`
- **THEN** the system fetches `GET /api/v1/favorites` and displays all saved items in a card grid

#### Scenario: Filter by Hotels tab
- **WHEN** the tourist clicks the "Hotels" tab
- **THEN** the system displays only favorited hotels

#### Scenario: Filter by Attractions tab
- **WHEN** the tourist clicks the "Attractions" tab
- **THEN** the system displays only favorited attractions

#### Scenario: Filter by Restaurants tab
- **WHEN** the tourist clicks the "Restaurants" tab
- **THEN** the system displays only favorited restaurants

#### Scenario: Empty favorites list
- **WHEN** the tourist has no saved favorites
- **THEN** the system displays an empty state message "No favorites saved yet"

### Requirement: Tourist can remove items from favorites
The system SHALL allow the tourist to toggle favorites off from the favorites page.

#### Scenario: Remove favorite via toggle
- **WHEN** the tourist clicks the favorite toggle button on a favorited item
- **THEN** the system sends `POST /api/v1/favorites/toggle` and removes the item from the favorites list

#### Scenario: Confirm removal
- **WHEN** the tourist clicks the favorite toggle button
- **THEN** the system displays a confirmation dialog before toggling the favorite state

### Requirement: Favorites display card information
The system SHALL display relevant information for each favorited item in the card grid.

#### Scenario: Display hotel favorite
- **WHEN** a favorited item is a hotel
- **THEN** the card displays: hotel name, location, price range, and rating

#### Scenario: Display attraction favorite
- **WHEN** a favorited item is an attraction
- **THEN** the card displays: attraction name, location, category, and rating

#### Scenario: Display restaurant favorite
- **WHEN** a favorited item is a restaurant
- **THEN** the card displays: restaurant name, cuisine type, price range, and rating
