## Context

The `HotelBookingService` implements all booking business logic (availability validation, price computation, status transitions) but has no HTTP interface. The system needs RESTful endpoints for tourists to create/manage bookings and for hotel owners to confirm/complete bookings. Existing controllers (HotelController, RoomController) follow a consistent pattern with form requests, API resources, and role-based access control.

## Goals / Non-Goals

**Goals:**
- Expose booking operations via RESTful API endpoints
- Implement role-based filtering (tourist sees own bookings, hotel_owner sees bookings for their hotels)
- Use form request validation for store endpoint
- Consistent API resource responses with relationships
- Integrate with existing HotelBookingService for all business logic
- Proper authorization checks for each endpoint

**Non-Goals:**
- Modify existing HotelBookingService logic
- Add booking cancellation reasons or notes
- Implement booking search/filtering beyond role-based
- Add payment processing integration
- Create booking confirmation emails/notifications

## Decisions

**1. Controller Location:** `App\Http\Controllers\Api\V1\HotelBookingController`
- Follows existing pattern (HotelController, RoomController in Api/V1 namespace)
- Consistent with project structure

**2. Authorization Approach:** Manual checks in controller methods
- Use `$request->user()->role` for role-based access
- Check ownership for tourist (user_id matches)
- Check hotel ownership for hotel_owner (hotel_id matches user's hotels)
- Alternative considered: Policy classes - rejected for simplicity as this is a focused change

**3. Form Request:** `StoreHotelBookingRequest` for validation
- Validates room_id, start_date, end_date
- Does NOT validate total_price (computed by service)
- Authorizes based on tourist role

**4. API Resource:** `HotelBookingResource` with relationships
- Includes user, room, hotel relationships
- Conditional loading based on include parameter
- Follows existing HotelResource pattern

**5. Index Endpoint Filtering:**
- Tourist: `Booking::where('user_id', $userId)`
- Hotel Owner: `Booking::whereHas('room.hotel', fn($q) => $q->where('created_by', $userId))`
- Administrator: All bookings (optional, not required)

**6. Status Endpoint:** PATCH `/api/v1/hotel-bookings/{id}/status`
- Accepts `status` field with value 'confirmed' or 'completed'
- Uses HotelBookingService for transition validation
- Only hotel_owner can access

## Risks / Trade-offs

**Risk:** Authorization logic could be complex for hotel_owner with multiple hotels
→ **Mitigation:** Use `whereHas` relationship query for efficient filtering

**Risk:** Service exceptions may leak implementation details
→ **Mitigation:** Catch DomainException/RuntimeException and return appropriate HTTP responses (422 for validation, 403 for authorization)

**Risk:** Missing rate limiting on booking creation
→ **Mitigation:** Out of scope for this change, can be added later via middleware

**Trade-off:** Manual authorization vs Policy classes
→ Accepted for simplicity; policies can be introduced in future refactor