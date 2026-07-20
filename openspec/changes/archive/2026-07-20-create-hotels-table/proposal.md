## Why

The hotels table and Eloquent model are required to support the lodging booking features of the platform. Hotels are a core catalog entity that tourists can browse, book rooms, review, and favorite. This implements the MLD design defined in `docs/database.md`.

## What Changes

- Create `hotels` migration with columns matching the MLD exactly
- Create `Hotel` Eloquent model with defined relationships
- Add index on `city_id` for foreign key performance
- Include star rating validation (1-5)

## Capabilities

### New Capabilities

- `hotels`: Hotel listings catalog entity (migration + model + relationships)

### Modified Capabilities

(None - new table creation only)

## Impact

- **Code**: New migration file, new Eloquent model
- **Database**: New `hotels` table
- **Dependencies**: References `cities.city_id` (FK), referenced by `rooms`, `reviews`, and `favorites`
