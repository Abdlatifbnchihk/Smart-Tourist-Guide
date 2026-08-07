## ADDED Requirements

### Requirement: List hotels owned by manager
The system SHALL display a list of all hotels owned by the logged-in hotel manager at `/hotel-manager/hotels`.

#### Scenario: View hotels list
- **WHEN** hotel manager navigates to `/hotel-manager/hotels`
- **THEN** system displays a table/list of hotels with columns: name, city, address, stars, and action buttons

#### Scenario: Empty hotels list
- **WHEN** hotel manager has no hotels
- **THEN** system displays a message indicating no hotels exist with a link to create one

### Requirement: Create new hotel
The system SHALL provide a form to create a new hotel at `/hotel-manager/hotels/new`.

#### Scenario: Navigate to create hotel form
- **WHEN** hotel manager clicks "Create New Hotel" button
- **THEN** system navigates to `/hotel-manager/hotels/new` and displays the hotel creation form

#### Scenario: Submit valid hotel form
- **WHEN** hotel manager fills in all required fields (name, city, address, phone, email, description, stars) and clicks "Save"
- **THEN** system sends POST request to `/api/v1/hotel-manager/manage-hotel` and redirects to hotels list on success

#### Scenario: Submit invalid hotel form
- **WHEN** hotel manager submits form with missing required fields
- **THEN** system displays validation errors for each missing field

### Requirement: Edit existing hotel
The system SHALL provide a form to edit an existing hotel at `/hotel-manager/hotels/:id/edit`.

#### Scenario: Navigate to edit hotel form
- **WHEN** hotel manager clicks "Edit" button on a hotel in the list
- **THEN** system navigates to `/hotel-manager/hotels/:id/edit` with form pre-populated with hotel data

#### Scenario: Update hotel
- **WHEN** hotel manager modifies hotel fields and clicks "Update"
- **THEN** system sends PUT request to `/api/v1/hotel-manager/manage-hotel` with hotel ID and updated data

#### Scenario: Cancel hotel edit
- **WHEN** hotel manager clicks "Cancel" while editing
- **THEN** system navigates back to hotels list without saving changes

### Requirement: Hotel form fields
The system SHALL include the following fields in the hotel form: name (text), city (select from predefined list), address (text), phone (text), email (text), description (textarea), stars (1-5 selector).

#### Scenario: Validate hotel name
- **WHEN** hotel manager submits form with empty name field
- **THEN** system displays error "Hotel name is required"

#### Scenario: Validate star rating
- **WHEN** hotel manager selects star rating
- **THEN** system only accepts values between 1 and 5

#### Scenario: Validate email format
- **WHEN** hotel manager enters invalid email format
- **THEN** system displays error "Please enter a valid email address"
