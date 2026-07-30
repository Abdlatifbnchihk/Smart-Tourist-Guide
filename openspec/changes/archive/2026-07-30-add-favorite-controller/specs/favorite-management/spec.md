## Purpose

Favorite/bookmark management for attractions and hotels. Users can save, view, and remove favorites with toggle behavior.

## Requirements

### Requirement: List user favorites
The system SHALL return only the authenticated user's favorites, filterable by type.

#### Scenario: List all favorites
- **WHEN** a user requests GET /api/v1/favorites
- **THEN** the system returns all their favorites with related entities

#### Scenario: Filter favorites by hotel type
- **WHEN** a user requests GET /api/v1/favorites?type=hotel
- **THEN** the system returns only hotel favorites

#### Scenario: Filter favorites by attraction type
- **WHEN** a user requests GET /api/v1/favorites?type=attraction
- **THEN** the system returns only attraction favorites

### Requirement: Toggle favorite
The system SHALL add a favorite if it doesn't exist, or remove it if it does.

#### Scenario: Add new favorite
- **WHEN** a user sends POST /api/v1/favorites with valid type and ID
- **THEN** the favorite is created and system returns 201 with "added" message

#### Scenario: Remove existing favorite
- **WHEN** a user sends POST /api/v1/favorites with same type and ID that already exists
- **THEN** the favorite is removed and system returns 200 with "removed" message

#### Scenario: Invalid type provided
- **WHEN** a user sends POST /api/v1/favorites with invalid type (not hotel/attraction/restaurant)
- **THEN** the system returns 422 with validation error

#### Scenario: Non-existent entity
- **WHEN** a user sends POST /api/v1/favorites with non-existent hotel/attraction ID
- **THEN** the system returns 422 with validation error

### Requirement: Remove favorite by ID
The system SHALL allow removing a specific favorite by its ID.

#### Scenario: Delete existing favorite
- **WHEN** a user sends DELETE /api/v1/favorites/{id}
- **THEN** the favorite is deleted and system returns 200 with success message

#### Scenario: Delete non-existent favorite
- **WHEN** a user sends DELETE /api/v1/favorites/{id} for non-existent ID
- **THEN** the system returns 404

#### Scenario: Delete other user's favorite
- **WHEN** a user sends DELETE /api/v1/favorites/{id} for another user's favorite
- **THEN** the system returns 404 (not authorized to see it)
