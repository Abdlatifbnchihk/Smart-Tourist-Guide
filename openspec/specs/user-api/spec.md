# User API

## Purpose

UserController, UserResource, and UpdateUserRequest for user profile management with MLD-aligned fields.

## Requirements

### Requirement: UserController profile method returns user with MLD fields

The `UserController::profile()` method SHALL return the authenticated user with direct relationships loaded. The response SHALL include `first_name`, `last_name`, `role` (ENUM string), `status` (ENUM string), `email`, `phone`. The field `role_id` SHALL NOT be included.

#### Scenario: Profile returns correct fields

- **WHEN** an authenticated user calls `GET /api/v1/user/profile`
- **THEN** the response SHALL contain `first_name`, `last_name`, `role`, `status`, `email`, `phone`

#### Scenario: Profile does not return role_id

- **WHEN** an authenticated user calls `GET /api/v1/user/profile`
- **THEN** the response SHALL NOT contain `role_id` or `name`

#### Scenario: Driver profile includes driver relationship

- **WHEN** a user with `role = 'Driver'` calls `GET /api/v1/user/profile`
- **THEN** the response SHALL include a `driver` object with driver-specific fields

### Requirement: UserController updateProfile method accepts MLD fields

The `UserController::updateProfile()` method SHALL accept `first_name` and `last_name` as separate fields. The field `name` SHALL NOT be accepted.

#### Scenario: Update with first_name and last_name

- **WHEN** a user calls `PUT /api/v1/user/profile/update` with `first_name` and `last_name`
- **THEN** both fields SHALL be updated separately

#### Scenario: Name field is rejected

- **WHEN** a user calls `PUT /api/v1/user/profile/update` with `name` field
- **THEN** the field SHALL be ignored or rejected

### Requirement: UserController driver profile update method

The `UserController` SHALL provide a method for drivers to update driver-specific fields: `license_number`, `years_of_experience`, `languages`, `available`.

#### Scenario: Driver updates license number

- **WHEN** a driver calls `PUT /api/v1/user/driver/profile` with `license_number`
- **THEN** the driver record SHALL be updated

#### Scenario: Non-driver cannot access driver update

- **WHEN** a user with `role != 'Driver'` calls `PUT /api/v1/user/driver/profile`
- **THEN** the system SHALL return a 403 Forbidden response

### Requirement: UserResource outputs MLD-aligned fields

The `UserResource` SHALL transform user model to API response with: `user_id`, `first_name`, `last_name`, `email`, `phone`, `role` (string), `status` (string), `active` (boolean). The field `role_id` SHALL NOT be included.

#### Scenario: Resource transforms user correctly

- **WHEN** a User model is passed to UserResource
- **THEN** the output SHALL contain `first_name`, `last_name`, `role`, `status`

#### Scenario: Resource does not include role_id

- **WHEN** a User model is passed to UserResource
- **THEN** the output SHALL NOT contain `role_id`

### Requirement: UpdateUserRequest validates user profile fields

The `UpdateUserRequest` SHALL validate: `first_name` (required|string|max:100), `last_name` (required|string|max:100), `email` (required|email|max:150), `phone` (required|string|max:20). The field `name` SHALL NOT be in the validation rules.

#### Scenario: Valid update data passes validation

- **WHEN** a request contains valid `first_name`, `last_name`, `email`, `phone`
- **THEN** validation SHALL pass

#### Scenario: Name field is not validated

- **WHEN** a request contains `name` field
- **THEN** it SHALL be ignored by validation
