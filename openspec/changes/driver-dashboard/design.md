## Context

The Smart Tourist Guide app has three roles: tourist, hotel_manager, and driver. The driver role has backend APIs for managing vehicles, viewing assigned transport bookings, and updating their profile. However, no frontend pages exist for drivers.

The existing hotel_manager dashboard pattern (isolated layout with sidebar, service file, role-based routes) provides a proven architecture to follow.

## Goals / Non-Goals

**Goals:**
- Create a complete driver dashboard with 6 pages matching the existing hotel_manager pattern
- Reuse existing backend APIs without modifications
- Follow the same component structure and styling conventions as the hotel_manager dashboard
- Support the full driver workflow: view stats → manage vehicles → handle bookings → edit profile

**Non-Goals:**
- No new backend APIs needed - all endpoints exist
- No real-time booking notifications
- No in-app navigation/routing for drivers
- No admin verification workflow changes

## Decisions

### 1. Layout Pattern: Isolated Layout with Sidebar

**Decision**: Use `DriverLayout` + `DriverSidebar` components, mirroring the hotel_manager pattern.

**Why**: Consistency with existing codebase. The hotel_manager dashboard already solved the same problem (role-specific isolated layout with navigation). Copying the pattern reduces cognitive load and makes the codebase predictable.

**Alternative**: Shared layout with role-based menu items. Rejected because it couples role-specific navigation logic and makes the shared layout complex.

### 2. Driver ID Resolution: Fetch from `/auth/me` then `/drivers/{id}`

**Decision**: On login, the frontend fetches `/auth/me` to get the user ID, then fetches `/drivers?user_id={id}` to get the driver profile ID. Store the driver ID in context for all pages.

**Why**: The backend routes use driver ID (not user ID) for vehicle and booking operations. The `auth/me` endpoint returns user data but not the driver profile ID directly. We need to resolve this once and cache it.

**Alternative**: Add a `/drivers/me` endpoint. Rejected because it requires backend changes which are out of scope.

### 3. Service Layer: Dedicated `driverService.js`

**Decision**: Create `src/services/driverService.js` with all API functions, following the `hotelManagerService.js` pattern.

**Why**: Consistency. The hotel_manager service file proved this pattern works well for organizing API calls by role.

### 4. Booking Status Flow

**Decision**: Display status badges with appropriate colors. Show action buttons based on current status:
- Pending → Confirm, Cancel
- Confirmed → Start Trip, Cancel
- In Progress → Complete
- Cancelled/Completed → No actions

**Why**: Matches the backend's `VALID_TRANSITIONS` in `BookingController`. The frontend should only show valid next-state buttons.

### 5. Vehicle Primary Key: Use `vehicle_id` from VehicleResource

**Decision**: The VehicleResource returns `id` mapped from `vehicle_id`. Use this consistently in API calls.

**Why**: The Vehicle model uses `vehicle_id` as primary key, but VehicleResource maps it to `id`. Frontend should use the resource's `id` field.

## Risks / Trade-offs

- **Risk**: Driver profile may not exist yet when user first logs in → Mitigation: Show "Create Driver Profile" page if no driver record found
- **Risk**: Backend booking endpoint returns raw model data without resources → Mitigation: Frontend handles both resource-wrapped and raw responses
- **Risk**: Status transitions are strict in backend → Mitigation: Frontend validates allowed transitions before showing action buttons

## Migration Plan

1. Create `driverService.js` with all API functions
2. Create `DriverSidebar.jsx` and `DriverLayout.jsx`
3. Create 6 pages in order: Dashboard → Vehicles → Vehicle Form → Bookings → Booking Detail → Profile
4. Add routes in `App.jsx`
5. Add driver menu items to `Navbar.jsx`

## Open Questions

- Should the driver profile creation flow be included (if driver record doesn't exist)?
- The backend `BookingController.index()` returns raw models without pagination - should frontend paginate client-side?
