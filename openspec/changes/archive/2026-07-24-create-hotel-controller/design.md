## Context

The Smart Tourist Guide platform needs hotel management functionality. The hotels table already exists with columns: id, city_id, name, address, phone, email, description, stars, timestamps. The Hotel model exists with relationships to City, Room, Review, and Favorite. We need to create a controller with CRUD operations, filtering, search, and ownership validation following the same patterns as the AttractionController.

## Goals / Non-Goals

**Goals:**
- Create HotelController with full CRUD operations
- Add filtering by city_id, star_rating, min_price, max_price
- Add search by hotel name
- Add ownership validation (hotel_owner role only)
- Add soft delete support
- Create Form Requests for validation
- Create API Resource with city, rooms, reviews, average_rating

**Non-Goals:**
- Room management (separate controller)
- Booking functionality
- Payment integration
- Image upload

## Decisions

### 1. Controller Location
**Decision:** Create `App\Http\Controllers\Api\V1\HotelController`
**Rationale:** Follows existing pattern from AttractionController, consistent API structure
**Alternatives considered:**
- Resource controller: Rejected - need custom filtering logic

### 2. Ownership Validation
**Decision:** Only users with `hotel_owner` role can create/update/delete hotels
**Rationale:** Business requirement - hotel owners manage their own properties
**Alternatives considered:**
- Admin-only: Rejected - need hotel_owner access
- Any authenticated user: Rejected - security concern

### 3. Soft Deletes
**Decision:** Add SoftDeletes trait to Hotel model
**Rationale:** Preserve data for analytics, allow recovery of accidentally deleted hotels
**Alternatives considered:**
- Hard delete: Rejected - data loss risk

### 4. Filtering Strategy
**Decision:** Query builder with conditional clauses
**Rationale:** Simple, maintainable, follows AttractionController pattern
**Alternatives considered:**
- Spatie Query Builder: Rejected - adds dependency for simple case

### 5. Average Rating
**Decision:** Calculate average_rating using reviews relationship
**Rationale:** Dynamic calculation, always accurate
**Alternatives considered:**
- Cached rating: Rejected - complexity for MVP

## Risks / Trade-offs

**Risk 1:** Performance with avg_rating calculation on large datasets
→ Mitigation: Eager load reviews, consider caching in future

**Risk 2:** Ownership validation bypass if role check is missing
→ Mitigation: Always check role in update/destroy methods

**Risk 3:** Soft deleted hotels still consume storage
→ Mitigation: Consider pruning old soft deletes in future

## Migration Plan

1. Add SoftDeletes to Hotel model
2. Create HotelController with all methods
3. Create StoreHotelRequest and UpdateHotelRequest
4. Create HotelResource
5. Add routes to api.php
6. Test all endpoints

## Open Questions

- Should we add slug generation for hotels like attractions?
- Should we add price range to hotels (currently only in rooms)?
