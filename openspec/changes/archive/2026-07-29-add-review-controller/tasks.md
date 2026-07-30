## 1. Form Request

- [x] 1.1 Create `StoreReviewRequest` with validation rules (rating required|integer|between:1,5, comment nullable, hotel_id/driver_id/attraction_id required_without_one)

## 2. Controller

- [x] 2.1 Create `ReviewController` in `app/Http/Controllers/Api/V1/`
- [x] 2.2 Implement `index` method with filtering by hotel_id, driver_id, attraction_id
- [x] 2.3 Implement `store` method using ReviewService create
- [x] 2.4 Implement `show` method for single review
- [x] 2.5 Implement `update` method with ownership check via ReviewService
- [x] 2.6 Implement `delete` method with ownership check via ReviewService

## 3. Resource Update

- [x] 3.1 Update `ReviewResource` to include hotel, driver, attraction relationships

## 4. Routes

- [x] 4.1 Add review routes in api.php (index, store, show, update, destroy)

## 5. Tests

- [x] 5.1 Write test for listing reviews for a hotel
- [x] 5.2 Write test for listing reviews for a driver
- [x] 5.3 Write test for listing reviews for an attraction
- [x] 5.4 Write test for creating review successfully
- [x] 5.5 Write test for creating review validation error
- [x] 5.6 Write test for getting single review
- [x] 5.7 Write test for reviewer updating own review
- [x] 5.8 Write test for non-author cannot update review
- [x] 5.9 Write test for reviewer deleting own review
- [x] 5.10 Write test for non-author cannot delete review
