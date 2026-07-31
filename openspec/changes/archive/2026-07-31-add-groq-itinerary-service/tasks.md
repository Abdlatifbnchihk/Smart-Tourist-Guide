## 1. Configuration

- [x] 1.1 Add `GROQ_API_KEY` to `.env.example`
- [x] 1.2 Update `.env.example` to remove `CLAUDE_API_KEY`

## 2. Service

- [x] 2.1 Create `AiItineraryService` in `app/Services/`
- [x] 2.2 Implement `generate()` method with Groq API call
- [x] 2.3 Implement `buildPrompt()` method for attraction data
- [x] 2.4 Implement `parseResponse()` method for structured output
- [x] 2.5 Implement `getCachedItinerary()` method with file cache

## 3. Request/Response

- [x] 3.1 Create `GenerateItineraryRequest` with validation rules
- [x] 3.2 Create `ItineraryResource` for API responses

## 4. Controller

- [x] 4.1 Create `AiController` in `app/Http/Controllers/Api/V1/`
- [x] 4.2 Implement `generateItinerary()` method

## 5. Routes

- [x] 5.1 Fix import in `routes/api.php` to use `Api\V1\AiController`

## 6. Tests

- [x] 6.1 Write test for generating itinerary successfully
- [x] 6.2 Write test for missing city_id validation error
- [x] 6.3 Write test for invalid preferences validation error
- [x] 6.4 Write test for cache hit (second call returns cached)
- [x] 6.5 Write test for missing API key error
