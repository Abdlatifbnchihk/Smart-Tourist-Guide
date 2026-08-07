## Context

The Smart Tourist Guide platform has a Laravel backend with attraction endpoints (`GET /v1/attractions`, `GET /v1/attractions/{attraction}`) but no corresponding frontend pages. The CityDetailPage links to `/attractions/:slug` but no route or page exists. The HomePage uses hardcoded data for attraction cards. The admin sidebar has no attraction management section.

Current state:
- Backend API ready with attraction endpoints, reviews, and favorites support
- Frontend has `apiClient.js` for authenticated requests and `hotelService.js` as a service pattern reference
- Admin layout exists with sidebar navigation
- React Router v7 with inline routes in `App.jsx`

## Goals / Non-Goals

**Goals:**
- Create Attraction Detail page at `/attractions/:id` with full attraction info, reviews, ratings, and favorites toggle
- Create Attraction Listing page in admin with filtering sidebar (city_id, category, price, rating, search)
- Create `attractionService.js` following existing service patterns
- Add attractions route to admin sidebar navigation
- Update `AttractionCard` to work with real API data

**Non-Goals:**
- Creating new backend endpoints (existing endpoints are sufficient)
- Modifying attraction data model or migrations
- Implementing attraction creation/editing UI (admin CRUD)
- Review creation UI (focus on listing existing reviews)

## Decisions

### 1. Route param: use `id` not `slug`
**Decision:** Use `/attractions/:id` instead of `/attractions/:slug`

**Rationale:** The backend `GET /v1/attractions/{attraction}` endpoint accepts either id or slug. Using `id` is simpler and consistent with hotel detail page pattern (`/hotels/:id`). The slug is not exposed in the attraction resource response.

**Alternative considered:** Use slug for SEO-friendly URLs - rejected because the API resource doesn't consistently return slugs and id-based routing is simpler.

### 2. Service file pattern
**Decision:** Create `attractionService.js` following `hotelService.js` pattern

**Rationale:** Consistency with existing codebase. Export individual async functions using `apiClient` for authenticated requests.

### 3. Favorites integration
**Decision:** Use existing `POST /api/v1/favorites` toggle endpoint with `type: "attraction"`

**Rationale:** The favorites API already supports attraction type. No backend changes needed. Frontend can toggle favorite state and update UI reactively.

### 4. Admin page location
**Decision:** Place attraction management page in admin section under `pages/admin/`

**Rationale:** Consistent with existing admin pages (CitiesManagementPage, HotelsManagementPage). Admin sidebar already exists for navigation.

### 5. Reviews display
**Decision:** Display reviews in a scrollable list with user name, rating stars, and review text

**Rationale:** Backend `AttractionResource` includes reviews when loaded. No additional API calls needed.

## Risks / Trade-offs

- **API authentication required** → All attraction endpoints require authentication. Ensure user is logged in before accessing detail page. Mitigate with `ProtectedRoute` wrapper.

- **No attraction image support** → Backend model has no image column. Attraction detail page will lack visual content. Could be addressed in a future change.

- **Filter sidebar complexity** → Admin filtering requires multiple query params. Mitigate by using URL search params for shareable filtered views.

- **Loading states** → Need skeleton/loaders for attraction detail and reviews. Follow existing `Skeleton` component pattern.
