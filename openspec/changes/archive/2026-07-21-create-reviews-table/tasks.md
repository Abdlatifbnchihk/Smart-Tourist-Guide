## 1. Migration

- [x] 1.1 Create migration `create_reviews_table` with all columns: `review_id` (PK), `user_id` (FK), `hotel_id` (nullable FK), `driver_id` (nullable FK), `attraction_id` (nullable FK), `rating` (TINYINT UNSIGNED), `comment` (TEXT nullable), timestamps
- [x] 1.2 Add foreign key constraints: `user_id` → `users.user_id` (CASCADE), `hotel_id` → `hotels.hotel_id` (CASCADE), `driver_id` → `drivers.driver_id` (CASCADE), `attraction_id` → `attractions.attraction_id` (CASCADE)
- [x] 1.3 Add CHECK constraint: at least one of `hotel_id`, `driver_id`, or `attraction_id` must be NOT NULL
- [x] 1.4 Add CHECK constraint: `rating` must be between 1 and 5
- [x] 1.5 Add indexes on `user_id`, `hotel_id`, `driver_id`, `attraction_id`
- [x] 1.6 Implement `down()` method to drop the `reviews` table

## 2. Eloquent Model

- [x] 2.1 Create `Review` model in `app/Models/Review.php`
- [x] 2.2 Define `$fillable` with: `user_id`, `hotel_id`, `driver_id`, `attraction_id`, `rating`, `comment`
- [x] 2.3 Define `$casts` for `rating` as integer
- [x] 2.4 Define `belongsTo(User::class)` relationship
- [x] 2.5 Define `belongsTo(Hotel::class, foreignKey: 'hotel_id')` relationship
- [x] 2.6 Define `belongsTo(Driver::class, foreignKey: 'driver_id')` relationship
- [x] 2.7 Define `belongsTo(Attraction::class, foreignKey: 'attraction_id')` relationship

## 3. Verification

- [ ] 3.1 Run `php artisan migrate` and verify the `reviews` table is created with correct schema *(blocked: MySQL not running)*
- [ ] 3.2 Run `php artisan migrate:rollback` and verify the `down()` method works cleanly *(blocked: MySQL not running)*
- [ ] 3.3 Verify CHECK constraints prevent all-NULL FK state *(blocked: MySQL not running)*
- [ ] 3.4 Verify CHECK constraints enforce rating 1-5 range *(blocked: MySQL not running)*
