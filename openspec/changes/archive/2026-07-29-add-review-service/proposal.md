## Why

The Review model exists but lacks business logic for creating reviews with validation, preventing duplicate reviews, and automatically recalculating ratings. Users can currently save any review without verifying booking eligibility or enforcing one-review-per-user-per-entity rules.

## What Changes

- Create `ReviewService` for review CRUD with business rules
- Create `RatingCalculator` for automatic rating recalculation
- Add `average_rating` column to hotels and attractions tables
- Add `rating` column to drivers table
- Enforce booking eligibility (completed booking required)
- Prevent duplicate reviews (one per user per reviewable entity)
- Trigger rating recalculation on review create/update/delete

## Capabilities

### New Capabilities

- `review-service`: Review CRUD with booking eligibility, duplicate prevention, and rating recalculation

### Modified Capabilities

(none)

## Impact

- New files: `app/Services/ReviewService.php`, `app/Services/RatingCalculator.php`
- Modified files: `app/Models/Hotel.php`, `app/Models/Attraction.php`, `app/Models/Driver.php`
- New migrations: add `average_rating` to hotels and attractions, add `rating` to drivers
- New tests: `tests/Feature/Api/V1/ReviewServiceTest.php`
