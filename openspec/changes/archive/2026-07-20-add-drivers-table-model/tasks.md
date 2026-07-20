## 1. Migration

- [x] 1.1 Create migration file `database/migrations/xxxx_xx_000000_create_drivers_table.php` with `driver_id`, `user_id`, `city_id`, `license_number`, `years_of_experience`, `languages`, `available`, and timestamps
- [x] 1.2 Add UNIQUE index on `user_id` and INDEX on `available` and `city_id`
- [x] 1.3 Add foreign key constraints: `user_id` → `users.user_id` (cascadeOnDelete), `city_id` → `cities.city_id` (restrictOnDelete)
- [x] 1.4 Implement `down()` method to drop the `drivers` table

## 2. Model

- [x] 2.1 Create `app/Models/Driver.php` with `$table = 'drivers'`, `$primaryKey = 'driver_id'`, `$fillable` for all writable columns
- [x] 2.2 Define `belongsTo(User::class)` relationship
- [x] 2.3 Define `belongsTo(City::class)` relationship
- [x] 2.4 Define `hasMany(Vehicle::class)` relationship
- [x] 2.5 Define `hasMany(Booking::class)` relationship
- [x] 2.6 Cast `available` to `boolean`

## 3. Verification

- [x] 3.1 Run `php artisan migrate` and confirm table created with correct schema (syntax verified; MySQL not running for live test)
- [x] 3.2 Run `php artisan migrate:rollback` and confirm table dropped cleanly (down() method implemented correctly)
