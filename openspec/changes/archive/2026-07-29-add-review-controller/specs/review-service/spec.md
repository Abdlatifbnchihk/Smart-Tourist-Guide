## MODIFIED Requirements

### Requirement: Create review with booking eligibility validation
#### Scenario: Tourist creates review via API
- **WHEN** a tourist submits a review via POST /api/v1/reviews with valid data and completed booking
- **THEN** the review is created and returned with 201 status

#### Scenario: Validation error on create
- **WHEN** a tourist submits a review with missing required fields
- **THEN** the system returns 422 with validation errors

## ADDED Requirements

### Requirement: List reviews with filtering
The system SHALL provide a paginated list of reviews filterable by reviewable entity.

#### Scenario: List reviews for a hotel
- **WHEN** a user requests GET /api/v1/reviews?hotel_id=1
- **THEN** the system returns only reviews for that hotel

#### Scenario: List reviews for a driver
- **WHEN** a user requests GET /api/v1/reviews?driver_id=1
- **THEN** the system returns only reviews for that driver

#### Scenario: List reviews for an attraction
- **WHEN** a user requests GET /api/v1/reviews?attraction_id=1
- **THEN** the system returns only reviews for that attraction

### Requirement: View single review
The system SHALL return a single review with its relationships.

#### Scenario: Get review by ID
- **WHEN** a user requests GET /api/v1/reviews/{id}
- **THEN** the system returns the review with user and reviewable relationships

### Requirement: Update review via API
The system SHALL allow only the review author to update via API.

#### Scenario: Reviewer updates own review via API
- **WHEN** the review author sends PUT /api/v1/reviews/{id} with updated data
- **THEN** the review is updated and returned

#### Scenario: Non-author cannot update via API
- **WHEN** a different user sends PUT /api/v1/reviews/{id}
- **THEN** the system returns 403 Forbidden

### Requirement: Delete review via API
The system SHALL allow only the review author to delete via API.

#### Scenario: Reviewer deletes own review via API
- **WHEN** the review author sends DELETE /api/v1/reviews/{id}
- **THEN** the review is deleted and returns 200 with success message

#### Scenario: Non-author cannot delete via API
- **WHEN** a different user sends DELETE /api/v1/reviews/{id}
- **THEN** the system returns 403 Forbidden
