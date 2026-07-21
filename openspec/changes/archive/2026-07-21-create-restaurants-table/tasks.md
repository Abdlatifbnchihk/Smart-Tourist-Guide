## 1. Database Migration

- [x] 1.1 Create `restaurants` table migration with columns: `restaurant_id`, `city_id`, `name`, `description`, `address`, `cuisine`, `phone`, `price_range`, `timestamps`
- [x] 1.2 Add foreign key constraint on `city_id` referencing `cities.city_id` with restrict on delete
- [x] 1.3 Add index on `city_id`
- [x] 1.4 Ensure `down()` method drops the table correctly

## 2. Model & Relationships

- [x] 2.1 Create `Restaurant` model with fillable attributes (all columns except timestamps)
- [x] 2.2 Add `belongsTo(City::class)` relationship
- [x] 2.3 Add cast for `price_range` to integer

## 3. API Resources

- [x] 3.1 Create `RestaurantResource` with MLD-aligned fields
- [x] 3.2 Include conditional city relationship loading

## 4. Controllers

- [x] 4.1 Create `RestaurantController` with standard apiResource methods
- [x] 4.2 Implement `index()` method returning restaurant list
- [x] 4.3 Implement `store()` method with validation
- [x] 4.4 Implement `show()` method returning restaurant with city
- [x] 4.5 Implement `update()` method with validation
- [x] 4.6 Implement `destroy()` method

## 5. Routes

- [x] 5.1 Add restaurant apiResource routes to `routes/api.php`

## 6. Validation

- [x] 6.1 Add validation rules for restaurant fields (city_id required, name required, etc.)
- [x] 6.2 Add `price_range` validation: `nullable|integer|between:1,4`

## 7. Testing & Verification

- [ ] 7.1 Test `GET /api/v1/restaurants` returns list of restaurants
- [ ] 7.2 Test `GET /api/v1/restaurants/{id}` returns restaurant with city relationship
- [ ] 7.3 Test `POST /api/v1/restaurants` validates required fields and price_range
- [ ] 7.4 Test `PUT /api/v1/restaurants/{id}` validates fields and price_range
- [ ] 7.5 Verify migration rolls back correctly with `down()` method