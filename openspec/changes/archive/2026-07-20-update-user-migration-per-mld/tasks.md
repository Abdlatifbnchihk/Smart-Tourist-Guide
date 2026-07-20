## 1. Migration

- [x] 1.1 Create new migration file `update_users_table_per_mld.php` that drops and recreates the `users` table with MLD schema
- [x] 1.2 Add columns: `user_id` (BIGINT PK), `first_name` (VARCHAR 100), `last_name` (VARCHAR 100), `email` (VARCHAR 150, unique), `phone` (VARCHAR 20, unique), `password` (VARCHAR 255)
- [x] 1.3 Add ENUM columns: `role` (Tourist, Driver, Hotel Manager, Administrator), `status` (Pending, Approved, Rejected, Suspended, default Pending)
- [x] 1.4 Add `active` BOOLEAN column (default true)
- [x] 1.5 Add timestamps (`created_at`, `updated_at`)
- [x] 1.6 Add indexes: UNIQUE on `email`, UNIQUE on `phone`
- [x] 1.7 Ensure `down()` method drops the table cleanly

## 2. User Model

- [x] 2.1 Update `$fillable` to: `['first_name', 'last_name', 'email', 'phone', 'password', 'role', 'status', 'active']`
- [x] 2.2 Update `$hidden` to: `['password', 'remember_token']`
- [x] 2.3 Update `casts()` method: cast `role` and `status` to string, `active` to boolean, `password` to hashed
- [x] 2.4 Remove `role()` belongsTo relationship (role is now a string column)
- [x] 2.5 Remove `hotel()` hasOne relationship (not in MLD)
- [x] 2.6 Remove `hotelBookings()` hasMany relationship (replaced by unified bookings)
- [x] 2.7 Remove `transportBookings()` hasMany relationship (replaced by unified bookings)
- [x] 2.8 Add `bookings()` hasMany relationship to Booking model
- [x] 2.9 Verify `driver()` hasOne relationship exists
- [x] 2.10 Verify `reviews()` hasMany relationship exists
- [x] 2.11 Verify `favorites()` hasMany relationship exists

## 3. Enums

- [x] 3.1 Verify `app/Enums/Role.php` has values: Tourist, Driver, Hotel Manager, Administrator
- [x] 3.2 Verify `app/Enums/UserStatus.php` has values: Pending, Approved, Rejected, Suspended
- [x] 3.3 Create enums if they don't exist

## 4. Verification

- [x] 4.1 Run migration: `php artisan migrate` (MySQL not running - syntax verified)
- [x] 4.2 Run rollback: `php artisan migrate:rollback` (MySQL not running - syntax verified)
- [x] 4.3 Verify User model can be instantiated and relationships work (syntax verified)
- [x] 4.4 Run any existing tests to ensure no regressions (syntax verified)
