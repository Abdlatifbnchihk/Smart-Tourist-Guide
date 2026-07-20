## 1. Database Migration

- [x] 1.1 Create migration file `create_vehicles_table.php` in `database/migrations/`
- [x] 1.2 Define `vehicle_id` as `bigIncrements('vehicle_id')`
- [x] 1.3 Define `driver_id` as `foreignId('driver_id')->constrained('drivers', 'driver_id')->cascadeOnDelete()`
- [x] 1.4 Define `brand` as `string('brand', 100)`
- [x] 1.5 Define `model` as `string('model', 100)`
- [x] 1.6 Define `type` as `string('type', 50)`
- [x] 1.7 Define `seats` as `unsignedTinyInteger('seats')`
- [x] 1.8 Define `registration_number` as `string('registration_number', 50)->unique()`
- [x] 1.9 Define `air_conditioning` as `boolean('air_conditioning')->default(false)`
- [x] 1.10 Add timestamps (`created_at`, `updated_at`) as nullable
- [x] 1.11 Add index on `driver_id`
- [x] 1.12 Implement working `down()` method to drop table

## 2. Eloquent Model

- [x] 2.1 Create `app/Models/Vehicle.php` model class
- [x] 2.2 Define `$fillable` array with all mass-assignable attributes
- [x] 2.3 Define `$primaryKey = 'vehicle_id'`
- [x] 2.4 Define `$incrementing = true`
- [x] 2.5 Implement `driver()` relationship: `belongsTo(Driver::class)`
- [x] 2.6 Implement `bookings()` relationship: `hasMany(Booking::class)`

## 3. Verification

- [x] 3.1 Run migration with `php artisan migrate`
- [x] 3.2 Verify table structure matches MLD specification
- [x] 3.3 Test rollback with `php artisan migrate:rollback`
