## MODIFIED Requirements

### Requirement: Tourist can view their reviews list
The system SHALL display the authenticated tourist's reviews at route `/my-reviews`.

#### Scenario: Successful reviews load
- **WHEN** a logged-in tourist navigates to `/my-reviews`
- **THEN** the system fetches `GET /api/v1/reviews` (scoped to current user) and displays a list using Review Card components with: entity name, rating, comment snippet, date, and edit/delete buttons

#### Scenario: Empty reviews list
- **WHEN** a logged-in tourist navigates to `/my-reviews` and has no reviews
- **THEN** the system displays an empty state message "No reviews yet"

### Requirement: Tourist can delete a review
The system SHALL allow the tourist to delete their own review.

#### Scenario: Delete review
- **WHEN** the tourist clicks the "Delete" button on a Review Card
- **THEN** the system displays a confirmation dialog, then sends `DELETE /api/v1/reviews/{id}` and removes the review from the list

#### Scenario: Cancel delete
- **WHEN** the tourist confirms deletion and the API call succeeds
- **THEN** the review is removed from the list and a success message is shown

### Requirement: Tourist can edit a review
The system SHALL allow the tourist to edit their existing review's rating and comment.

#### Scenario: Open edit form
- **WHEN** the tourist clicks the "Edit" button on a Review Card
- **THEN** the system displays an inline edit form pre-filled with the current rating and comment

#### Scenario: Save edited review
- **WHEN** the tourist modifies the rating or comment and clicks "Save"
- **THEN** the system sends `PUT /api/v1/reviews/{id}` and updates the review in the list

#### Scenario: Cancel edit
- **WHEN** the tourist clicks "Cancel" while editing
- **THEN** the edit form closes and the original review content is restored
