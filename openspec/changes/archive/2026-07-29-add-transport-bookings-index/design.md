## Context

The TransportBookingController currently has store, show, cancel, and status endpoints but no index (list) endpoint. The HotelBookingController already has a working index endpoint with role-based filtering that can be used as a reference pattern.

Current state:
- TransportBookingController: store, show, cancel, status
- HotelBookingController: index, store, show, cancel, status
- Both controllers operate on the same `bookings` table with `booking_type` discriminator

## Goals / Non-Goals

**Goals:**
- Add index endpoint to TransportBookingController
- Tourist sees only their own transport bookings
- Driver sees only transport bookings assigned to them
- Paginated response with eager-loaded relationships
- Follow same pattern as HotelBookingController index

**Non-Goals:**
- Admin role filtering (not required)
- Complex filtering/sorting (keep simple)
- Changing existing booking service logic

## Decisions

**1. Query Pattern**
- **Decision**: Use same query pattern as HotelBookingController - build query based on role, eager load relationships, paginate
- **Why**: Consistency with existing code, proven pattern

**2. Role-Based Filtering**
- **Decision**: Tourist filters by `user_id`, driver filters by `driver.user_id`
- **Why**: Tourist owns bookings, driver is assigned to bookings

**3. Relationships to Eager Load**
- **Decision**: Eager load `user`, `driver.user`, `room.hotel` (for hotel+driver bookings)
- **Why**: Prevent N+1 queries, provide complete data for frontend

**4. Pagination**
- **Decision**: Use Laravel's paginate() with configurable per_page (default 15)
- **Why**: Consistent with HotelBookingController, handles large datasets

## Risks / Trade-offs

- **Risk**: Driver filtering via `driver.user_id` requires join → **Mitigation**: Use `whereHas` like HotelBookingController uses for hotel filtering
- **Risk**: Performance with large datasets → **Mitigation**: Pagination limits results per request
