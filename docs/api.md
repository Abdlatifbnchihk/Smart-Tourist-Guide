# 🗄️ Database Design — Smart Tourist Guide Morocco

> Complete relational schema documentation for the Smart Tourist Guide Morocco platform. This document is the source of truth for all database tables, relationships, business rules, and Laravel ORM mappings.

---

## 📑 Table of Contents

1. [Overview](#overview)
2. [Entity Relationship Diagram](#entity-relationship-diagram)
3. [Relationship Table](#relationship-table)
4. [Table Documentation](#table-documentation)
   - [users](#users)
   - [cities](#cities)
   - [drivers](#drivers)
   - [vehicles](#vehicles)
   - [hotels](#hotels)
   - [rooms](#rooms)
   - [restaurants](#restaurants)
   - [attractions](#attractions)
   - [bookings](#bookings)
   - [reviews](#reviews)
   - [favorites](#favorites)
5. [Indexing Strategy](#indexing-strategy)

---

## Overview

The database is designed for a **multi-role tourism platform** covering three core domains:

| Domain | Tables |
|---|---|
| **Identity & Access** | `users` |
| **Catalog** | `cities`, `hotels`, `rooms`, `restaurants`, `attractions`, `drivers`, `vehicles` |
| **Transactions** | `bookings` |
| **Engagement** | `reviews`, `favorites` |

Engine: **MySQL 8.0** (InnoDB), charset `utf8mb4`, collation `utf8mb4_unicode_ci`.
All primary keys are unsigned `BIGINT` auto-increment (Laravel default `id()`).
All tables use Laravel's standard `created_at` / `updated_at` timestamps, and `hotels`/`rooms`/`attractions` additionally support soft deletes (`deleted_at`).

---

## Entity Relationship Diagram

```mermaid
erDiagram
    USERS ||--o| DRIVERS : "has driver profile"
    USERS ||--o{ BOOKINGS : "makes"
    USERS ||--o{ REVIEWS : "writes"
    USERS ||--o{ FAVORITES : "saves"

    CITIES ||--o{ HOTELS : "contains"
    CITIES ||--o{ RESTAURANTS : "contains"
    CITIES ||--o{ ATTRACTIONS : "contains"
    CITIES ||--o{ DRIVERS : "operates in"

    HOTELS ||--o{ ROOMS : "has many"
    DRIVERS ||--o{ VEHICLES : "owns"

    BOOKINGS }o--|| USERS : "belongs to"
    BOOKINGS }o--o| ROOMS : "optionally reserves"
    BOOKINGS }o--o| DRIVERS : "optionally assigns"

    REVIEWS }o--|| USERS : "written by"
    REVIEWS }o--o| HOTELS : "about hotel"
    REVIEWS }o--o| DRIVERS : "about driver"
    REVIEWS }o--o| ATTRACTIONS : "about attraction"

    FAVORITES }o--|| USERS : "saved by"
    FAVORITES }o--o| HOTELS : "hotel"
    FAVORITES }o--o| RESTAURANTS : "restaurant"
    FAVORITES }o--o| ATTRACTIONS : "attraction"

    USERS {
        bigint user_id PK
        varchar first_name
        varchar last_name
        varchar email UK
        varchar phone UK
        varchar password
        enum role
        enum status
        boolean active
    }
    CITIES {
        bigint city_id PK
        varchar name UK
        varchar region
        text description
    }
    HOTELS {
        bigint hotel_id PK
        bigint city_id FK
        varchar name
        varchar address
        varchar phone
        varchar email
        text description
        tinyint stars
    }
    ROOMS {
        bigint room_id PK
        bigint hotel_id FK
        varchar number
        varchar type
        int capacity
        decimal price_per_night
        boolean available
    }
    RESTAURANTS {
        bigint restaurant_id PK
        bigint city_id FK
        varchar name
        varchar address
        varchar phone
        varchar cuisine
    }
    ATTRACTIONS {
        bigint attraction_id PK
        bigint city_id FK
        varchar name
        text description
        varchar address
        varchar opening_hours
    }
    DRIVERS {
        bigint driver_id PK
        bigint user_id FK UK
        bigint city_id FK
        varchar license_number UK
        int years_of_experience
        boolean available
        varchar languages
    }
    VEHICLES {
        bigint vehicle_id PK
        bigint driver_id FK
        varchar brand
        varchar model
        varchar type
        int seats
        varchar registration_number UK
        boolean air_conditioning
    }
    BOOKINGS {
        bigint booking_id PK
        bigint user_id FK
        bigint room_id FK nullable
        bigint driver_id FK nullable
        varchar booking_number UK
        enum booking_type
        date booking_date
        date start_date
        date end_date
        decimal total_price
        enum status
    }
    REVIEWS {
        bigint review_id PK
        bigint user_id FK
        bigint hotel_id FK nullable
        bigint driver_id FK nullable
        bigint attraction_id FK nullable
        tinyint rating
        text comment
    }
    FAVORITES {
        bigint favorite_id PK
        bigint user_id FK
        bigint hotel_id FK nullable
        bigint restaurant_id FK nullable
        bigint attraction_id FK nullable
    }
```

---

## Relationship Table

| Table | Relationship | Target | Foreign Key | On Delete |
|---|---|---|---|---|
| Table | Relationship | Target | Foreign Key | Nullable | On Delete |
|---|---|---|---|---|---|
| drivers | belongsTo | users | `user_id` | No | cascade |
| drivers | belongsTo | cities | `city_id` | No | restrict |
| vehicles | belongsTo | drivers | `driver_id` | No | cascade |
| hotels | belongsTo | cities | `city_id` | No | restrict |
| rooms | belongsTo | hotels | `hotel_id` | No | cascade |
| restaurants | belongsTo | cities | `city_id` | No | restrict |
| attractions | belongsTo | cities | `city_id` | No | restrict |
| bookings | belongsTo | users | `user_id` | No | cascade |
| bookings | belongsTo | rooms | `room_id` | Yes | set null |
| bookings | belongsTo | drivers | `driver_id` | Yes | set null |
| reviews | belongsTo | users | `user_id` | No | cascade |
| reviews | belongsTo | hotels | `hotel_id` | Yes | cascade |
| reviews | belongsTo | drivers | `driver_id` | Yes | cascade |
| reviews | belongsTo | attractions | `attraction_id` | Yes | cascade |
| favorites | belongsTo | users | `user_id` | No | cascade |
| favorites | belongsTo | hotels | `hotel_id` | Yes | cascade |
| favorites | belongsTo | restaurants | `restaurant_id` | Yes | cascade |
| favorites | belongsTo | attractions | `attraction_id` | Yes | cascade |

---

## Table Documentation

## users

### Purpose
Stores all authenticated users of the platform, regardless of role (Tourist, Driver, Hotel Manager, Administrator).

### Description
Central identity table. Every actor in the system is represented here. The `role` ENUM determines the user's permissions and dashboard. The `status` field supports admin moderation (approve, reject, suspend accounts). Authentication (Laravel Sanctum/Breeze) and profile data live in this table.

### Columns

| Column | Type | Nullable | Default | Description |
|---|---|---|---|---|
| user_id | BIGINT UNSIGNED (PK) | No | auto | Primary key |
| first_name | VARCHAR(100) | No | — | User's first name |
| last_name | VARCHAR(100) | No | — | User's last name |
| email | VARCHAR(150) | No | — | Unique login email |
| phone | VARCHAR(20) | No | — | Unique contact phone number |
| password | VARCHAR(255) | No | — | Hashed password (bcrypt) |
| role | ENUM | No | — | `'Tourist'`, `'Driver'`, `'Hotel Manager'`, `'Administrator'` |
| status | ENUM | No | `'Pending'` | `'Pending'`, `'Approved'`, `'Rejected'`, `'Suspended'` |
| active | BOOLEAN | No | true | Account active flag |
| created_at | TIMESTAMP | Yes | NULL | Record creation timestamp |
| updated_at | TIMESTAMP | Yes | NULL | Record update timestamp |

### Data Types
`user_id`: `bigIncrements` · `first_name`, `last_name`, `email`, `phone`, `password`: `string` · `role`, `status`: `enum` · `active`: `boolean` · timestamps: `timestamp`

### Relationships
- `users` **hasOne** `drivers` (when `role = 'Driver'`)
- `users` **hasMany** `bookings`
- `users` **hasMany** `reviews`
- `users` **hasMany** `favorites`

### Business Rules
- A user must have exactly one role from the allowed ENUM values.
- Only users with `status = 'Approved'` can log in and create bookings.
- A user with `role = 'Driver'` must create a `drivers` profile before accepting transport bookings.
- A user with `role = 'Hotel Manager'` must have at least one `hotels` record to manage rooms.
- `email` and `phone` must each be unique across the platform.
- Deactivated users (`active = false`) cannot log in or create new bookings.

### Laravel Relationships
```php
class User extends Authenticatable
{
    public function driver(): HasOne
    {
        return $this->hasOne(Driver::class);
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class);
    }
}
```

### Validation Rules
```php
'first_name' => 'required|string|max:100',
'last_name'  => 'required|string|max:100',
'email'      => 'required|email|max:150|unique:users,email',
'phone'      => 'required|string|max:20|unique:users,phone',
'password'   => 'required|string|min:8|confirmed',
'role'       => 'required|in:Tourist,Driver,Hotel Manager,Administrator',
```

### Indexes
- PRIMARY KEY (`user_id`)
- UNIQUE INDEX `users_email_unique` (`email`)
- UNIQUE INDEX `users_phone_unique` (`phone`)

### Example Record
```json
{
  "user_id": 15,
  "first_name": "Yasmine",
  "last_name": "El Amrani",
  "email": "yasmine.elamrani@example.com",
  "phone": "+212612345678",
  "role": "Tourist",
  "status": "Approved",
  "active": true,
  "created_at": "2026-01-15T08:30:00Z",
  "updated_at": "2026-02-01T12:00:00Z"
}
```

---

## cities

### Purpose
Stores Moroccan cities/regions available for tourism discovery.

### Description
Acts as the primary geographic anchor for the catalog. Hotels, restaurants, attractions, and drivers are all scoped to a city, enabling location-based search and filtering across the platform.

### Columns

| Column | Type | Nullable | Default | Description |
|---|---|---|---|---|
| city_id | BIGINT UNSIGNED (PK) | No | auto | Primary key |
| name | VARCHAR(100) | No | — | City name (unique) |
| region | VARCHAR(100) | Yes | NULL | Administrative region |
| description | TEXT | Yes | NULL | Overview text for the city landing page |
| created_at | TIMESTAMP | Yes | NULL | Record creation timestamp |
| updated_at | TIMESTAMP | Yes | NULL | Record update timestamp |

### Data Types
`city_id`: `bigIncrements` · `name`, `region`: `string` · `description`: `text` · timestamps: `timestamp`

### Relationships
- `cities` **hasMany** `hotels`
- `cities` **hasMany** `restaurants`
- `cities` **hasMany** `attractions`
- `cities` **hasMany** `drivers`

### Business Rules
- City name must be unique.
- A city cannot be deleted if it has associated hotels, restaurants, attractions, or drivers (restrict on delete).

### Laravel Relationships
```php
class City extends Model
{
    public function hotels(): HasMany
    {
        return $this->hasMany(Hotel::class);
    }

    public function restaurants(): HasMany
    {
        return $this->hasMany(Restaurant::class);
    }

    public function attractions(): HasMany
    {
        return $this->hasMany(Attraction::class);
    }

    public function drivers(): HasMany
    {
        return $this->hasMany(Driver::class);
    }
}
```

### Validation Rules
```php
'name'        => 'required|string|max:100|unique:cities,name',
'region'      => 'nullable|string|max:100',
'description' => 'nullable|string',
```

### Indexes
- PRIMARY KEY (`city_id`)
- UNIQUE INDEX `cities_name_unique` (`name`)

### Example Record
```json
{
  "city_id": 1,
  "name": "Marrakech",
  "region": "Marrakech-Safi",
  "description": "The Red City, famed for its medina, souks, and Jemaa el-Fnaa square.",
  "created_at": "2026-01-05T10:00:00Z",
  "updated_at": "2026-01-05T10:00:00Z"
}
```

---

## drivers

### Purpose
Stores driver profiles for the transport/ride-booking module.

### Description
Extends a `user` (role = `Driver`) with transport-specific credentials. A driver is linked to exactly one user and operates in one city. A driver may own multiple `vehicles` and can be assigned to bookings.

### Columns

| Column | Type | Nullable | Default | Description |
|---|---|---|---|---|
| driver_id | BIGINT UNSIGNED (PK) | No | auto | Primary key |
| user_id | BIGINT UNSIGNED (FK) | No | — | References `users.user_id` (unique, one-to-one) |
| city_id | BIGINT UNSIGNED (FK) | No | — | Primary city of operation |
| license_number | VARCHAR(100) | No | — | Driving license number (unique) |
| years_of_experience | INT | Yes | NULL | Years of driving experience |
| available | BOOLEAN | No | true | Current availability status |
| languages | VARCHAR(255) | Yes | NULL | Comma-separated list of spoken languages |
| created_at | TIMESTAMP | Yes | NULL | Record creation timestamp |
| updated_at | TIMESTAMP | Yes | NULL | Record update timestamp |

### Data Types
`driver_id`, `user_id`, `city_id`: `bigInteger` · `license_number`, `languages`: `string` · `years_of_experience`: `integer` · `available`: `boolean` · timestamps: `timestamp`

### Relationships
- `drivers` **belongsTo** `users`
- `drivers` **belongsTo** `cities`
- `drivers` **hasMany** `vehicles`
- `drivers` **hasMany** `bookings`

### Business Rules
- A driver profile requires a unique `license_number`.
- Each driver must be linked to exactly one `user` with `role = 'Driver'`.
- A driver cannot accept bookings until their user account has `status = 'Approved'`.
- A driver is linked to exactly one city.

### Laravel Relationships
```php
class Driver extends Model
{
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }

    public function vehicles(): HasMany
    {
        return $this->hasMany(Vehicle::class);
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }
}
```

### Validation Rules
```php
'user_id'              => 'required|exists:users,id|unique:drivers,user_id',
'city_id'              => 'required|exists:cities,id',
'license_number'       => 'required|string|max:100|unique:drivers,license_number',
'years_of_experience'  => 'nullable|integer|min:0',
'languages'            => 'nullable|string|max:255',
```

### Indexes
- PRIMARY KEY (`driver_id`)
- UNIQUE INDEX `drivers_user_id_unique` (`user_id`)
- UNIQUE INDEX `drivers_license_number_unique` (`license_number`)
- INDEX `drivers_city_id_index` (`city_id`)

### Example Record
```json
{
  "driver_id": 6,
  "user_id": 31,
  "city_id": 1,
  "license_number": "MA-2024-88213",
  "years_of_experience": 10,
  "available": true,
  "languages": "Arabic,French,English",
  "created_at": "2026-01-18T10:00:00Z",
  "updated_at": "2026-02-05T10:00:00Z"
}
```

---

## vehicles

### Purpose
Stores vehicles owned/operated by drivers for transport bookings.

### Description
Represents a physical vehicle that can be assigned to a `booking`. Each vehicle belongs to exactly one driver and carries capacity and feature attributes used for fare estimation and ride matching.

### Columns

| Column | Type | Nullable | Default | Description |
|---|---|---|---|---|
| vehicle_id | BIGINT UNSIGNED (PK) | No | auto | Primary key |
| driver_id | BIGINT UNSIGNED (FK) | No | — | References `drivers.driver_id` |
| brand | VARCHAR(100) | No | — | Vehicle brand (e.g. `Dacia`) |
| model | VARCHAR(100) | No | — | Vehicle model (e.g. `Duster`) |
| type | VARCHAR(50) | No | — | `sedan`, `suv`, `van`, `minibus` |
| seats | INT | No | — | Passenger seating capacity |
| registration_number | VARCHAR(50) | No | — | License plate / registration number (unique) |
| air_conditioning | BOOLEAN | No | false | Whether the vehicle has A/C |
| created_at | TIMESTAMP | Yes | NULL | Record creation timestamp |
| updated_at | TIMESTAMP | Yes | NULL | Record update timestamp |

### Data Types
`vehicle_id`, `driver_id`: `bigIncrements` · `brand`, `model`, `type`, `registration_number`: `string` · `seats`: `integer` · `air_conditioning`: `boolean` · timestamps: `timestamp`

### Relationships
- `vehicles` **belongsTo** `drivers`
- `vehicles` **hasMany** `bookings`

### Business Rules
- `registration_number` must be unique across the platform.
- A vehicle must belong to a verified driver (user `status = 'Approved'`) to be bookable.
- `seats` must be greater than 0.

### Laravel Relationships
```php
class Vehicle extends Model
{
    public function driver(): BelongsTo
    {
        return $this->belongsTo(Driver::class);
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }
}
```

### Validation Rules
```php
'driver_id'            => 'required|exists:drivers,id',
'brand'                => 'required|string|max:100',
'model'                => 'required|string|max:100',
'type'                 => 'required|string|max:50',
'seats'                => 'required|integer|min:1',
'registration_number'  => 'required|string|max:50|unique:vehicles,registration_number',
'air_conditioning'     => 'required|boolean',
```

### Indexes
- PRIMARY KEY (`vehicle_id`)
- UNIQUE INDEX `vehicles_registration_number_unique` (`registration_number`)
- INDEX `vehicles_driver_id_index` (`driver_id`)
- INDEX `vehicles_type_index` (`type`)

### Example Record
```json
{
  "vehicle_id": 9,
  "driver_id": 6,
  "brand": "Dacia",
  "model": "Duster",
  "type": "suv",
  "seats": 4,
  "registration_number": "12345-A-6",
  "air_conditioning": true,
  "created_at": "2026-01-18T10:10:00Z",
  "updated_at": "2026-01-18T10:10:00Z"
}
```

---

## hotels

### Purpose
Stores hotel listings available on the platform.

### Description
Represents a lodging establishment within a city. Each hotel exposes a set of bookable `rooms` and can receive reviews and favorites from users.

### Columns

| Column | Type | Nullable | Default | Description |
|---|---|---|---|---|
| hotel_id | BIGINT UNSIGNED (PK) | No | auto | Primary key |
| city_id | BIGINT UNSIGNED (FK) | No | — | References `cities.city_id` |
| name | VARCHAR(150) | No | — | Hotel name |
| address | VARCHAR(255) | No | — | Street address |
| phone | VARCHAR(20) | Yes | NULL | Contact phone |
| email | VARCHAR(150) | Yes | NULL | Contact email |
| description | TEXT | Yes | NULL | Full description / amenities summary |
| stars | TINYINT UNSIGNED | Yes | NULL | Official star classification (1-5) |
| created_at | TIMESTAMP | Yes | NULL | Record creation timestamp |
| updated_at | TIMESTAMP | Yes | NULL | Record update timestamp |

### Data Types
`hotel_id`, `city_id`: `bigIncrements` · `name`, `address`, `phone`, `email`: `string` · `description`: `text` · `stars`: `tinyInteger` · timestamps: `timestamp`

### Relationships
- `hotels` **belongsTo** `cities`
- `hotels` **hasMany** `rooms`
- `hotels` **hasMany** `reviews`
- `hotels` **hasMany** `favorites`
- `hotels` **hasMany** `bookings` (through rooms)

### Business Rules
- A hotel must belong to a valid city.
- A hotel must have at least one room to appear in search results.
- `stars` must be between 1 and 5 if provided.

### Laravel Relationships
```php
class Hotel extends Model
{
    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }

    public function rooms(): HasMany
    {
        return $this->hasMany(Room::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class);
    }
}
```

### Validation Rules
```php
'city_id'     => 'required|exists:cities,id',
'name'        => 'required|string|max:150',
'address'     => 'required|string|max:255',
'phone'       => 'nullable|string|max:20',
'email'       => 'nullable|email|max:150',
'description' => 'nullable|string',
'stars'       => 'nullable|integer|between:1,5',
```

### Indexes
- PRIMARY KEY (`hotel_id`)
- INDEX `hotels_city_id_index` (`city_id`)

### Example Record
```json
{
  "hotel_id": 4,
  "city_id": 1,
  "name": "Riad Atlas Dream",
  "address": "12 Derb El Hammam, Medina, Marrakech",
  "phone": "+212524123456",
  "email": "contact@riadatlasdream.ma",
  "description": "A boutique riad in the heart of the Marrakech medina.",
  "stars": 4,
  "created_at": "2026-01-12T09:00:00Z",
  "updated_at": "2026-02-01T09:00:00Z"
}
```

---

## rooms

### Purpose
Stores individual room types/inventory offered by a hotel.

### Description
Represents a bookable unit within a hotel (e.g. "Room 101 - Deluxe Double"). Rooms hold pricing and capacity information used by the booking engine to compute availability and price.

### Columns

| Column | Type | Nullable | Default | Description |
|---|---|---|---|---|
| room_id | BIGINT UNSIGNED (PK) | No | auto | Primary key |
| hotel_id | BIGINT UNSIGNED (FK) | No | — | References `hotels.hotel_id` |
| number | VARCHAR(20) | No | — | Room number identifier |
| type | VARCHAR(50) | No | — | e.g. `Single`, `Double`, `Suite` |
| capacity | INT | No | — | Max number of guests |
| price_per_night | DECIMAL(10,2) | No | — | Nightly rate |
| available | BOOLEAN | No | true | Availability toggle |
| created_at | TIMESTAMP | Yes | NULL | Record creation timestamp |
| updated_at | TIMESTAMP | Yes | NULL | Record update timestamp |

### Data Types
`room_id`, `hotel_id`: `bigIncrements` · `number`, `type`: `string` · `capacity`: `integer` · `price_per_night`: `decimal(10,2)` · `available`: `boolean` · timestamps: `timestamp`

### Relationships
- `rooms` **belongsTo** `hotels`
- `rooms` **hasMany** `bookings`

### Business Rules
- `price_per_night` must be greater than 0.
- A room cannot be booked if `available = false` or if overlapping confirmed bookings exist for the requested dates.
- `capacity` must be respected by the `guests` value on bookings.

### Laravel Relationships
```php
class Room extends Model
{
    public function hotel(): BelongsTo
    {
        return $this->belongsTo(Hotel::class);
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }
}
```

### Validation Rules
```php
'hotel_id'          => 'required|exists:hotels,id',
'number'            => 'required|string|max:20',
'type'              => 'required|string|max:50',
'capacity'          => 'required|integer|min:1',
'price_per_night'   => 'required|numeric|min:0.01',
```

### Indexes
- PRIMARY KEY (`room_id`)
- INDEX `rooms_hotel_id_index` (`hotel_id`)
- INDEX `rooms_price_per_night_index` (`price_per_night`)

### Example Record
```json
{
  "room_id": 11,
  "hotel_id": 4,
  "number": "101",
  "type": "Deluxe Double Room",
  "capacity": 2,
  "price_per_night": 85.00,
  "available": true,
  "created_at": "2026-01-12T09:15:00Z",
  "updated_at": "2026-01-12T09:15:00Z"
}
```

---

## restaurants

### Purpose
Stores restaurant listings available for discovery within a city.

### Description
Represents a dining establishment within a city. Restaurants are discoverable by tourists and can be saved as favorites. Each restaurant belongs to a city and includes cuisine information for filtering.

### Columns

| Column | Type | Nullable | Default | Description |
|---|---|---|---|---|
| restaurant_id | BIGINT UNSIGNED (PK) | No | auto | Primary key |
| city_id | BIGINT UNSIGNED (FK) | No | — | References `cities.city_id` |
| name | VARCHAR(150) | No | — | Restaurant name |
| address | VARCHAR(255) | No | — | Street address |
| phone | VARCHAR(20) | Yes | NULL | Contact phone |
| cuisine | VARCHAR(100) | No | — | Cuisine type (e.g. `Moroccan`, `Italian`, `Fusion`) |
| created_at | TIMESTAMP | Yes | NULL | Record creation timestamp |
| updated_at | TIMESTAMP | Yes | NULL | Record update timestamp |

### Data Types
`restaurant_id`, `city_id`: `bigIncrements` · `name`, `address`, `phone`, `cuisine`: `string` · timestamps: `timestamp`

### Relationships
- `restaurants` **belongsTo** `cities`
- `restaurants` **hasMany** `favorites`

### Business Rules
- A restaurant must belong to a valid city.
- A restaurant cannot be deleted if it has associated favorites (restrict on delete).

### Laravel Relationships
```php
class Restaurant extends Model
{
    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }

    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class);
    }
}
```

### Validation Rules
```php
'city_id'  => 'required|exists:cities,id',
'name'     => 'required|string|max:150',
'address'  => 'required|string|max:255',
'phone'    => 'nullable|string|max:20',
'cuisine'  => 'required|string|max:100',
```

### Indexes
- PRIMARY KEY (`restaurant_id`)
- INDEX `restaurants_city_id_index` (`city_id`)
- INDEX `restaurants_cuisine_index` (`cuisine`)

### Example Record
```json
{
  "restaurant_id": 3,
  "city_id": 1,
  "name": "Cafe des Epices",
  "address": "Rahba Kedima, Medina, Marrakech",
  "phone": "+212524123457",
  "cuisine": "Moroccan",
  "created_at": "2026-01-20T11:00:00Z",
  "updated_at": "2026-01-20T11:00:00Z"
}
```

---

## attractions

### Purpose
Stores tourist attractions (monuments, museums, natural sites, activities) available for discovery within a city.

### Description
The core content catalog entity for tourism discovery. Each attraction belongs to a city and can be reviewed and favorited by tourists, powering the recommendation and search features of the platform.

### Columns

| Column | Type | Nullable | Default | Description |
|---|---|---|---|---|
| attraction_id | BIGINT UNSIGNED (PK) | No | auto | Primary key |
| city_id | BIGINT UNSIGNED (FK) | No | — | References `cities.city_id` |
| name | VARCHAR(150) | No | — | Attraction name |
| description | TEXT | Yes | NULL | Full description |
| address | VARCHAR(255) | Yes | NULL | Physical address |
| opening_hours | VARCHAR(100) | Yes | NULL | Human-readable opening hours |
| created_at | TIMESTAMP | Yes | NULL | Record creation timestamp |
| updated_at | TIMESTAMP | Yes | NULL | Record update timestamp |

### Data Types
`attraction_id`, `city_id`: `bigIncrements` · `name`, `address`, `opening_hours`: `string` · `description`: `text` · timestamps: `timestamp`

### Relationships
- `attractions` **belongsTo** `cities`
- `attractions` **hasMany** `reviews`
- `attractions` **hasMany** `favorites`

### Business Rules
- Every attraction must belong to a valid city.
- An attraction cannot be deleted if it has associated reviews or favorites (restrict on delete).

### Laravel Relationships
```php
class Attraction extends Model
{
    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class);
    }
}
```

### Validation Rules
```php
'city_id'        => 'required|exists:cities,id',
'name'           => 'required|string|max:150',
'description'    => 'nullable|string',
'address'        => 'nullable|string|max:255',
'opening_hours'  => 'nullable|string|max:100',
```

### Indexes
- PRIMARY KEY (`attraction_id`)
- INDEX `attractions_city_id_index` (`city_id`)

### Example Record
```json
{
  "attraction_id": 8,
  "city_id": 1,
  "name": "Jardin Majorelle",
  "description": "A botanical garden and artist's landscape garden in Marrakech.",
  "address": "Rue Yves Saint Laurent, Marrakech",
  "opening_hours": "08:00 - 18:00",
  "created_at": "2026-01-06T11:00:00Z",
  "updated_at": "2026-02-10T09:00:00Z"
}
```

---

## bookings

### Purpose
Stores all reservations made by tourists for hotel rooms and/or driver transport services.

### Description
The unified transactional record linking a `user` to a `room` and/or `driver` for a date range. The `booking_type` ENUM distinguishes between hotel-only, combined hotel+driver, and airport transfer bookings. Either `room_id` or `driver_id` (or both) may be NULL depending on the booking type.

### Columns

| Column | Type | Nullable | Default | Description |
|---|---|---|---|---|
| booking_id | BIGINT UNSIGNED (PK) | No | auto | Primary key |
| user_id | BIGINT UNSIGNED (FK) | No | — | References `users.user_id` |
| room_id | BIGINT UNSIGNED (FK) | Yes | NULL | References `rooms.room_id` (nullable) |
| driver_id | BIGINT UNSIGNED (FK) | Yes | NULL | References `drivers.driver_id` (nullable) |
| booking_number | VARCHAR(50) | No | — | Unique human-readable booking reference |
| booking_type | ENUM | No | — | `'Hotel'`, `'Hotel + Driver'`, `'Airport Transfer'` |
| booking_date | DATE | No | — | Date the booking was made |
| start_date | DATE | No | — | Check-in or trip start date |
| end_date | DATE | No | — | Check-out or trip end date |
| total_price | DECIMAL(10,2) | No | — | Computed total price |
| status | ENUM | No | `'Pending'` | `'Pending'`, `'Confirmed'`, `'Cancelled'`, `'Completed'` |
| created_at | TIMESTAMP | Yes | NULL | Record creation timestamp |
| updated_at | TIMESTAMP | Yes | NULL | Record update timestamp |

### Data Types
`booking_id`, `user_id`, `room_id`, `driver_id`: `bigIncrements` · `booking_number`: `string` · `booking_type`, `status`: `enum` · `booking_date`, `start_date`, `end_date`: `date` · `total_price`: `decimal(10,2)` · timestamps: `timestamp`

### Relationships
- `bookings` **belongsTo** `users`
- `bookings` **belongsTo** `rooms` (nullable)
- `bookings` **belongsTo** `drivers` (nullable)

### Business Rules
- Every booking is made by exactly one user.
- A booking may reserve one room and/or assign one driver (at least one must be non-NULL).
- `booking_type = 'Hotel'` requires a non-NULL `room_id`.
- `booking_type = 'Airport Transfer'` requires a non-NULL `driver_id`.
- `booking_type = 'Hotel + Driver'` requires both `room_id` and `driver_id` to be non-NULL.
- `end_date` must be strictly after `start_date`.
- `total_price` is computed server-side (never trusted from client).
- A booking can only transition `Pending -> Confirmed -> Completed`, or to `Cancelled` from `Pending`/`Confirmed`.
- `booking_number` must be unique across the platform.

### Laravel Relationships
```php
class Booking extends Model
{
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }

    public function driver(): BelongsTo
    {
        return $this->belongsTo(Driver::class);
    }
}
```

### Validation Rules
```php
'user_id'         => 'required|exists:users,id',
'room_id'         => 'nullable|exists:rooms,id',
'driver_id'       => 'nullable|exists:drivers,id',
'booking_number'  => 'required|string|max:50|unique:bookings,booking_number',
'booking_type'    => 'required|in:Hotel,Hotel + Driver,Airport Transfer',
'booking_date'    => 'required|date',
'start_date'      => 'required|date|after_or_equal:today',
'end_date'        => 'required|date|after:start_date',
'status'          => 'nullable|in:Pending,Confirmed,Cancelled,Completed',
```

### Indexes
- PRIMARY KEY (`booking_id`)
- UNIQUE INDEX `bookings_booking_number_unique` (`booking_number`)
- INDEX `bookings_user_id_index` (`user_id`)
- INDEX `bookings_room_id_index` (`room_id`)
- INDEX `bookings_driver_id_index` (`driver_id`)
- INDEX `bookings_status_index` (`status`)
- INDEX `bookings_start_date_index` (`start_date`)
- INDEX `bookings_end_date_index` (`end_date`)

### Example Record
```json
{
  "booking_id": 102,
  "user_id": 15,
  "room_id": 11,
  "driver_id": null,
  "booking_number": "BK-2026-00102",
  "booking_type": "Hotel",
  "booking_date": "2026-02-20",
  "start_date": "2026-03-10",
  "end_date": "2026-03-14",
  "total_price": 340.00,
  "status": "Confirmed",
  "created_at": "2026-02-20T14:00:00Z",
  "updated_at": "2026-02-20T14:05:00Z"
}
```

---

## reviews

### Purpose
Stores user-submitted ratings and comments for hotels, drivers, or attractions.

### Description
A table allowing a single reviews mechanism to serve multiple entity types via explicit nullable FKs. Exactly one of `hotel_id`, `driver_id`, or `attraction_id` must be non-NULL per review.

### Columns

| Column | Type | Nullable | Default | Description |
|---|---|---|---|---|
| review_id | BIGINT UNSIGNED (PK) | No | auto | Primary key |
| user_id | BIGINT UNSIGNED (FK) | No | — | References `users.user_id` |
| hotel_id | BIGINT UNSIGNED (FK) | Yes | NULL | References `hotels.hotel_id` |
| driver_id | BIGINT UNSIGNED (FK) | Yes | NULL | References `drivers.driver_id` |
| attraction_id | BIGINT UNSIGNED (FK) | Yes | NULL | References `attractions.attraction_id` |
| rating | TINYINT UNSIGNED | No | — | 1 to 5 |
| comment | TEXT | Yes | NULL | Free-text review |
| created_at | TIMESTAMP | Yes | NULL | Record creation timestamp |

### Data Types
`review_id`, `user_id`, `hotel_id`, `driver_id`, `attraction_id`: `bigIncrements` · `rating`: `tinyInteger` · `comment`: `text` · timestamp: `timestamp`

### Relationships
- `reviews` **belongsTo** `users`
- `reviews` **belongsTo** `hotels` (nullable)
- `reviews` **belongsTo** `drivers` (nullable)
- `reviews` **belongsTo** `attractions` (nullable)

### Business Rules
- `rating` must be between 1 and 5 inclusive.
- A tourist can create reviews only after completing a booking with `status = 'Completed'` tied to the reviewed entity.
- Exactly one of `hotel_id`, `driver_id`, or `attraction_id` must be non-NULL.
- A user may leave only one review per entity (enforced via unique composite index per entity type).

### Laravel Relationships
```php
class Review extends Model
{
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function hotel(): BelongsTo
    {
        return $this->belongsTo(Hotel::class);
    }

    public function driver(): BelongsTo
    {
        return $this->belongsTo(Driver::class);
    }

    public function attraction(): BelongsTo
    {
        return $this->belongsTo(Attraction::class);
    }
}
```

### Validation Rules
```php
'user_id'       => 'required|exists:users,id',
'hotel_id'      => 'nullable|exists:hotels,id',
'driver_id'     => 'nullable|exists:drivers,id',
'attraction_id' => 'nullable|exists:attractions,id',
'rating'        => 'required|integer|between:1,5',
'comment'       => 'nullable|string|max:2000',
```

### Indexes
- PRIMARY KEY (`review_id`)
- INDEX `reviews_user_id_index` (`user_id`)
- INDEX `reviews_hotel_id_index` (`hotel_id`)
- INDEX `reviews_driver_id_index` (`driver_id`)
- INDEX `reviews_attraction_id_index` (`attraction_id`)
- INDEX `reviews_rating_index` (`rating`)

### Example Record
```json
{
  "review_id": 214,
  "user_id": 15,
  "hotel_id": 4,
  "driver_id": null,
  "attraction_id": null,
  "rating": 5,
  "comment": "Beautiful riad, incredible hospitality, would book again!",
  "created_at": "2026-03-15T08:00:00Z"
}
```

---

## favorites

### Purpose
Stores "saved" hotels, restaurants, and attractions bookmarked by a user for quick future access.

### Description
A lightweight table representing a user's wishlist across multiple catalog entity types. Exactly one of `hotel_id`, `restaurant_id`, or `attraction_id` must be non-NULL per record.

### Columns

| Column | Type | Nullable | Default | Description |
|---|---|---|---|---|
| favorite_id | BIGINT UNSIGNED (PK) | No | auto | Primary key |
| user_id | BIGINT UNSIGNED (FK) | No | — | References `users.user_id` |
| hotel_id | BIGINT UNSIGNED (FK) | Yes | NULL | References `hotels.hotel_id` |
| restaurant_id | BIGINT UNSIGNED (FK) | Yes | NULL | References `restaurants.restaurant_id` |
| attraction_id | BIGINT UNSIGNED (FK) | Yes | NULL | References `attractions.attraction_id` |
| created_at | TIMESTAMP | Yes | NULL | Record creation timestamp |

### Data Types
`favorite_id`, `user_id`, `hotel_id`, `restaurant_id`, `attraction_id`: `bigIncrements` · timestamp: `timestamp`

### Relationships
- `favorites` **belongsTo** `users`
- `favorites` **belongsTo** `hotels` (nullable)
- `favorites` **belongsTo** `restaurants` (nullable)
- `favorites` **belongsTo** `attractions` (nullable)

### Business Rules
- A user cannot favorite the same entity twice (enforced via unique composite index per entity type).
- Exactly one of `hotel_id`, `restaurant_id`, or `attraction_id` must be non-NULL.
- Favorites are removed automatically (cascade) if the underlying entity is permanently deleted.

### Laravel Relationships
```php
class Favorite extends Model
{
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function hotel(): BelongsTo
    {
        return $this->belongsTo(Hotel::class);
    }

    public function restaurant(): BelongsTo
    {
        return $this->belongsTo(Restaurant::class);
    }

    public function attraction(): BelongsTo
    {
        return $this->belongsTo(Attraction::class);
    }
}
```

### Validation Rules
```php
'user_id'       => 'required|exists:users,id',
'hotel_id'      => 'nullable|exists:hotels,id',
'restaurant_id' => 'nullable|exists:restaurants,id',
'attraction_id' => 'nullable|exists:attractions,id',
```

### Indexes
- PRIMARY KEY (`favorite_id`)
- INDEX `favorites_user_id_index` (`user_id`)
- INDEX `favorites_hotel_id_index` (`hotel_id`)
- INDEX `favorites_restaurant_id_index` (`restaurant_id`)
- INDEX `favorites_attraction_id_index` (`attraction_id`)

### Example Record
```json
{
  "favorite_id": 341,
  "user_id": 15,
  "hotel_id": null,
  "restaurant_id": null,
  "attraction_id": 8,
  "created_at": "2026-02-18T16:45:00Z"
}
```

---

## Indexing Strategy

| Purpose | Approach |
|---|---|
| Primary key lookups | Clustered `BIGINT UNSIGNED` auto-increment on every table |
| Foreign key joins | Explicit index on every `*_id` foreign key column |
| Search/filter columns | Indexes on `cuisine`, `status`, `type`, `region` |
| Uniqueness constraints | Unique indexes on `email`, `phone`, `booking_number`, `license_number`, `registration_number`, `name` (cities) |
| Availability queries | Indexes on `start_date` / `end_date` for fast overlap checks on bookings |
| Rating lookups | Index on `rating` column in reviews for filtering/sorting |

notice 
in api.php file I need to add a name spece instead of using \App\Http\Controllers\HotelManager\