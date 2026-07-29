## Context

The Smart Tourist Guide platform allows users to review hotels, attractions, and drivers. The `reviews` table exists with `user_id`, `hotel_id`, `driver_id`, `attraction_id`, `rating`, and `comment` columns. However, there's no business logic to validate reviews or recalculate ratings.

Current state:
- Review model exists with relationships to User, Hotel, Driver, Attraction
- No ReviewService or RatingCalculator
- No `average_rating` columns on hotels/attractions
- No `rating` column on drivers

## Goals / Non-Goals

**Goals:**
- Create ReviewService with create/update/delete methods
- Create RatingCalculator for automatic rating recalculation
- Enforce booking eligibility (completed booking required)
- Prevent duplicate reviews (one per user per reviewable entity)
- Recalculate ratings on every review change

**Non-Goals:**
- Review moderation or approval workflow
- Review pagination or listing (existing controller handles that)
- Photo/file uploads with reviews

## Decisions

**1. Reviewable Entity Detection**
- **Decision**: Use nullable foreign keys (hotel_id, driver_id, attraction_id) to determine reviewable entity
- **Why**: Existing schema supports this pattern, exactly one must be non-null

**2. Rating Recalculation Strategy**
- **Decision**: Recalculate average on every review change (create/update/delete)
- **Why**: Ensures consistency, simple to implement, acceptable performance for moderate traffic

**3. Booking Eligibility**
- **Decision**: Check for completed booking where user_id matches and reviewable entity matches
- **Why**: Ensures only customers who actually used the service can review

**4. Duplicate Prevention**
- **Decision**: Unique constraint on (user_id, hotel_id), (user_id, driver_id), (user_id, attraction_id) where non-null
- **Why**: One review per user per entity, enforced at service and database level

## Risks / Trade-offs

- **Risk**: Performance impact of recalculating on every review → **Mitigation**: Use SQL AVG, acceptable for moderate traffic
- **Risk**: Race conditions on concurrent reviews → **Mitigation**: Use database transactions
