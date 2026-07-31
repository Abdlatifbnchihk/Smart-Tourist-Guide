## Purpose

AI-powered itinerary generation for tourist trips. Generates structured day-by-day plans with attractions, times, tips, and estimated costs based on user preferences and budget.

## Requirements

### Requirement: Generate itinerary with Groq API
The system SHALL generate a structured itinerary using Groq API (Llama 3) based on city, preferences, days, and budget.

#### Scenario: Generate 3-day adventure itinerary
- **WHEN** a user requests POST /api/v1/ai/itinerary with city_id=1, preferences=adventure, number_of_days=3, budget=MEDIUM
- **THEN** the system returns a 3-day itinerary with attractions, times, tips, and estimated costs

#### Scenario: Generate cultural relaxation itinerary
- **WHEN** a user requests POST /api/v1/ai/itinerary with preferences=cultural, budget=LOW
- **THEN** the system returns budget-friendly cultural attractions

#### Scenario: Invalid city ID
- **WHEN** a user requests POST /api/v1/ai/itinerary with non-existent city_id
- **THEN** the system returns 422 with validation error

#### Scenario: Missing required fields
- **WHEN** a user requests POST /api/v1/ai/itinerary without city_id
- **THEN** the system returns 422 with validation error

### Requirement: Cache itinerary results
The system SHALL cache generated itineraries to prevent redundant API calls.

#### Scenario: Cache hit for same parameters
- **WHEN** a user requests an itinerary with same city_id, preferences, number_of_days, and budget as a previous request
- **THEN** the system returns the cached itinerary without calling Groq API

#### Scenario: Cache expiry after 24 hours
- **WHEN** a cached itinerary is older than 24 hours
- **THEN** the system calls Groq API again and updates the cache

### Requirement: Handle API errors gracefully
The system SHALL handle Groq API failures without crashing.

#### Scenario: API key missing
- **WHEN** GROQ_API_KEY is not set in .env
- **THEN** the system returns 500 with error message

#### Scenario: API rate limit exceeded
- **WHEN** Groq API returns 429 rate limit error
- **THEN** the system returns 429 with retry message

#### Scenario: API service unavailable
- **WHEN** Groq API returns 503 service unavailable
- **THEN** the system returns 503 with error message
