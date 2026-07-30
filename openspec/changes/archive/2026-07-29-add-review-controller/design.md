## Context

The ReviewService handles all business logic for reviews (booking eligibility, duplicate prevention, rating recalculation). A controller is needed to expose this via REST API endpoints.

Current state:
- ReviewService: create, update, delete methods
- ReviewResource: basic review data with user relationship
- No ReviewController or StoreReviewRequest

## Goals / Non-Goals

**Goals:**
- Create ReviewController with CRUD endpoints
- Create StoreReviewRequest for input validation
- Update ReviewResource to include reviewable relationships
- Polymorphic filtering on index (by hotel_id, driver_id, or attraction_id)

**Non-Goals:**
- Review moderation or approval workflow
- Photo/file uploads with reviews
- Review pagination beyond Laravel defaults

## Decisions

**1. Reviewable Entity Filtering**
- **Decision**: Use query parameters (hotel_id, driver_id, attraction_id) for filtering
- **Why**: Simple, explicit, works with existing non-polymorphic schema

**2. Authorization Pattern**
- **Decision**: Use Service layer for ownership checks, controller for HTTP response
- **Why**: Keeps controller thin, service handles business rules

**3. Response Format**
- **Decision**: Use existing ReviewResource with added reviewable relationships
- **Why**: Consistent with other resources in the project

## Risks / Trade-offs

- **Risk**: N+1 queries on index → **Mitigation**: Eager load relationships
- **Risk**: Large result sets → **Mitigation**: Use Laravel's paginate()
