## Context

The Smart Tourist Guide app has an existing `AiController` that accepts POST requests with city, preferences, days, and budget, then returns a generated itinerary via `ItineraryResource`. The backend is complete — this change focuses on building the frontend page that consumes this API.

Current state: No frontend page exists for the AI itinerary feature. The route `POST /api/v1/ai/itinerary` is ready and accepts `city_id`, `preferences` (adventure|cultural|relaxation), `number_of_days` (1-14), and `budget` (LOW|MEDIUM|HIGH).

## Goals / Non-Goals

**Goals:**
- Build a single-page form at `/ai/itinerary` for users to input preferences
- Display the generated itinerary with day-by-day plan, activities, times, costs
- Show travel tips and total estimated cost
- Handle loading states and API errors gracefully
- Cache results client-side (24h per unique request combination)
- Use existing project patterns: React Query, Tailwind CSS, apiClient

**Non-Goals:**
- Backend changes (AiController already works)
- User account integration (page works for any visitor)
- Itinerary editing or modification after generation
- Multi-city itineraries (single city per request)

## Decisions

**1. Caching Strategy: React Query with staleTime**
- Use `useQuery` with `staleTime: 24 * 60 * 60 * 1000` (24h) for caching
- Cache key includes all request params: `['itinerary', cityId, preferences, days, budget]`
- Why: Built-in to existing React Query setup, no extra dependencies, automatic cache invalidation

**2. Form State: Local useState**
- Use simple `useState` for form fields (cityId, preferences, days, budget)
- Why: Form is simple enough — no need for form library. Keeps it consistent with other pages.

**3. Cities Dropdown: Fetch from API**
- Load cities via existing `getCities()` service on mount
- Why: Always shows fresh data, consistent with other pages that load cities

**4. Page Layout: Two-section design**
- Top section: Form card with inputs
- Bottom section: Generated itinerary display (conditionally rendered)
- Why: Clean separation, form stays visible while scrolling results

## Risks / Trade-offs

- **API latency** → Show clear loading spinner with "AI is crafting your itinerary..." message
- **API failures (rate limit, server error)** → Display user-friendly error with retry button
- **Empty itinerary** → Show fallback message suggesting different preferences
- **Large itineraries (14 days)** → Ensure scrolling works well on mobile
