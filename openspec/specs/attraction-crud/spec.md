## Purpose

This capability provides CRUD operations for attraction management in the Smart Tourist Guide platform. It allows admins and hotel managers to create, read, update, and delete attractions with proper ownership validation and soft deletes.

## Requirements

### Requirement: List attractions with pagination
The system SHALL provide a paginated list of attractions at `GET /api/v1/attractions` with 15 items per page by default.

#### Scenario: Successful list attractions
- **WHEN** authenticated user sends GET request to `/api/v1/attractions`
- **THEN** system returns paginated list of attractions with 200 status code

#### Scenario: Custom pagination
- **WHEN** authenticated user sends GET request with `per_page` query parameter
- **THEN** system returns attractions with specified page size

### Requirement: Create attraction
The system SHALL allow admins and hotel managers to create new attractions at `POST /api/v1/attractions`.

#### Scenario: Admin creates attraction
- **WHEN** admin sends POST request with valid data (city_id, name, description, address, opening_hours)
- **THEN** system creates attraction, auto-generates slug, returns 201 with attraction data

#### Scenario: Hotel manager creates attraction
- **WHEN** hotel manager sends POST request with valid data
- **THEN** system creates attraction with hotel_manager as creator, returns 201

#### Scenario: Tourist cannot create attraction
- **WHEN** tourist sends POST request to `/api/v1/attractions`
- **THEN** system returns 403 Forbidden

#### Scenario: Validation fails
- **WHEN** request missing required fields (city_id, name)
- **THEN** system returns 422 with validation errors

### Requirement: Get attraction detail
The system SHALL provide attraction details at `GET /api/v1/attractions/{id}`.

#### Scenario: Successful get attraction
- **WHEN** authenticated user sends GET request with valid attraction ID
- **THEN** system returns attraction with city relationship and reviews, 200 status

#### Scenario: Attraction not found
- **WHEN** authenticated user sends GET request with non-existent ID
- **THEN** system returns 404 Not Found

#### Scenario: Soft-deleted attraction
- **WHEN** authenticated user sends GET request for soft-deleted attraction
- **THEN** system returns 404 Not Found

### Requirement: Update attraction
The system SHALL allow owner to update attractions at `PUT /api/v1/attractions/{id}`.

#### Scenario: Owner updates attraction
- **WHEN** attraction owner sends PUT request with valid data
- **THEN** system updates attraction, returns 200 with updated data

#### Scenario: Admin updates any attraction
- **WHEN** admin sends PUT request to any attraction
- **THEN** system updates attraction, returns 200

#### Scenario: Non-owner cannot update
- **WHEN** non-owner user sends PUT request
- **THEN** system returns 403 Forbidden

### Requirement: Delete attraction
The system SHALL allow owner to soft delete attractions at `DELETE /api/v1/attractions/{id}`.

#### Scenario: Owner deletes attraction
- **WHEN** attraction owner sends DELETE request
- **THEN** system soft deletes attraction, returns 200 with success message

#### Scenario: Admin deletes any attraction
- **WHEN** admin sends DELETE request
- **THEN** system soft deletes attraction, returns 200

#### Scenario: Non-owner cannot delete
- **WHEN** non-owner user sends DELETE request
- **THEN** system returns 403 Forbidden

### Requirement: Auto-generate slug
The system SHALL automatically generate URL-friendly slugs from attraction names.

#### Scenario: Slug generated from name
- **WHEN** attraction is created with name "Victoria Falls Adventure"
- **THEN** slug is set to "victoria-falls-adventure"

#### Scenario: Duplicate slug handling
- **WHEN** attraction is created with name that would produce duplicate slug
- **THEN** system appends random suffix to ensure uniqueness

### Requirement: Soft deletes
The system SHALL use soft deletes for attractions to preserve data integrity.

#### Scenario: Attraction soft deleted
- **WHEN** attraction is deleted
- **THEN** deleted_at timestamp is set, attraction not visible in normal queries

#### Scenario: Reviews preserved after delete
- **WHEN** attraction is soft deleted
- **THEN** associated reviews remain in database
