## ADDED Requirements

### Requirement: Itinerary form displays all input fields
The page SHALL display a form with: city selector (dropdown), preference radio buttons (Adventure/Cultural/Relaxation), number of days input (1-14), budget radio buttons (LOW/MEDIUM/HIGH), and a submit button.

#### Scenario: Form renders with all fields
- **WHEN** user navigates to `/ai/itinerary`
- **THEN** form displays city dropdown, preference radios, days input, budget radios, and submit button

#### Scenario: City dropdown populated from API
- **WHEN** form loads
- **THEN** city dropdown contains all cities fetched from the API

### Requirement: Form validation prevents invalid submissions
The form SHALL prevent submission when required fields are missing or invalid.

#### Scenario: Submit with empty city
- **WHEN** user clicks submit without selecting a city
- **THEN** form shows validation error and does not call API

#### Scenario: Submit with valid data
- **WHEN** user fills all fields correctly and clicks submit
- **THEN** form calls POST `/api/v1/ai/itinerary` with the form data

### Requirement: Loading state during generation
The page SHALL display a loading indicator while the AI generates the itinerary.

#### Scenario: Loading shown after submit
- **WHEN** user submits valid form
- **THEN** loading spinner is displayed and submit button is disabled

#### Scenario: Loading hidden after response
- **WHEN** API returns success or error
- **THEN** loading spinner is hidden

### Requirement: Itinerary display after generation
The page SHALL display the generated itinerary with day-by-day plan, activities (with times and costs), travel tips, and total estimated cost.

#### Scenario: Successful itinerary display
- **WHEN** API returns itinerary data
- **THEN** page shows day-by-day plan with activities, times, costs, travel tips, and total estimated cost

#### Scenario: Day-by-day structure
- **WHEN** itinerary has multiple days
- **THEN** each day is displayed as a separate section with its activities listed

### Requirement: Error handling for API failures
The page SHALL display user-friendly error messages when the API fails.

#### Scenario: API error displayed
- **WHEN** API returns an error response
- **THEN** page shows error message with details and a retry button

#### Scenario: Retry after error
- **WHEN** user clicks retry after an error
- **THEN** form re-submits the last valid request

### Requirement: Client-side caching of results
The page SHALL cache itinerary results for 24 hours per unique request combination.

#### Scenario: Cached result shown on repeat request
- **WHEN** user submits same parameters within 24 hours
- **THEN** cached result is shown without API call

#### Scenario: Cache expires after 24 hours
- **WHEN** more than 24 hours pass since last request
- **THEN** next submit makes a fresh API call
