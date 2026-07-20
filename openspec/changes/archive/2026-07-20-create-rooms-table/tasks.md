## 1. Database Migration

- [x] 1.1 Create the `rooms` migration file with `room_id` (bigIncrements), `hotel_id` (foreignId constrained to `hotels`), `number` (string, max 20), `type` (string, max 50), `capacity` (integer), `price_per_night` (decimal 10,2), `available` (boolean, default true), and timestamps
- [x] 1.2 Add index on `hotel_id` column
- [x] 1.3 Add index on `price_per_night` column
- [x] 1.4 Implement `down()` method to drop the `rooms` table
- [x] 1.5 Run `php artisan migrate` to verify the migration executes without errors
- [x] 1.6 Run `php artisan migrate:rollback` to verify the `down()` method works

## 2. Eloquent Model

- [x] 2.1 Create `App\Models\Room` model with `$primaryKey = 'room_id'`, `$fillable` for all columns, and `$casts` for `available` (boolean) and `price_per_night` (decimal:2)
- [x] 2.2 Define `hotel()` relationship: `belongsTo(Hotel::class)`
- [x] 2.3 Define `bookings()` relationship: `hasMany(Booking::class)`
- [x] 2.4 Add validation rules: `price_per_night` must be > 0, `capacity` must be >= 1
