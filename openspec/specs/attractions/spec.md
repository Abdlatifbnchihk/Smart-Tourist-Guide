## Purpose

Tourist attractions catalog entity (monuments, museums, natural sites, activities) for the Smart Tourist Guide Morocco platform. Each attraction belongs to a city and can be reviewed and favorited by tourists.

## Requirements

### Requirement: Attractions table schema
The attractions table SHALL contain the following columns matching the MLD design:
- `attraction_id` BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT
- `city_id` BIGINT UNSIGNED NOT NULL (FK to cities.city_id)
- `name` VARCHAR(150) NOT NULL
- `description` TEXT NULLABLE
- `address` VARCHAR(255) NULLABLE
- `opening_hours` VARCHAR(100) NULLABLE
- `created_at` TIMESTAMP NULLABLE
- `updated_at` TIMESTAMP NULLABLE

#### Scenario: Table created with correct columns
- **WHEN** the migration runs
- **THEN** the attractions table SHALL exist with all specified columns

### Requirement: City foreign key
The attractions table SHALL have a foreign key constraint on `city_id` referencing `cities.city_id` with RESTRICT on delete.

#### Scenario: Foreign key constraint enforced
- **WHEN** an attraction is linked to a city
- **THEN** the city cannot be deleted while attractions reference it

### Requirement: City ID index
The attractions table SHALL have an index on `city_id` for query performance.

#### Scenario: Index exists
- **WHEN** querying attractions by city
- **THEN** the query uses the index on city_id

### Requirement: Attraction model relationships
The Attraction Eloquent model SHALL define:
- `belongsTo(City::class)` relationship
- `hasMany(Review::class)` relationship
- `hasMany(Favorite::class)` relationship

#### Scenario: Belongs to city
- **WHEN** accessing `$attraction->city`
- **THEN** returns the related City model

#### Scenario: Has many reviews
- **WHEN** accessing `$attraction->reviews`
- **THEN** returns a Collection of Review models

#### Scenario: Has many favorites
- **WHEN** accessing `$attraction->favorites`
- **THEN** returns a Collection of Favorite models
