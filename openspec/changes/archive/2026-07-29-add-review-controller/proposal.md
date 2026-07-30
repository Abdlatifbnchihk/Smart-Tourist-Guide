## Why

The ReviewService exists but there's no controller to expose the review endpoints via API. Tourists need to create, view, update, and delete reviews for hotels, attractions, and drivers after completing bookings.

## What Changes

- Create ReviewController with index, store, show, update, delete endpoints
- Create StoreReviewRequest for validation
- Update ReviewResource to include reviewable morph relationships
- Add routes for review endpoints
- Add tests for all endpoints

## Capabilities

### New Capabilities

(none - extending existing review-service capability)

### Modified Capabilities

- `review-service`: Add controller layer for HTTP API access

## Impact

- New files: `app/Http/Controllers/Api/V1/ReviewController.php`, `app/Http/Requests/StoreReviewRequest.php`
- Modified file: `app/Http/Resources/ReviewResource.php`, `routes/api.php`
- New tests: `tests/Feature/Api/V1/ReviewControllerTest.php`
