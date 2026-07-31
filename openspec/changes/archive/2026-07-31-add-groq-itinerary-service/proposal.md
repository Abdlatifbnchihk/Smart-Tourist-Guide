## Why

Tourists need personalized itineraries for their trips. Currently there's no way to generate AI-powered travel plans based on their preferences, budget, and available attractions. This feature uses Groq API (Llama 3) to generate structured day-by-day itineraries.

## What Changes

- Create `AiItineraryService` for Groq API integration
- Create `AiController` with `generateItinerary` endpoint
- Create `GenerateItineraryRequest` for validation
- Create `ItineraryResource` for API responses
- Add file caching to prevent redundant API calls
- Add Groq API key configuration to `.env`

## Capabilities

### New Capabilities

- `itinerary-generation`: AI-powered itinerary generation using Groq API with caching

### Modified Capabilities

(none)

## Impact

- New files: `app/Services/AiItineraryService.php`, `app/Http/Controllers/Api/V1/AiController.php`, `app/Http/Requests/GenerateItineraryRequest.php`, `app/Http/Resources/ItineraryResource.php`
- Modified files: `.env`, `.env.example`, `routes/api.php`
- New tests: `tests/Feature/Api/V1/AiControllerTest.php`
