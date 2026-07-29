## 1. Database Migrations

- [x] 1.1 Create migration to add `average_rating` (decimal 3,2, default 0) to hotels table
- [x] 1.2 Create migration to add `average_rating` (decimal 3,2, default 0) to attractions table
- [x] 1.3 Create migration to add `rating` (decimal 3,2, default 0) to drivers table
- [x] 1.4 Update Hotel model — add `average_rating` to fillable and casts
- [x] 1.5 Update Attraction model — add `average_rating` to fillable and casts
- [x] 1.6 Update Driver model — add `rating` to fillable and casts

## 2. RatingCalculator Service

- [x] 2.1 Create `RatingCalculator` in `app/Services/`
- [x] 2.2 Implement `recalculateForAttraction(Attraction $attraction)` — AVG reviews → update average_rating
- [x] 2.3 Implement `recalculateForHotel(Hotel $hotel)` — AVG reviews → update average_rating
- [x] 2.4 Implement `recalculateForDriver(Driver $driver)` — AVG reviews → update rating

## 3. ReviewService

- [x] 3.1 Create `ReviewService` in `app/Services/`
- [x] 3.2 Implement `create(array $data)` — validate booking eligibility, enforce one-review-per-user, save review, trigger recalculation
- [x] 3.3 Implement `update(Review $review, array $data)` — validate ownership, update review, trigger recalculation
- [x] 3.4 Implement `delete(Review $review)` — validate ownership, delete review, trigger recalculation

## 4. Tests

- [x] 4.1 Write test for creating review with completed booking
- [x] 4.2 Write test for rejecting review without completed booking
- [x] 4.3 Write test for rejecting duplicate review
- [x] 4.4 Write test for reviewer updating own review
- [x] 4.5 Write test for non-author cannot update review
- [x] 4.6 Write test for reviewer deleting own review
- [x] 4.7 Write test for non-author cannot delete review
- [x] 4.8 Write test for rating recalculation on create
- [x] 4.9 Write test for rating recalculation on update
- [x] 4.10 Write test for rating recalculation on delete
- [x] 4.11 Write test for invalid rating rejection (0 and 6)
