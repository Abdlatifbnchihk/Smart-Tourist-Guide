## ADDED Requirements

### Requirement: Tourist can view their favorites list
The system SHALL display the authenticated tourist's saved favorites at route `/favorites`.

#### Scenario: Successful favorites load
- **WHEN** a logged-in tourist navigates to `/favorites`
- **THEN** the system fetches `GET /api/v1/favorites` and displays a list of saved items with: item name, type (hotel/attraction/restaurant), and a remove button

#### Scenario: Empty favorites list
- **WHEN** a logged-in tourist navigates to `/favorites` and has no saved items
- **THEN** the system displays an empty state message "No favorites saved yet"

### Requirement: Tourist can filter favorites by type
The system SHALL allow the tourist to filter favorites by type: All, Hotels, Attractions, Restaurants.

#### Scenario: Filter by type
- **WHEN** the tourist selects a type filter (e.g., "Hotels")
- **THEN** the system displays only favorites matching that type

#### Scenario: Show all favorites
- **WHEN** the tourist selects "All" filter
- **THEN** the system displays all favorites regardless of type

### Requirement: Tourist can remove a favorite
The system SHALL allow the tourist to remove an item from their favorites.

#### Scenario: Remove favorite
- **WHEN** the tourist clicks the "Remove" button on a favorite item
- **THEN** the system sends `DELETE /api/v1/favorites/{id}` and removes the item from the list

#### Scenario: Confirm removal
- **WHEN** the tourist clicks the "Remove" button
- **THEN** the system displays a confirmation dialog before proceeding with removal
