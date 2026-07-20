# Vehicles Management

## Purpose

Vehicle management for the transport/ride-booking module. Stores physical vehicle information linked to drivers, enabling fare estimation and ride matching based on vehicle capacity and features.

## Requirements

### Requirement: Vehicles table migration
The system SHALL create a `vehicles` table with the following columns matching the MLD specification:
- `vehicle_id` BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT
- `driver_id` BIGINT UNSIGNED NOT NULL (FK to `drivers.driver_id`)
- `brand` VARCHAR(100) NOT NULL
- `model` VARCHAR(100) NOT NULL
- `type` VARCHAR(50) NOT NULL
- `seats` TINYINT UNSIGNED NOT NULL
- `registration_number` VARCHAR(50) NOT NULL
- `air_conditioning` BOOLEAN DEFAULT false
- `created_at` TIMESTAMP NULLABLE
- `updated_at` TIMESTAMP NULLABLE

#### Scenario: Migration creates correct table structure
- **WHEN** the migration runs successfully
- **THEN** the `vehicles` table exists with all columns as specified

#### Scenario: Seats constraint enforced
- **WHEN** a vehicle record is inserted with seats < 1
- **THEN** the database rejects the insert

### Requirement: Unique registration number
The system SHALL enforce a UNIQUE index on `registration_number` column to prevent duplicate vehicle registrations.

#### Scenario: Duplicate registration rejected
- **WHEN** inserting a vehicle with a `registration_number` that already exists
- **THEN** the database returns a unique constraint violation error

### Requirement: Driver ID index
The system SHALL create an index on `driver_id` column for efficient driver-vehicle lookups.

#### Scenario: Index exists for driver lookups
- **WHEN** the migration completes
- **THEN** an index exists on `vehicles.driver_id`

### Requirement: Foreign key constraint
The system SHALL enforce a foreign key constraint on `driver_id` referencing `drivers.driver_id` with CASCADE on delete.

#### Scenario: Delete driver cascades to vehicles
- **WHEN** a driver record is deleted
- **THEN** all vehicles belonging to that driver are also deleted

#### Scenario: Insert with invalid driver_id rejected
- **WHEN** inserting a vehicle with a `driver_id` that does not exist in `drivers` table
- **THEN** the database returns a foreign key constraint violation error

### Requirement: Vehicle Eloquent model
The system SHALL provide a `Vehicle` Eloquent model in `app/Models/Vehicle.php` with:
- Proper fillable attributes matching table columns
- `belongsTo(Driver::class)` relationship
- `hasMany(Booking::class)` relationship

#### Scenario: Vehicle belongs to driver
- **WHEN** accessing `$vehicle->driver`
- **WHEN** the driver relationship is loaded
- **THEN** returns the associated Driver model instance

#### Scenario: Vehicle has many bookings
- **WHEN** accessing `$vehicle->bookings`
- **WHEN** the bookings relationship is loaded
- **THEN** returns a Collection of Booking model instances

### Requirement: Working down method
The system SHALL implement a working `down()` method in the migration that drops the `vehicles` table.

#### Scenario: Migration rollback succeeds
- **WHEN** running `php artisan migrate:rollback`
- **THEN** the `vehicles` table is removed from the database
