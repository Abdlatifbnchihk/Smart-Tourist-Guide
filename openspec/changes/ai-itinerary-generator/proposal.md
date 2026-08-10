## Why

Tourists currently need to manually plan their day-by-day itinerary across Moroccan cities, which is time-consuming and overwhelming. An AI-powered itinerary generator will create personalized travel plans based on user preferences (adventure/cultural/relaxation), budget, and trip duration — providing immediate value and increasing user engagement.

## What Changes

- New `/ai/itinerary` page with a form to collect user preferences (city, activity type, days, budget)
- POST endpoint call to `/api/v1/ai/itinerary` to generate the itinerary
- Day-by-day itinerary display with activities, times, and costs
- Travel tips section and total estimated cost summary
- Loading state while AI generates and error handling for failures
- Client-side caching of results (24h per unique request)

## Capabilities

### New Capabilities
- `ai-itinerary-ui`: Frontend page with form inputs, API integration, itinerary display, loading/error states, and result caching

### Modified Capabilities

## Impact

- **Frontend**: New page component, new route in App.jsx, new service function for API call
- **Backend**: None — `AiController` already exists at `app/Http/Controllers/Api/V1/AiController.php` with the POST `/ai/itinerary` endpoint
- **API**: Uses existing `POST /api/v1/ai/itinerary` endpoint
- **Dependencies**: No new dependencies — uses existing React Query, Tailwind CSS, and axios setup
