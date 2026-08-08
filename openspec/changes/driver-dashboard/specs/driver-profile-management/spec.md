## ADDED Requirements

### Requirement: Driver Profile Edit Page
The system SHALL display a profile edit page at `/driver/profile` for driver-specific fields.

#### Scenario: Profile page loads
- **WHEN** driver navigates to `/driver/profile`
- **THEN** system fetches driver profile and displays a form with current values

#### Scenario: Profile form fields
- **WHEN** profile form is displayed
- **THEN** form shows: License Number, Years of Experience, Languages, Available toggle

#### Scenario: Update profile
- **WHEN** driver submits the profile form
- **THEN** system sends `PUT /api/v1/drivers/{id}` with updated fields and shows success message

#### Scenario: Profile update validation
- **WHEN** driver submits profile with invalid data
- **THEN** system displays validation errors under each invalid field

#### Scenario: Profile update error
- **WHEN** backend returns an error on profile update
- **THEN** system displays the error message to the driver
