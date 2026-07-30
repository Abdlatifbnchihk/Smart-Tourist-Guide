## Purpose

Review business logic for hotels, attractions, and drivers. Handles booking eligibility validation, duplicate prevention, automatic rating recalculation, and API endpoints for CRUD operations.

## Requirements

### Requirement: Create review with booking eligibility validation
The system SHALL validate that the user has a completed booking for the reviewable entity before allowing a review. The system SHALL enforce one review per user per reviewable entity.

#### Scenario: Create review for hotel with completed booking
- **WHEN** a user submits a review for a hotel where they have a completed booking
- **THEN** the review is saved with the user_id, hotel_id, rating, and comment

#### Scenario: Create review for attraction with completed booking
- **WHEN** a user submits a review for an attraction where they have a completed booking
- **THEN** the review is saved with the user_id, attraction_id, rating, and comment

#### Scenario: Create review for driver with completed booking
- **WHEN** a user submits a review for a driver where they have a completed booking
- **THEN** the review is saved with the user_id, driver_id, rating, and comment

#### Scenario: Reject review without completed booking
- **WHEN** a user submits a review for an entity where they have no completed booking
- **THEN** the system throws an exception with message "You must have a completed booking to leave a review"

#### Scenario: Reject duplicate review
- **WHEN** a user submits a review for an entity they have already reviewed
- **THEN** the system throws an exception with message "You have already reviewed this entity"

#### Scenario: Tourist creates review via API
- **WHEN** a tourist submits a review via POST /api/v1/reviews with valid data and completed booking
- **THEN** the review is created and returned with 201 status

#### Scenario: Validation error on create
- **WHEN** a tourist submits a review with missing required fields
- **THEN** the system returns 422 with validation errors

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

### Requirement: Update review with authorization
The system SHALL allow only the review author to update their review. Updating a review SHALL trigger rating recalculation.

#### Scenario: Reviewer updates own review
- **WHEN** the review author updates their review rating or comment
- **THEN** the review is updated and the entity's average_rating is recalculated

#### Scenario: Non-author cannot update review
- **WHEN** a user attempts to update a review they did not create
- **THEN** the system throws an exception with message "Unauthorized"

### Requirement: Delete review with authorization
The system SHALL allow only the review author to delete their review. Deleting a review SHALL trigger rating recalculation.

#### Scenario: Reviewer deletes own review
- **WHEN** the review author deletes their review
- **THEN** the review is removed and the entity's average_rating is recalculated

#### Scenario: Non-author cannot delete review
- **WHEN** a user attempts to delete a review they did not create
- **THEN** the system throws an exception with message "Unauthorized"

### Requirement: Recalculate rating on review changes
The system SHALL automatically recalculate the average_rating for the reviewable entity whenever a review is created, updated, or deleted.

#### Scenario: Rating recalculated on review creation
- **WHEN** a new review is saved for a hotel
- **THEN** the hotel's average_rating is updated to the AVG of all its reviews

#### Scenario: Rating recalculated on review update
- **WHEN** a review rating is changed for an attraction
- **THEN** the attraction's average_rating is updated to the AVG of all its reviews

#### Scenario: Rating recalculated on review deletion
- **WHEN** a review is deleted for a driver
- **THEN** the driver's rating is updated to the AVG of all its reviews

### Requirement: Validate rating is 1-5
The system SHALL reject reviews where rating is not between 1 and 5 inclusive.

#### Scenario: Valid rating
- **WHEN** a review is submitted with rating of 3
- **THEN** the review proceeds with validation

#### Scenario: Invalid rating below range
- **WHEN** a review is submitted with rating of 0
- **THEN** the system throws a validation exception

#### Scenario: Invalid rating above range
- **WHEN** a review is submitted with rating of 6
- **THEN** the system throws a validation exception
