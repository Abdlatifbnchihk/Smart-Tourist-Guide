## Context

The Smart Tourist Guide application has authentication, city browsing, and a home page, but lacks the core hotel booking flow. Users need to view hotel details, read reviews, browse available rooms, and select rooms for booking. The frontend uses React with Vite, Tailwind CSS, React Router, and Tanstack React Query for data fetching.

## Goals / Non-Goals

**Goals:**
- Create hotel detail page displaying all hotel information and reviews
- Create room selection page with filtering capabilities
- Integrate with existing API endpoints for hotel and room data
- Maintain consistent UI/UX with existing pages

**Non-Goals:**
- Booking checkout implementation (separate change)
- Payment processing
- User authentication for booking (already exists)
- Room modification/CRUD operations (admin only)

## Decisions

**Component Structure:**
- Use page components in `src/pages/hotels/` directory
- Create reusable service functions in `src/services/` for API calls
- Use Tanstack React Query for data fetching and caching

**State Management:**
- Filter state managed locally in RoomSelectionPage
- Use URL params for hotel ID routing
- No global state needed for this feature

**API Integration:**
- GET `/api/v1/hotels/{hotel}` for hotel details
- GET `/api/v1/hotels/{hotelId}/rooms` for room listing with query params for filters

## Risks / Trade-offs

- **API dependency**: Backend endpoints must be available → Mock data fallback if needed
- **Performance**: Large review lists → Implement pagination in future iteration
- **Filter complexity**: Multiple filter combinations → Keep filter state simple with URL sync
