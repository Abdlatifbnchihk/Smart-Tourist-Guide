## ADDED Requirements

### Requirement: List users with filtering and search
The system SHALL provide a paginated list of users with filtering by role, status, and active state, and search by name or email. The list SHALL display user name, email, phone, role, status, active state, created date, and actions.

#### Scenario: Admin retrieves user list
- **WHEN** an admin sends a GET request to `/api/v1/admin/users`
- **THEN** the system SHALL return a paginated list of users with `user_id`, `first_name`, `last_name`, `email`, `phone`, `role`, `status`, `active`, `driver`, `bookings_count`, `created_at`, and `updated_at`

#### Scenario: Admin filters users by role
- **WHEN** an admin sends a GET request to `/api/v1/admin/users?role=Driver`
- **THEN** the system SHALL return only users with the specified role

#### Scenario: Admin filters users by status
- **WHEN** an admin sends a GET request to `/api/v1/admin/users?status=Approved`
- **THEN** the system SHALL return only users with the specified status

#### Scenario: Admin searches users by name or email
- **WHEN** an admin sends a GET request to `/api/v1/admin/users?search=john`
- **THEN** the system SHALL return users whose first_name, last_name, or email contains the search term

### Requirement: Create a new user
The system SHALL allow admins to create a new user with first_name, last_name, email, phone, password, role, and optional status. When role is "Driver", city_id and license_number are required.

#### Scenario: Admin creates a valid user
- **WHEN** an admin sends a POST request to `/api/v1/admin/users` with valid fields
- **THEN** the system SHALL create the user and return a 201 Created response with user data

#### Scenario: Admin creates a Driver user
- **WHEN** an admin sends a POST request with role="Driver" and valid driver fields
- **THEN** the system SHALL create both the user and associated driver profile

#### Scenario: Creation fails with duplicate email
- **WHEN** an admin sends a POST request with an email that already exists
- **THEN** the system SHALL return a 422 validation error for `email`

### Requirement: Update user fields
The system SHALL allow admins to update a user's first_name, last_name, email, phone, role, status, and active state. Password is not required for updates.

#### Scenario: Admin updates a user
- **WHEN** an admin sends a PUT request to `/api/v1/admin/users/{user}` with valid fields
- **THEN** the system SHALL update the user and return the updated user data

#### Scenario: Admin toggles user active state
- **WHEN** an admin sends a PATCH request to `/api/v1/admin/users/{user}` with `active: false`
- **THEN** the system SHALL deactivate the user account

### Requirement: Delete a user
The system SHALL allow admins to permanently delete a user account.

#### Scenario: Admin deletes a user
- **WHEN** an admin sends a DELETE request to `/api/v1/admin/users/{user}`
- **THEN** the system SHALL delete the user and return a success message

#### Scenario: Delete fails for non-existent user
- **WHEN** an admin sends a DELETE request to a non-existent user ID
- **THEN** the system SHALL return a 404 Not Found response
