## Context

The Smart Tourist Guide has a fully implemented backend booking system with hotel and transport booking endpoints. The frontend has hotel browsing and room selection but no checkout pages. The RoomSelectionPage attempts to navigate to `/checkout` which doesn't exist. Transport booking has no frontend UI at all.

Current state:
- Backend: `POST /api/v1/hotel-bookings` and `POST /api/v1/transport-bookings` fully functional
- Backend computes pricing: hotel = `price_per_night * nights`, transport = `price_per_km * distance_km`
- Frontend has `apiClient.js` for authenticated requests and service patterns (`hotelService.js`, `attractionService.js`)
- React Router v7 with inline routes in `App.jsx`
- TanStack React Query v5 for data fetching

## Goals / Non-Goals

**Goals:**
- Create Hotel Booking Checkout page with date pickers, guest count, room summary, price calculation, and booking confirmation
- Create Transport Booking Checkout page with driver/vehicle selection, distance input, date pickers, booking type selector, price estimate, and booking confirmation
- Create `bookingService.js` with API functions for both booking types
- Update `RoomSelectionPage` to navigate to correct checkout path
- Add checkout routes to `App.jsx` with ProtectedRoute

**Non-Goals:**
- Creating new backend endpoints (existing APIs are sufficient)
- Booking management/listing pages (future change)
- Payment integration (bookings start as Pending status)
- Driver/vehicle browsing pages (future change)

## Decisions

### 1. Route structure
**Decision:** Use `/booking/hotel` and `/booking/transport` instead of a single `/checkout` with query params

**Rationale:** Cleaner URLs, separate concerns, easier to maintain. The current `/checkout?hotelId=...&roomId=...` approach is fragile with many params.

**Alternative considered:** Single `/checkout` page with type param - rejected for complexity.

### 2. Room data passing
**Decision:** Pass room/hotel data via React Router `location.state` from RoomSelectionPage

**Rationale:** Avoids extra API calls on checkout page load. Data is already available from room selection.

**Alternative considered:** Fetch room data again on checkout using room_id - adds latency but more resilient. Using state for now, can add fallback fetch later.

### 3. Driver/vehicle selection
**Decision:** Fetch drivers list from `GET /api/v1/drivers` and vehicles from `GET /api/v1/drivers/{id}/vehicles` on the transport checkout page

**Rationale:** Drivers need to be selected dynamically. No state passed from a previous page.

### 4. Price calculation
**Decision:** Calculate price client-side for display, let backend validate and compute final price

**Rationale:** Provides instant feedback to user. Backend is authoritative for final price.

### 5. Date input
**Decision:** Use native HTML date inputs (`type="date"`) instead of a date picker library

**Rationale:** No new dependencies. Native inputs work well for simple date selection. Can upgrade to a library later if needed.

## Risks / Trade-offs

- **Room availability race condition** → Room might become unavailable between selection and checkout. Backend validates availability on booking creation. Show clear error if room is no longer available.

- **No driver/vehicle browsing page** → Users need a way to find drivers. For now, transport checkout shows all available drivers. A dedicated search page can be added later.

- **Date validation** → Check-out must be after check-in. Frontend validates before submission, backend also validates.

- **State data loss** → If user refreshes page, location.state is lost. Could add a fallback fetch using room_id from URL params as a future improvement.
