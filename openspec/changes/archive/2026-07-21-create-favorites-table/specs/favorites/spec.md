## ADDED Requirements

### Requirement: Favorites table schema
The favorites table SHALL contain the following columns matching the MLD design:
- `favorite_id` BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT
- `user_id` BIGINT UNSIGNED NOT NULL (FK to users.user_id)
- `hotel_id` BIGINT UNSIGNED NULLABLE (FK to hotels.hotel_id)
- `restaurant_id` BIGINT UNSIGNED NULLABLE (FK to restaurants.restaurant_id)
- `attraction_id` BIGINT UNSIGNED NULLABLE (FK to attractions.attraction_id)
- `created_at` TIMESTAMP NULLABLE
- `updated_at` TIMESTAMP NULLABLE

#### Scenario: Table created with correct columns
- **WHEN** the migration runs
- **THEN** the favorites table SHALL exist with all specified columns

#### Scenario: Migration rolls back cleanly
- **WHEN** the migration runs down
- **THEN** the favorites table is dropped without errors

### Requirement: At least one entity FK required
The favorites table SHALL enforce that at least one of `hotel_id`, `restaurant_id`, or `attraction_id` is NOT NULL via a CHECK constraint.

#### Scenario: Favorite with hotel_id set
- **WHEN** a favorite has `hotel_id = 1` and `restaurant_id = NULL` and `attraction_id = NULL`
- **THEN** the record is saved successfully

#### Scenario: Favorite with restaurant_id set
- **WHEN** a favorite has `hotel_id = NULL` and `restaurant_id = 2` and `attraction_id = NULL`
- **THEN** the record is saved successfully

#### Scenario: Favorite with attraction_id set
- **WHEN** a favorite has `hotel_id = NULL` and `restaurant_id = NULL` and `attraction_id = 3`
- **THEN** the record is saved successfully

#### Scenario: Favorite with no entity FK rejected
- **WHEN** a favorite has `hotel_id = NULL` and `restaurant_id = NULL` and `attraction_id = NULL`
- **THEN** the database throws a check constraint violation

### Requirement: Partial unique index on user and hotel
The favorites table SHALL enforce a unique constraint on `(user_id, hotel_id)` where `hotel_id IS NOT NULL` to prevent duplicate hotel favorites per user.

#### Scenario: Duplicate hotel favorite rejected
- **WHEN** a user attempts to favorite the same hotel twice
- **THEN** the database throws a unique constraint violation

#### Scenario: Same hotel favorite by different users allowed
- **WHEN** two different users favorite the same hotel
- **THEN** both records are saved successfully

### Requirement: Partial unique index on user and restaurant
The favorites table SHALL enforce a unique constraint on `(user_id, restaurant_id)` where `restaurant_id IS NOT NULL` to prevent duplicate restaurant favorites per user.

#### Scenario: Duplicate restaurant favorite rejected
- **WHEN** a user attempts to favorite the same restaurant twice
- **THEN** the database throws a unique constraint violation

### Requirement: Partial unique index on user and attraction
The favorites table SHALL enforce a unique constraint on `(user_id, attraction_id)` where `attraction_id IS NOT NULL` to prevent duplicate attraction favorites per user.

#### Scenario: Duplicate attraction favorite rejected
- **WHEN** a user attempts to favorite the same attraction twice
- **THEN** the database throws a unique constraint violation

### Requirement: User foreign key constraint
The favorites table SHALL have a foreign key constraint on `user_id` referencing `users.user_id` with CASCADE on delete.

#### Scenario: User deletion cascades to favorites
- **WHEN** a user with favorites is deleted
- **THEN** all associated favorites are also deleted

### Requirement: Hotel foreign key constraint
The favorites table SHALL have a foreign key constraint on `hotel_id` referencing `hotels.hotel_id` with CASCADE on delete.

#### Scenario: Hotel deletion cascades to favorites
- **WHEN** a hotel with favorites is deleted
- **THEN** all associated favorites are also deleted

### Requirement: Restaurant foreign key constraint
The favorites table SHALL have a foreign key constraint on `restaurant_id` referencing `restaurants.restaurant_id` with CASCADE on delete.

#### Scenario: Restaurant deletion cascades to favorites
- **WHEN** a restaurant with favorites is deleted
- **THEN** all associated favorites are also deleted

### Requirement: Attraction foreign key constraint
The favorites table SHALL have a foreign key constraint on `attraction_id` referencing `attractions.attraction_id` with CASCADE on delete.

#### Scenario: Attraction deletion cascades to favorites
- **WHEN** an attraction with favorites is deleted
- **THEN** all associated favorites are also deleted

### Requirement: Indexes on all foreign keys
The favorites table SHALL have indexes on `user_id`, `hotel_id`, `restaurant_id`, and `attraction_id` for query performance.

#### Scenario: Indexes exist on all FK columns
- **WHEN** querying favorites by user, hotel, restaurant, or attraction
- **THEN** the queries use the respective indexes

### Requirement: Favorite model relationships
The Favorite Eloquent model SHALL define:
- `belongsTo(User::class)` relationship
- `belongsTo(Hotel::class, foreignKey: 'hotel_id')` relationship
- `belongsTo(Restaurant::class, foreignKey: 'restaurant_id')` relationship
- `belongsTo(Attraction::class, foreignKey: 'attraction_id')` relationship

#### Scenario: Favorite belongs to user
- **WHEN** accessing `$favorite->user`
- **THEN** returns the related User model

#### Scenario: Favorite belongs to hotel
- **WHEN** accessing `$favorite->hotel`
- **THEN** returns the related Hotel model or null

#### Scenario: Favorite belongs to restaurant
- **WHEN** accessing `$favorite->restaurant`
- **THEN** returns the related Restaurant model or null

#### Scenario: Favorite belongs to attraction
- **WHEN** accessing `$favorite->attraction`
- **THEN** returns the related Attraction model or null

### Requirement: No polymorphic relationships
The Favorite model SHALL NOT use `MorphMap`, `MorphMany`, or `MorphTo` relationships. Only explicit `belongsTo` relationships with FK columns are permitted.

#### Scenario: No morph map registration
- **WHEN** the Favorite model is loaded
- **THEN** no polymorphic relationships are defined

### Requirement: Working down() method
The migration `down()` method SHALL drop the `favorites` table cleanly.

#### Scenario: Rollback removes table
- **WHEN** `php artisan migrate:rollback` is run
- **THEN** the `favorites` table no longer exists
