## ADDED Requirements

### Requirement: Reviews table schema
The reviews table SHALL contain the following columns matching the MLD design:
- `review_id` BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT
- `user_id` BIGINT UNSIGNED NOT NULL (FK to users.user_id)
- `hotel_id` BIGINT UNSIGNED NULLABLE (FK to hotels.hotel_id)
- `driver_id` BIGINT UNSIGNED NULLABLE (FK to drivers.driver_id)
- `attraction_id` BIGINT UNSIGNED NULLABLE (FK to attractions.attraction_id)
- `rating` TINYINT UNSIGNED NOT NULL
- `comment` TEXT NULLABLE
- `created_at` TIMESTAMP NULLABLE
- `updated_at` TIMESTAMP NULLABLE

#### Scenario: Table created with correct columns
- **WHEN** the migration runs
- **THEN** the reviews table SHALL exist with all specified columns

#### Scenario: Migration rolls back cleanly
- **WHEN** the migration runs down
- **THEN** the reviews table is dropped without errors

### Requirement: At least one entity FK required
The reviews table SHALL enforce that at least one of `hotel_id`, `driver_id`, or `attraction_id` is NOT NULL via a CHECK constraint.

#### Scenario: Review with hotel_id set
- **WHEN** a review has `hotel_id = 1` and `driver_id = NULL` and `attraction_id = NULL`
- **THEN** the record is saved successfully

#### Scenario: Review with driver_id set
- **WHEN** a review has `hotel_id = NULL` and `driver_id = 2` and `attraction_id = NULL`
- **THEN** the record is saved successfully

#### Scenario: Review with attraction_id set
- **WHEN** a review has `hotel_id = NULL` and `driver_id = NULL` and `attraction_id = 3`
- **THEN** the record is saved successfully

#### Scenario: Review with no entity FK rejected
- **WHEN** a review has `hotel_id = NULL` and `driver_id = NULL` and `attraction_id = NULL`
- **THEN** the database throws a check constraint violation

### Requirement: Rating range validation
The reviews table SHALL enforce that `rating` values are between 1 and 5 inclusive.

#### Scenario: Valid rating saved
- **WHEN** a review has `rating = 3`
- **THEN** the record is saved successfully

#### Scenario: Rating below range rejected
- **WHEN** a review has `rating = 0`
- **THEN** the validation fails

#### Scenario: Rating above range rejected
- **WHEN** a review has `rating = 6`
- **THEN** the validation fails

### Requirement: User foreign key constraint
The reviews table SHALL have a foreign key constraint on `user_id` referencing `users.user_id` with CASCADE on delete.

#### Scenario: User deletion cascades to reviews
- **WHEN** a user with reviews is deleted
- **THEN** all associated reviews are also deleted

### Requirement: Hotel foreign key constraint
The reviews table SHALL have a foreign key constraint on `hotel_id` referencing `hotels.hotel_id` with CASCADE on delete.

#### Scenario: Hotel deletion cascades to reviews
- **WHEN** a hotel with reviews is deleted
- **THEN** all associated reviews are also deleted

### Requirement: Driver foreign key constraint
The reviews table SHALL have a foreign key constraint on `driver_id` referencing `drivers.driver_id` with CASCADE on delete.

#### Scenario: Driver deletion cascades to reviews
- **WHEN** a driver with reviews is deleted
- **THEN** all associated reviews are also deleted

### Requirement: Attraction foreign key constraint
The reviews table SHALL have a foreign key constraint on `attraction_id` referencing `attractions.attraction_id` with CASCADE on delete.

#### Scenario: Attraction deletion cascades to reviews
- **WHEN** an attraction with reviews is deleted
- **THEN** all associated reviews are also deleted

### Requirement: Indexes on all foreign keys
The reviews table SHALL have indexes on `user_id`, `hotel_id`, `driver_id`, and `attraction_id` for query performance.

#### Scenario: Indexes exist on all FK columns
- **WHEN** querying reviews by user, hotel, driver, or attraction
- **THEN** the queries use the respective indexes

### Requirement: Review model relationships
The Review Eloquent model SHALL define:
- `belongsTo(User::class)` relationship
- `belongsTo(Hotel::class, foreignKey: 'hotel_id')` relationship
- `belongsTo(Driver::class, foreignKey: 'driver_id')` relationship
- `belongsTo(Attraction::class, foreignKey: 'attraction_id')` relationship

#### Scenario: Review belongs to user
- **WHEN** accessing `$review->user`
- **THEN** returns the related User model

#### Scenario: Review belongs to hotel
- **WHEN** accessing `$review->hotel`
- **THEN** returns the related Hotel model or null

#### Scenario: Review belongs to driver
- **WHEN** accessing `$review->driver`
- **THEN** returns the related Driver model or null

#### Scenario: Review belongs to attraction
- **WHEN** accessing `$review->attraction`
- **THEN** returns the related Attraction model or null

### Requirement: No polymorphic relationships
The Review model SHALL NOT use `MorphMap`, `MorphMany`, or `MorphTo` relationships. Only explicit `belongsTo` relationships with FK columns are permitted.

#### Scenario: No morph map registration
- **WHEN** the Review model is loaded
- **THEN** no polymorphic relationships are defined

### Requirement: Working down() method
The migration `down()` method SHALL drop the `reviews` table cleanly.

#### Scenario: Rollback removes table
- **WHEN** `php artisan migrate:rollback` is run
- **THEN** the `reviews` table no longer exists
