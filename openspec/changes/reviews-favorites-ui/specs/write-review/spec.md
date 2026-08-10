## ADDED Requirements

### Requirement: Tourist can create a new review
The system SHALL display a review creation form at route `/reviews/new` for authenticated tourists.

#### Scenario: Successful review creation
- **WHEN** a logged-in tourist fills in the star rating (1-5), comment, and selects an entity type (hotel/driver/attraction)
- **AND** clicks "Submit Review"
- **THEN** the system sends `POST /api/v1/reviews` with the review data and displays a success message

#### Scenario: Validation - missing required fields
- **WHEN** a tourist attempts to submit a review without selecting a star rating or leaving a comment
- **THEN** the system displays validation errors indicating required fields

#### Scenario: Validation - no completed booking
- **WHEN** a tourist attempts to create a review for an entity type they have no completed booking for
- **THEN** the system displays a message "You must have a completed booking to leave a review"

#### Scenario: Validation - duplicate review
- **WHEN** a tourist attempts to create a review for an entity they have already reviewed
- **THEN** the system displays a message "You have already reviewed this entity"

### Requirement: Star rating selector
The system SHALL provide a clickable star rating selector (1-5 stars) on the review creation form.

#### Scenario: Select star rating
- **WHEN** a tourist clicks on a star (1-5)
- **THEN** the system highlights the selected star and all stars below it

#### Scenario: Change star rating
- **WHEN** a tourist clicks a different star
- **THEN** the system updates the highlighted stars to reflect the new selection

### Requirement: Entity type selector
The system SHALL provide a dropdown to select the entity type (hotel, driver, or attraction) for the review.

#### Scenario: Display available entities
- **WHEN** the review form loads
- **THEN** the system fetches the tourist's completed bookings and populates the entity selector with valid options

#### Scenario: Select entity type
- **WHEN** a tourist selects an entity type from the dropdown
- **THEN** the system sets the entity type for the review submission
