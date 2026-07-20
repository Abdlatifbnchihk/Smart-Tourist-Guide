## ADDED Requirements

### Requirement: Hotels table schema
The hotels table SHALL contain the following columns matching the MLD design:
- `hotel_id` BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT
- `city_id` BIGINT UNSIGNED NOT NULL (FK to cities.city_id)
- `name` VARCHAR(150) NOT NULL
- `address` VARCHAR(255) NOT NULL
- `phone` VARCHAR(20) NULLABLE
- `email` VARCHAR(150) NULLABLE
- `description` TEXT NULLABLE
- `stars` TINYINT UNSIGNED NULLABLE
- `created_at` TIMESTAMP NULLABLE
- `updated_at` TIMESTAMP NULLABLE

#### Scenario: Table created with correct columns
- **WHEN** the migration runs
- **THEN** the hotels table SHALL exist with all specified columns

### Requirement: City foreign key
The hotels table SHALL have a foreign key constraint on `city_id` referencing `cities.city_id` with RESTRICT on delete.

#### Scenario: Foreign key constraint enforced
- **WHEN** a hotel is linked to a city
- **THEN** the city cannot be deleted while hotels reference it

### Requirement: City ID index
The hotels table SHALL have an index on `city_id` for query performance.

#### Scenario: Index exists
- **WHEN** querying hotels by city
- **THEN** the query uses the index on city_id

### Requirement: Star rating validation
The hotels table SHALL enforce that `stars` values are between 1 and 5 when provided.

#### Scenario: Valid star rating
- **WHEN** a hotel has stars = 4
- **THEN** the record is saved successfully

#### Scenario: Invalid star rating rejected
- **WHEN** a hotel has stars = 6 or stars = 0
- **THEN** the validation fails

### Requirement: Hotel model relationships
The Hotel Eloquent model SHALL define:
- `belongsTo(City::class)` relationship
- `hasMany(Room::class)` relationship
- `hasMany(Review::class)` relationship
- `hasMany(Favorite::class)` relationship

#### Scenario: Belongs to city
- **WHEN** accessing `$hotel->city`
- **THEN** returns the related City model

#### Scenario: Has many rooms
- **WHEN** accessing `$hotel->rooms`
- **THEN** returns a Collection of Room models

#### Scenario: Has many reviews
- **WHEN** accessing `$hotel->reviews`
- **THEN** returns a Collection of Review models

#### Scenario: Has many favorites
- **WHEN** accessing `$hotel->favorites`
- **THEN** returns a Collection of Favorite models
