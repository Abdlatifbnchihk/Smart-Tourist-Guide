## Purpose

This capability provides search functionality for attractions in the Smart Tourist Guide platform. It allows users to search attractions by name using LIKE queries.

## Requirements

### Requirement: Search attractions by name
The system SHALL search attractions by name using LIKE query when search parameter is provided.

#### Scenario: Search by exact name
- **WHEN** authenticated user sends GET request with `search=Victoria Falls`
- **THEN** system returns attractions with names containing "Victoria Falls"

#### Scenario: Search partial name
- **WHEN** authenticated user sends GET request with `search=Victoria`
- **THEN** system returns attractions with "Victoria" in name

#### Scenario: Case-insensitive search
- **WHEN** authenticated user sends GET request with `search=victoria`
- **THEN** system returns attractions with "Victoria" in name (case-insensitive)

#### Scenario: No search results
- **WHEN** authenticated user sends GET request with `search=nonexistent`
- **THEN** system returns empty list with 200 status

### Requirement: Search with filters
The system SHALL allow combining search with other filters.

#### Scenario: Search and filter combined
- **WHEN** authenticated user sends GET request with `search=Victoria&city_id=1`
- **THEN** system returns attractions matching search AND filter criteria

### Requirement: Search pagination
The system SHALL paginate search results.

#### Scenario: Paginated search
- **WHEN** authenticated user sends GET request with `search=Victoria&page=1&per_page=10`
- **THEN** system returns paginated search results with 10 items per page
