## 1. Service Layer

- [x] 1.1 Create `frontend/src/services/aiService.js` with `generateItinerary(data)` function that calls POST `/ai/itinerary`

## 2. Page Component

- [x] 2.1 Create `frontend/src/pages/ai/AiItineraryPage.jsx` with form structure (city selector, preference radios, days input, budget radios, submit button)
- [x] 2.2 Add cities dropdown populated via `getCities()` from `cityService.js`
- [x] 2.3 Add form validation (prevent submit when city is empty)
- [x] 2.4 Add `useQuery` with `staleTime: 24h` for caching itinerary results keyed by request params
- [x] 2.5 Add loading state with spinner and disabled submit button
- [x] 2.6 Add itinerary display section (day-by-day plan, activities with times/costs, travel tips, total cost)
- [x] 2.7 Add error handling with error message and retry button

## 3. Routing

- [x] 3.1 Import `AiItineraryPage` in `App.jsx`
- [x] 3.2 Add `/ai/itinerary` route with Navbar + Footer layout

## 4. Navbar

- [x] 4.1 Add "AI Planner" link to navbar `navLinks` array pointing to `/ai/itinerary`

## 5. Build & Verify

- [x] 5.1 Run `npm run build` to verify no errors
- [x] 5.2 Test form submission with valid data
- [x] 5.3 Test error handling with invalid city ID
