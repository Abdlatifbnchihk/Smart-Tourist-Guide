## MODIFIED Requirements

### Requirement: Tourist can view their favorites list
The system SHALL display the authenticated tourist's saved favorites at route `/favorites` using a tab-filtered card grid layout.

#### Scenario: Successful favorites load
- **WHEN** a logged-in tourist navigates to `/favorites`
- **THEN** the system fetches `GET /api/v1/favorites` and displays a card grid with tabs (All, Hotels, Attractions, Restaurants) showing: item name, type, rating, and a Favorite Button toggle

#### Scenario: Empty favorites list
- **WHEN** a logged-in tourist navigates to `/favorites` and has no saved items
- **THEN** the system displays an empty state message "No favorites saved yet"

### Requirement: Tourist can filter favorites by type
The system SHALL allow the tourist to filter favorites by type using tabs: All, Hotels, Attractions, Restaurants.

#### Scenario: Filter by type
- **WHEN** the tourist clicks a type tab (e.g., "Hotels")
- **THEN** the system displays only favorites matching that type in the card grid

#### Scenario: Show all favorites
- **WHEN** the tourist clicks the "All" tab
- **THEN** the system displays all favorites regardless of type

### Requirement: Tourist can remove a favorite
The system SHALL allow the tourist to remove an item from their favorites using the Favorite Button toggle.

#### Scenario: Remove favorite
- **WHEN** the tourist clicks the Favorite Button on a favorited item
- **THEN** the system sends `POST /api/v1/favorites/toggle` and removes the item from the favorites list

#### Scenario: Confirm removal
- **WHEN** the tourist clicks the Favorite Button
- **THEN** the system displays a confirmation dialog before toggling the favorite state
