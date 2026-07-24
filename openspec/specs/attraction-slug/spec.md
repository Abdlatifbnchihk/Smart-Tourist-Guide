## ADDED Requirements

### Requirement: Slug column exists
The attractions table SHALL have a `slug` column of type VARCHAR(150) that is unique and nullable.

#### Scenario: Slug column exists
- **WHEN** attractions table is queried
- **THEN** table has `slug` column with VARCHAR(150) type, unique constraint, nullable

### Requirement: Slug is auto-generated from name
The system SHALL automatically generate a URL-friendly slug from the attraction name when creating or updating an attraction.

#### Scenario: Slug generated on create
- **WHEN** attraction is created with name "Jardin Majorelle"
- **THEN** slug is set to "jardin-majorelle"

#### Scenario: Slug generated on update
- **WHEN** attraction name is changed from "Old Name" to "New Name"
- **THEN** slug is updated to "new-name"

### Requirement: Slug uniqueness is enforced
The system SHALL ensure slug uniqueness by appending a random suffix if a duplicate slug would be created.

#### Scenario: Duplicate slug handling
- **WHEN** attraction is created with name that would produce duplicate slug
- **THEN** system appends random suffix (e.g., "jardin-majorelle-abc123")

### Requirement: Slug is used in API responses
The system SHALL include the slug field in all attraction API responses.

#### Scenario: Slug in list response
- **WHEN** attraction list is retrieved
- **THEN** each attraction includes `slug` field

#### Scenario: Slug in detail response
- **WHEN** attraction detail is retrieved
- **THEN** response includes `slug` field
