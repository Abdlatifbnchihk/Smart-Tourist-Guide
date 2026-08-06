## ADDED Requirements

### Requirement: Display hotel information
The system SHALL display hotel details including name, address, phone, email, description, and star rating when a user navigates to `/hotels/:id`.

#### Scenario: View hotel details
- **WHEN** user navigates to `/hotels/{id}`
- **THEN** system displays hotel name, address, phone, email, description, and star rating

### Requirement: Display average rating
The system SHALL display the average user rating for the hotel.

#### Scenario: Show average rating
- **WHEN** hotel details are loaded
- **THEN** system displays average rating calculated from all reviews

### Requirement: Display reviews list
The system SHALL display a list of user reviews with individual ratings.

#### Scenario: Show reviews
- **WHEN** hotel details are loaded
- **THEN** system displays list of reviews with reviewer name, rating, and comment

### Requirement: Book now action
The system SHALL provide a "Book Now" button that navigates to room selection.

#### Scenario: Click book now
- **WHEN** user clicks "Book Now" button
- **THEN** system navigates to `/hotels/{id}/rooms`

### Requirement: Add to favorites action
The system SHALL provide an "Add to Favorites" button for authenticated users.

#### Scenario: Add hotel to favorites
- **WHEN** authenticated user clicks "Add to Favorites"
- **THEN** system adds hotel to user's favorites and updates button state

#### Scenario: Remove from favorites
- **WHEN** authenticated user clicks "Remove from Favorites"
- **THEN** system removes hotel from user's favorites and updates button state
