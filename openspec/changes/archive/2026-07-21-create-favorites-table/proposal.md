## Why

The platform needs a favorites/bookmarks system to let tourists save hotels, restaurants, and attractions for quick future access. This is a core engagement feature that enables users to build personalized wishlists during trip planning. The database schema in `docs/database.md` defines the `favorites` table with explicit FK columns and partial unique indexes.

## What Changes

- Create a new `favorites` migration with explicit FK columns (`hotel_id`, `restaurant_id`, `attraction_id`)
- Create the `Favorite` Eloquent model with `belongsTo` relationships to User, Hotel, Restaurant, and Attraction
- Add partial unique indexes to prevent duplicate favorites per entity type per user
- Add CHECK constraint ensuring at least one of `hotel_id`, `restaurant_id`, or `attraction_id` is NOT NULL
- Add database indexes on all FK columns for query performance
- Implement a working `down()` method for migration rollback

## Capabilities

### New Capabilities

- `favorites`: Core favorites/bookmarks system covering the migration, Eloquent model, relationships, validation, and constraints for user-saved hotels, restaurants, and attractions.

### Modified Capabilities

None.

## Impact

- **Database**: New `favorites` table created via migration
- **Models**: New `Favorite` model
- **Validation**: At least one FK required at database level via CHECK constraint
- **No breaking changes**: Additive only; no existing tables modified
