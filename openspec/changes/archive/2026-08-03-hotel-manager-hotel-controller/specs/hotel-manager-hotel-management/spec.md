## ADDED Requirements

### Requirement: List hotels owned by authenticated user
The system SHALL provide a paginated list of hotels where the `created_by` field matches the authenticated user's ID. The endpoint SHALL be accessible only to users with the `Hotel Manager` role.

#### Scenario: Hotel manager retrieves own hotels
- **WHEN** a hotel manager sends a GET request to `/api/v1/hotel-manager/manage-hotel`
- **THEN** the system SHALL return a paginated list of hotels where `created_by` equals the authenticated user's ID

#### Scenario: Non-hotel-manager cannot access hotel list
- **WHEN** a user with a role other than `Hotel Manager` sends a GET request to `/api/v1/hotel-manager/manage-hotel`
- **THEN** the system SHALL return a 403 Unauthorized response

### Requirement: Create a new hotel
The system SHALL allow hotel managers to create a new hotel with `name`, `city_id`, `address`, `phone`, `email`, `description`, and `stars`. The `created_by` field SHALL be automatically set to the authenticated user's ID.

#### Scenario: Hotel manager creates a valid hotel
- **WHEN** a hotel manager sends a POST request to `/api/v1/hotel-manager/manage-hotel` with valid required fields (`name`, `city_id`, `address`)
- **THEN** the system SHALL create a new hotel with `created_by` set to the authenticated user's ID and return it with a 201 Created status

#### Scenario: Creation fails with missing required fields
- **WHEN** a hotel manager sends a POST request without `name`, `city_id`, or `address`
- **THEN** the system SHALL return a 422 Unprocessable Entity response with validation errors for missing fields

### Requirement: Show own hotel with relationships
The system SHALL provide detailed information about a specific hotel owned by the authenticated user, including rooms and reviews. The endpoint SHALL verify ownership before returning the hotel.

#### Scenario: Hotel manager retrieves own hotel details
- **WHEN** a hotel manager sends a GET request to `/api/v1/hotel-manager/manage-hotel/{hotel}` where the hotel's `created_by` matches the authenticated user's ID
- **THEN** the system SHALL return the hotel details with `id`, `name`, `city_id`, `address`, `phone`, `email`, `description`, `stars`, `created_by`, `created_at`, `updated_at`, and include `rooms` and `reviews` relationships

#### Scenario: Hotel manager cannot view hotel owned by another user
- **WHEN** a hotel manager sends a GET request to a hotel where `created_by` does not match the authenticated user's ID
- **THEN** the system SHALL return a 403 Forbidden response

#### Scenario: Hotel not found
- **WHEN** a hotel manager sends a GET request to a non-existent hotel ID
- **THEN** the system SHALL return a 404 Not Found response

### Requirement: Update own hotel
The system SHALL allow hotel managers to update a hotel they own. The endpoint SHALL verify ownership before allowing the update.

#### Scenario: Hotel manager updates own hotel
- **WHEN** a hotel manager sends a PUT/PATCH request to `/api/v1/hotel-manager/manage-hotel/{hotel}` where the hotel's `created_by` matches the authenticated user's ID
- **THEN** the system SHALL update the hotel and return the updated hotel data

#### Scenario: Hotel manager cannot update hotel owned by another user
- **WHEN** a hotel manager sends a PUT/PATCH request to a hotel where `created_by` does not match the authenticated user's ID
- **THEN** the system SHALL return a 403 Forbidden response

#### Scenario: Update fails with invalid data
- **WHEN** a hotel manager sends a request with invalid data (e.g., missing required fields)
- **THEN** the system SHALL return a 422 Unprocessable Entity response with validation errors

### Requirement: Delete own hotel
The system SHALL allow hotel managers to delete a hotel they own. The endpoint SHALL verify ownership before allowing deletion.

#### Scenario: Hotel manager deletes own hotel
- **WHEN** a hotel manager sends a DELETE request to `/api/v1/hotel-manager/manage-hotel/{hotel}` where the hotel's `created_by` matches the authenticated user's ID
- **THEN** the system SHALL delete the hotel and return a 200 OK response with a success message

#### Scenario: Hotel manager cannot delete hotel owned by another user
- **WHEN** a hotel manager sends a DELETE request to a hotel where `created_by` does not match the authenticated user's ID
- **THEN** the system SHALL return a 403 Forbidden response

#### Scenario: Delete fails for non-existent hotel
- **WHEN** a hotel manager sends a DELETE request to a non-existent hotel ID
- **THEN** the system SHALL return a 404 Not Found response