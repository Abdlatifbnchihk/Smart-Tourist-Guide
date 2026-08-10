## ADDED Requirements

### Requirement: Review Card component
The system SHALL provide a reusable Review Card component for displaying review information.

#### Scenario: Display review details
- **WHEN** a Review Card is rendered with review data
- **THEN** it displays: star rating, user name, date, and comment text

#### Scenario: Display edit/delete buttons for owner
- **WHEN** the current user is the review owner
- **THEN** the Review Card displays Edit and Delete buttons

#### Scenario: Hide edit/delete buttons for non-owner
- **WHEN** the current user is not the review owner
- **THEN** the Review Card does not display Edit or Delete buttons

### Requirement: Favorite Button component
The system SHALL provide a reusable Favorite Button component with heart icon toggle.

#### Scenario: Display favorited state
- **WHEN** an item is favorited by the current user
- **THEN** the Favorite Button displays a filled heart icon

#### Scenario: Display non-favorited state
- **WHEN** an item is not favorited by the current user
- **THEN** the Favorite Button displays an outline heart icon

#### Scenario: Toggle favorite state
- **WHEN** the user clicks the Favorite Button
- **THEN** the system sends `POST /api/v1/favorites/toggle` and updates the heart icon state

### Requirement: Rating Display component
The system SHALL provide a reusable Rating Display component for showing star ratings.

#### Scenario: Display average rating
- **WHEN** a Rating Display is rendered with a rating value
- **THEN** it displays the appropriate number of filled stars (rounded to nearest half) and the numeric average

#### Scenario: Display rating in different contexts
- **WHEN** the Rating Display is used in hotel, attraction, or driver cards/details
- **THEN** it maintains consistent styling and displays correctly at different sizes
