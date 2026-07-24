## 1. Model Updates

- [x] 1.1 Add SoftDeletes trait to Attraction model
- [x] 1.2 Add $fillable attributes for mass assignment
- [x] 1.3 Define city() relationship (belongsTo City)
- [x] 1.4 Define reviews() relationship (hasMany Review)
- [x] 1.5 Define creator() relationship (belongsTo User)

## 2. Form Requests

- [x] 2.1 Create StoreAttractionRequest with validation rules (city_id, name, description, address, opening_hours)
- [x] 2.2 Create UpdateAttractionRequest with validation rules (unique except current)
- [x] 2.3 Add authorize() method to both requests

## 3. API Resource

- [x] 3.1 Create AttractionResource class
- [x] 3.2 Implement toArray() method with all required fields
- [x] 3.3 Add city relationship to resource
- [x] 3.4 Add reviews relationship for detail responses
- [x] 3.5 Calculate and include average_rating

## 4. Controller

- [x] 4.1 Create AttractionController in Api/V1 namespace
- [x] 4.2 Implement index() method with pagination
- [x] 4.3 Add filtering logic (city_id, category, min_price, max_price, min_rating)
- [x] 4.4 Add search logic (LIKE query on name)
- [x] 4.5 Implement store() method with slug generation
- [x] 4.6 Implement show() method with reviews eager loading
- [x] 4.7 Implement update() method with ownership check
- [x] 4.8 Implement destroy() method with soft delete and ownership check

## 5. Routes

- [x] 5.1 Add GET /api/v1/attractions route (public)
- [x] 5.2 Add POST /api/v1/attractions route (auth:sanctum, role:admin|hotel_manager)
- [x] 5.3 Add GET /api/v1/attractions/{id} route (public)
- [x] 5.4 Add PUT /api/v1/attractions/{id} route (auth:sanctum)
- [x] 5.5 Add DELETE /api/v1/attractions/{id} route (auth:sanctum)

## 6. Testing

- [ ] 6.1 Test listing attractions with pagination
- [ ] 6.2 Test filtering by city_id
- [ ] 6.3 Test filtering by multiple parameters
- [ ] 6.4 Test search by name
- [ ] 6.5 Test creating attraction as admin
- [ ] 6.6 Test creating attraction as tourist (should fail)
- [ ] 6.7 Test getting attraction detail with reviews
- [ ] 6.8 Test updating attraction as owner
- [ ] 6.9 Test updating attraction as non-owner (should fail)
- [ ] 6.10 Test soft deleting attraction
- [ ] 6.11 Test slug generation and uniqueness
