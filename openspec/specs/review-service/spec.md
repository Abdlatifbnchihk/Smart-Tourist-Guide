## Purpose

Review business logic for hotels, attractions, and drivers. Handles booking eligibility validation, duplicate prevention, and automatic rating recalculation.

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
