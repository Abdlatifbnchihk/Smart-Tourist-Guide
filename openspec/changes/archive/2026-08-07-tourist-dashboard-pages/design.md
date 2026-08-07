## Context

The Smart Tourist Guide frontend already has booking creation flows (hotel checkout, transport checkout), an attraction detail page, and an admin bookings management page. Tourists can create bookings, save favorites, and write reviews — but have no dedicated pages to manage their own activity. The backend already has scoped endpoints: `GET /api/v1/hotel-bookings` returns only the authenticated user's bookings, `GET /api/v1/transport-bookings` does the same, and `GET /api/v1/favorites` and `GET /api/v1/reviews` exist.

The frontend uses React Router v7, TanStack React Query v5, Tailwind CSS, and an `apiClient` axios instance with `Accept: application/json` header. Existing patterns include: pages in `src/pages/<section>/`, services in `src/services/`, shared UI components (Skeleton, StatusBadge), and route definitions in `App.jsx`.

## Goals / Non-Goals

**Goals:**
- Provide tourists with dedicated pages to view and manage their bookings, favorites, and reviews
- Reuse existing API endpoints and frontend patterns (services, React Query, Tailwind components)
- Support cancel operations for bookings in pending/confirmed status
- Support type-based filtering on the favorites page
- Support edit/delete on the reviews page

**Non-Goals:**
- Payment processing or refund logic (cancel just updates status)
- Real-time booking updates (polling/WebSockets)
- Admin-level booking management (already exists)
- Creating new backend endpoints (reuse existing ones; minor query param additions only)

## Decisions

### 1. Route structure: nested under `/my-bookings`, `/favorites`, `/my-reviews`

**Decision**: Use `/my-bookings/hotel`, `/my-bookings/transport`, `/my-bookings/:id` for bookings; `/favorites` and `/my-reviews` for the others.

**Rationale**: Grouping booking pages under a common prefix simplifies navigation and matches the sidebar pattern. The `:id` param handles both hotel and transport detail pages — the page detects the booking type from the API response.

**Alternative**: Separate routes like `/hotel-bookings`, `/transport-bookings`. Rejected because it fragments the tourist's navigation experience.

### 2. Service layer: extend existing `bookingService.js`

**Decision**: Add tourist-facing query functions to the existing `bookingService.js` (e.g., `getMyHotelBookings`, `getMyTransportBookings`, `getMyBookingDetail`). Create `favoriteService.js` and `reviewService.js` for the other pages.

**Rationale**: Keeps booking logic centralized. The admin functions already use different URL prefixes (`/admin/...`), so tourist functions use the base URLs.

### 3. Cancel flow: status update via existing PATCH endpoints

**Decision**: Cancel uses `PATCH /api/v1/hotel-bookings/{id}/cancel` (or status update to `cancelled`). Transport bookings use the equivalent transport endpoint.

**Rationale**: These endpoints already exist and handle status transitions with validation. No new backend work needed.

### 4. Favorites filtering: client-side with optional query param

**Decision**: The `GET /api/v1/favorites` endpoint already exists. If it doesn't support `?type=hotel|attraction|restaurant`, add a `type` query parameter to the backend. Otherwise, filter client-side.

**Rationale**: Minimal backend change. Client-side filtering is sufficient for the expected data volume.

### 5. Reuse existing components

**Decision**: Reuse `StatusBadge` (from admin bookings page), `Skeleton` (loading states), and existing Tailwind utility patterns (cards, tables, buttons).

**Rationale**: Consistent UI across admin and tourist views. No new component library needed.

## Risks / Trade-offs

- **[Risk]** Backend endpoints might not support all needed query parameters (e.g., favorites type filtering) → **Mitigation**: Add minimal query params to existing controllers; fallback to client-side filtering.
- **[Risk]** The `GET /api/v1/reviews` endpoint might not support `user_id=me` filtering → **Mitigation**: The endpoint likely already scopes to the authenticated user. If not, add `where('user_id', $user->id)` to the controller.
- **[Risk]** Booking detail page needs to handle both hotel and transport booking types → **Mitigation**: Detect `booking_type` from the API response and render appropriate fields conditionally.
- **[Trade-off]** Client-side type filtering for favorites vs. server-side → Acceptable for small-to-medium datasets. Can upgrade to server-side later if needed.
