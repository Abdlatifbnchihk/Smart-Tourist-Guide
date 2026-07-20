## 1. Migration

- [x] 1.1 Create migration `create_favorites_table` with all columns: `favorite_id` (PK), `user_id` (FK), `hotel_id` (nullable FK), `restaurant_id` (nullable FK), `attraction_id` (nullable FK), timestamps
- [x] 1.2 Add foreign key constraints: `user_id` → `users.user_id` (CASCADE), `hotel_id` → `hotels.hotel_id` (CASCADE), `restaurant_id` → `restaurants.restaurant_id` (CASCADE), `attraction_id` → `attractions.attraction_id` (CASCADE)
- [x] 1.3 Add CHECK constraint: at least one of `hotel_id`, `restaurant_id`, or `attraction_id` must be NOT NULL
- [x] 1.4 Add partial unique indexes: `(user_id, hotel_id) WHERE hotel_id IS NOT NULL`, `(user_id, restaurant_id) WHERE restaurant_id IS NOT NULL`, `(user_id, attraction_id) WHERE attraction_id IS NOT NULL`
- [x] 1.5 Add indexes on `user_id`, `hotel_id`, `restaurant_id`, `attraction_id`
- [x] 1.6 Implement `down()` method to drop the `favorites` table

## 2. Eloquent Model

- [x] 2.1 Create `Favorite` model in `app/Models/Favorite.php`
- [x] 2.2 Define `$fillable` with: `user_id`, `hotel_id`, `restaurant_id`, `attraction_id`
- [x] 2.3 Define `belongsTo(User::class)` relationship
- [x] 2.4 Define `belongsTo(Hotel::class, foreignKey: 'hotel_id')` relationship
- [x] 2.5 Define `belongsTo(Restaurant::class, foreignKey: 'restaurant_id')` relationship
- [x] 2.6 Define `belongsTo(Attraction::class, foreignKey: 'attraction_id')` relationship

## 3. Verification

- [ ] 3.1 Run `php artisan migrate` and verify the `favorites` table is created with correct schema *(blocked: MySQL not running)*
- [ ] 3.2 Run `php artisan migrate:rollback` and verify the `down()` method works cleanly *(blocked: MySQL not running)*
- [ ] 3.3 Verify CHECK constraints prevent all-NULL FK state *(blocked: MySQL not running)*
- [ ] 3.4 Verify partial unique indexes prevent duplicate favorites per entity type *(blocked: MySQL not running)*
