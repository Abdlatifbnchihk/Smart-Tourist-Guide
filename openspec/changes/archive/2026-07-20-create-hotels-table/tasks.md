## 1. Migration

- [x] 1.1 Create migration file for hotels table with all MLD columns
- [x] 1.2 Add foreign key constraint on city_id to cities.city_id (RESTRICT on delete)
- [x] 1.3 Add index on city_id column

## 2. Model

- [x] 2.1 Create Hotel Eloquent model
- [x] 2.2 Define belongsTo(City::class) relationship
- [x] 2.3 Define hasMany(Room::class) relationship
- [x] 2.4 Define hasMany(Review::class) relationship
- [x] 2.5 Define hasMany(Favorite::class) relationship

## 3. Verification

- [x] 3.1 Run migration to verify schema compiles
- [x] 3.2 Verify all columns match MLD exactly
- [x] 3.3 Verify star rating validation (1-5)
