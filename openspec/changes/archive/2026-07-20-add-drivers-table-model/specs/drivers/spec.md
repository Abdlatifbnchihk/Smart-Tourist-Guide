## ADDED Requirements

### Requirement: Drivers migration matches MLD schema
The system SHALL create a `drivers` migration with columns matching `docs/database.md` exactly: `driver_id` (PK, BIGINT auto-increment), `user_id` (FK to users.user_id, UNIQUE NOT NULL), `city_id` (FK, BIGINT), `license_number` (VARCHAR(20) NOT NULL), `years_of_experience` (TINYINT UNSIGNED NULLABLE), `languages` (VARCHAR(255) NULLABLE), `available` (BOOLEAN DEFAULT true), and timestamps.

#### Scenario: Migration creates correct columns
- **WHEN** the migration runs up
- **THEN** the `drivers` table exists with all MLD-specified columns, types, and defaults

#### Scenario: Migration rolls back cleanly
- **WHEN** the migration runs down
- **THEN** the `drivers` table is dropped without errors

### Requirement: UNIQUE index on user_id
The system SHALL enforce a UNIQUE index on `user_id` to ensure one-to-one mapping between users and driver profiles.

#### Scenario: Duplicate user_id rejected
- **WHEN** an insert attempts to create a second driver record for the same `user_id`
- **THEN** the database throws a unique constraint violation

### Requirement: Index on available column
The system SHALL create an INDEX on the `available` column for efficient ride-matching queries.

#### Scenario: Available drivers queried efficiently
- **WHEN** a query filters drivers by `available = true`
- **THEN** the query uses the index on `available`

### Requirement: Driver model defines all relationships
The `Driver` model SHALL define `belongsTo(User::class)`, `belongsTo(City::class)`, `hasMany(Vehicle::class)`, and `hasMany(Booking::class)`.

#### Scenario: Driver belongs to a user
- **WHEN** `$driver->user` is accessed
- **THEN** the related `User` model is returned

#### Scenario: Driver belongs to a city
- **WHEN** `$driver->city` is accessed
- **THEN** the related `City` model is returned

#### Scenario: Driver has many vehicles
- **WHEN** `$driver->vehicles` is accessed
- **THEN** a collection of related `Vehicle` models is returned

#### Scenario: Driver has many bookings
- **WHEN** `$driver->bookings` is accessed
- **THEN** a collection of related `Booking` models is returned

### Requirement: Foreign key constraints match relationship table
The system SHALL apply `cascadeOnDelete` on `user_id` FK and `restrictOnDelete` on `city_id` FK per the MLD relationship table.

#### Scenario: Deleting a user cascades to driver
- **WHEN** a user with a driver profile is deleted
- **THEN** the associated driver record is also deleted

#### Scenario: Deleting a city with drivers is restricted
- **WHEN** an attempt is made to delete a city that has associated drivers
- **THEN** the database throws a foreign key constraint violation

### Requirement: Working down() method
The migration `down()` method SHALL drop the `drivers` table cleanly.

#### Scenario: Rollback removes table
- **WHEN** `php artisan migrate:rollback` is run
- **THEN** the `drivers` table no longer exists
