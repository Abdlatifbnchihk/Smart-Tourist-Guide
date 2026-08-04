## MODIFIED Requirements

### Requirement: API client fetches cities data
The frontend SHALL use the API client to fetch cities data from `GET /api/v1/cities`.

#### Scenario: Cities fetched successfully
- **WHEN** cities page or home page loads
- **THEN** API client sends GET request to `/api/v1/cities` and receives city array

#### Scenario: Cities fetch includes counts
- **WHEN** cities are fetched
- **THEN** response includes hotel_count, attraction_count, and restaurant_count for each city