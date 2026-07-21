## Why

The platform needs a restaurants catalog entity to allow tourists to discover dining options within cities. This is missing from the current database schema, preventing restaurant listings, filtering by cuisine, and favorites functionality.

## What Changes

- Create `restaurants` table migration with columns: `restaurant_id`, `city_id`, `name`, `description`, `address`, `cuisine`, `phone`, `price_range`, `created_at`, `updated_at`
- Create `Restaurant` Eloquent model with `belongsTo(City::class)` relationship
- Create `RestaurantResource` for API response transformation
- Create `RestaurantController` with standard CRUD endpoints
- Add validation rules for restaurant fields including `price_range` (1-4)
- Add index on `city_id` for query performance

## Capabilities

### New Capabilities
- `restaurants`: Restaurant listings catalog entity for discovery and favorites

### Modified Capabilities
<!-- None -->

## Impact

- **New files**:
  - `database/migrations/xxxx_xx_xx_xxxxxx_create_restaurants_table.php`
  - `app/Models/Restaurant.php`
  - `app/Http/Resources/RestaurantResource.php`
  - `app/Http/Controllers/RestaurantController.php`
- **Modified files**:
  - `routes/api.php` (add restaurant routes)
- **API endpoints**: New `/api/v1/restaurants` resource routes
- **Database**: New table with foreign key to `cities`