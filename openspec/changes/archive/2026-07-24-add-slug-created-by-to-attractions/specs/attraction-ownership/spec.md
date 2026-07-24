## ADDED Requirements

### Requirement: created_by column exists
The attractions table SHALL have a `created_by` column of type BIGINT UNSIGNED that is nullable and references the users table.

#### Scenario: created_by column exists
- **WHEN** attractions table is queried
- **THEN** table has `created_by` column with BIGINT UNSIGNED type, nullable, foreign key to users.id

### Requirement: created_by is set on creation
The system SHALL automatically set the `created_by` field to the authenticated user's ID when creating an attraction.

#### Scenario: Creator tracked on create
- **WHEN** user with ID 5 creates an attraction
- **THEN** attraction's `created_by` is set to 5

### Requirement: Ownership is validated on update
The system SHALL only allow the original creator or an administrator to update an attraction.

#### Scenario: Owner can update
- **WHEN** user who created attraction sends update request
- **THEN** system allows update

#### Scenario: Admin can update
- **WHEN** administrator sends update request
- **THEN** system allows update

#### Scenario: Non-owner cannot update
- **WHEN** user who did not create attraction sends update request
- **THEN** system returns 403 Forbidden

### Requirement: Ownership is validated on delete
The system SHALL only allow the original creator or an administrator to delete an attraction.

#### Scenario: Owner can delete
- **WHEN** user who created attraction sends delete request
- **THEN** system allows soft delete

#### Scenario: Admin can delete
- **WHEN** administrator sends delete request
- **THEN** system allows soft delete

#### Scenario: Non-owner cannot delete
- **WHEN** user who did not create attraction sends delete request
- **THEN** system returns 403 Forbidden
