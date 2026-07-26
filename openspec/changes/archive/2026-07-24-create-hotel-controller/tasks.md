## 1. Model Updates

- [x] 1.1 Add SoftDeletes trait to Hotel model
- [x] 1.2 Add owner() relationship to Hotel model

## 2. Form Requests

- [x] 2.1 Create StoreHotelRequest with validation rules
- [x] 2.2 Create UpdateHotelRequest with validation rules

## 3. API Resources

- [x] 3.1 Create HotelResource with city, rooms, reviews, average_rating

## 4. Controller Implementation

- [x] 4.1 Create HotelController with index method (filtering, search, pagination)
- [x] 4.2 Add store method with ownership validation
- [x] 4.3 Add show method with relationships eager loading
- [x] 4.4 Add update method with ownership validation
- [x] 4.5 Add destroy method with ownership validation and soft delete

## 5. Routes

- [x] 5.1 Add hotel routes to api.php with proper middleware

## 6. Verification (requires running MySQL database)

- [ ] 6.1 Test creating hotel with valid data
- [ ] 6.2 Test filtering hotels by city, stars, price range
- [ ] 6.3 Test searching hotels by name
- [ ] 6.4 Test ownership validation on update
- [ ] 6.5 Test ownership validation on delete
