## Why

The attractions table and Eloquent model are required to support the tourism discovery features of the platform. Attractions are a core catalog entity that tourists can browse, search, review, and favorite. This implements the MLD design defined in `docs/database.md`.

## What Changes

- Create `attractions` migration with columns matching the MLD exactly
- Create `Attraction` Eloquent model with defined relationships
- Add index on `city_id` for foreign key performance

## Capabilities

### New Capabilities

- `attractions`: Tourist attractions catalog entity (migration + model + relationships)

### Modified Capabilities

(None - new table creation only)

## Impact

- **Code**: New migration file, new Eloquent model
- **Database**: New `attractions` table
- **Dependencies**: References `cities.city_id` (FK), referenced by `reviews` and `favorites`
