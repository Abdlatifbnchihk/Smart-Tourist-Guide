# Rooms

## Purpose

Stores individual room types/inventory offered by a hotel. Represents a bookable unit within a hotel (e.g. "Room 101 - Deluxe Double"). Rooms hold pricing and capacity information used by the booking engine to compute availability and price.

## Requirements

### Requirement: Room table schema
The system SHALL have a `rooms` table with columns: `room_id` (BIGINT PK auto-increment), `hotel_id` (BIGINT FK to `hotels.hotel_id`, NOT NULL), `number` (VARCHAR(20), NOT NULL), `type` (VARCHAR(50), NOT NULL), `capacity` (INT, NOT NULL), `price_per_night` (DECIMAL(10,2), NOT NULL), `available` (BOOLEAN, default true), `created_at`, `updated_at`.

#### Scenario: Table creation
- **WHEN** the migration is run
- **THEN** the `rooms` table exists with all specified columns and correct types

#### Scenario: Rollback
- **WHEN** the migration is rolled back via `down()`
- **THEN** the `rooms` table is dropped without errors

### Requirement: Room belongs to a hotel
Each room MUST be associated with exactly one hotel via `hotel_id` foreign key referencing `hotels.hotel_id`. The FK constraint SHALL use `ON DELETE CASCADE`.

#### Scenario: Create room with valid hotel
- **WHEN** a room is created with a valid `hotel_id` referencing an existing hotel
- **THEN** the room is persisted with that `hotel_id`

#### Scenario: Create room with invalid hotel
- **WHEN** a room is created with a `hotel_id` that does not exist in `hotels`
- **THEN** a database integrity constraint violation is raised

### Requirement: Room has many bookings
The `Room` model SHALL define a `hasMany` relationship to the `Booking` model via `room_id`.

#### Scenario: Query room bookings
- **WHEN** `$room->bookings` is accessed
- **THEN** a collection of `Booking` records referencing this room is returned

### Requirement: Price per night validation
The `price_per_night` column MUST be greater than 0. This SHALL be enforced at both the database level (via validation rules) and the application level.

#### Scenario: Create room with valid price
- **WHEN** a room is created with `price_per_night` of 85.00
- **THEN** the room is persisted successfully

#### Scenario: Create room with zero price
- **WHEN** a room is created with `price_per_night` of 0
- **THEN** a validation error is returned

#### Scenario: Create room with negative price
- **WHEN** a room is created with `price_per_night` of -10.00
- **THEN** a validation error is returned

### Requirement: Capacity validation
The `capacity` column MUST be at least 1. This SHALL be enforced at the application level.

#### Scenario: Create room with valid capacity
- **WHEN** a room is created with `capacity` of 2
- **THEN** the room is persisted successfully

#### Scenario: Create room with zero capacity
- **WHEN** a room is created with `capacity` of 0
- **THEN** a validation error is returned

### Requirement: Database indexes
The system SHALL create indexes on `hotel_id` and `price_per_night` columns for query performance.

#### Scenario: Index on hotel_id
- **WHEN** the migration is run
- **THEN** an index exists on the `hotel_id` column

#### Scenario: Index on price_per_night
- **WHEN** the migration is run
- **THEN** an index exists on the `price_per_night` column

### Requirement: Room model relationships
The `Room` model SHALL define `belongsTo(Hotel::class)` and `hasMany(Booking::class)` relationships.

#### Scenario: Access hotel relationship
- **WHEN** `$room->hotel` is accessed
- **THEN** the associated `Hotel` record is returned

#### Scenario: Access bookings relationship
- **WHEN** `$room->bookings` is accessed
- **THEN** a collection of associated `Booking` records is returned
