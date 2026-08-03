# Admin Role Management

## Purpose

Provides RESTful API endpoints for administrators to manage roles, including listing, creating, viewing, updating, and deleting roles, with validation and user assignment checks.

## Requirements

### Requirement: List roles with user counts
The system SHALL provide a paginated list of roles with the count of users assigned to each role. The endpoint SHALL be accessible to administrators only.

#### Scenario: Administrator retrieves roles list
- **WHEN** an administrator sends a GET request to `/api/v1/admin/roles`
- **THEN** the system SHALL return a paginated list of roles, each including `id`, `name`, `slug`, `description`, `users_count`, `created_at`, and `updated_at`

#### Scenario: Non-administrator cannot access roles list
- **WHEN** a user with a role other than `Administrator` sends a GET request to `/api/v1/admin/roles`
- **THEN** the system SHALL return a 403 Unauthorized response

### Requirement: Create a new role
The system SHALL allow administrators to create a new role with `name`, `slug`, and optional `description`. The `name` and `slug` must be unique across all roles.

#### Scenario: Administrator creates a valid role
- **WHEN** an administrator sends a POST request to `/api/v1/admin/roles` with valid `name`, `slug`, and optional `description`
- **THEN** the system SHALL create a new role and return it with a 201 Created status

#### Scenario: Creation fails with duplicate name
- **WHEN** an administrator sends a POST request with a `name` that already exists
- **THEN** the system SHALL return a 422 Unprocessable Entity response with validation error for `name`

#### Scenario: Creation fails with duplicate slug
- **WHEN** an administrator sends a POST request with a `slug` that already exists
- **THEN** the system SHALL return a 422 Unprocessable Entity response with validation error for `slug`

#### Scenario: Creation fails with missing required fields
- **WHEN** an administrator sends a POST request without `name` or `slug`
- **THEN** the system SHALL return a 422 Unprocessable Entity response with validation errors for missing fields

### Requirement: Show role details with users
The system SHALL provide detailed information about a specific role, including the list of users assigned to that role.

#### Scenario: Administrator retrieves role details
- **WHEN** an administrator sends a GET request to `/api/v1/admin/roles/{role}`
- **THEN** the system SHALL return the role details with `id`, `name`, `slug`, `description`, `created_at`, `updated_at`, and a `users` array containing basic user information

#### Scenario: Role not found
- **WHEN** an administrator sends a GET request to a non-existent role ID
- **THEN** the system SHALL return a 404 Not Found response

### Requirement: Update role fields
The system SHALL allow administrators to update a role's `name`, `slug`, and `description`. The updated `name` and `slug` must be unique (excluding the current role).

#### Scenario: Administrator updates a role
- **WHEN** an administrator sends a PUT/PATCH request to `/api/v1/admin/roles/{role}` with valid fields
- **THEN** the system SHALL update the role and return the updated role data

#### Scenario: Update fails with duplicate name
- **WHEN** an administrator sends a request with a `name` that already exists for another role
- **THEN** the system SHALL return a 422 Unprocessable Entity response with validation error for `name`

#### Scenario: Update fails with duplicate slug
- **WHEN** an administrator sends a request with a `slug` that already exists for another role
- **THEN** the system SHALL return a 422 Unprocessable Entity response with validation error for `slug`

### Requirement: Delete role only if no users assigned
The system SHALL allow administrators to delete a role only if no users are currently assigned to that role.

#### Scenario: Administrator deletes a role with no users
- **WHEN** an administrator sends a DELETE request to `/api/v1/admin/roles/{role}` and the role has zero users
- **THEN** the system SHALL delete the role and return a 200 OK response with a success message

#### Scenario: Delete fails when role has assigned users
- **WHEN** an administrator sends a DELETE request to a role that has one or more users assigned
- **THEN** the system SHALL return a 409 Conflict response with a message indicating the number of assigned users

#### Scenario: Delete fails for non-existent role
- **WHEN** an administrator sends a DELETE request to a non-existent role ID
- **THEN** the system SHALL return a 404 Not Found response