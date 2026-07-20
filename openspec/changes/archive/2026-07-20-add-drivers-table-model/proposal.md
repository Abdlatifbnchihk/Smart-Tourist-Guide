## Why

The platform requires a drivers table and Eloquent model to support the transport/ride-booking module. The `docs/database.md` MLD defines the `drivers` table schema, but no migration or model exists yet. This is a foundational building block — vehicles, bookings, and reviews all depend on the driver entity.

## What Changes

- Add a new `drivers` migration with all MLD-defined columns, indexes, and foreign keys
- Create the `Driver` Eloquent model with `belongsTo` and `hasMany` relationships
- Establish UNIQUE index on `user_id` and index on `available`

## Capabilities

### New Capabilities
- `drivers`: Driver profile management — migration, model, and relationships for the transport domain

### Modified Capabilities

## Impact

- New file: `database/migrations/xxxx_xx_xx_000000_create_drivers_table.php`
- New file: `app/Models/Driver.php`
- Foreign key references: `users.user_id`, `cities.city_id`
- Referenced by future: `vehicles`, `bookings`, `reviews` tables
