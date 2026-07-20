## Why

The platform needs a unified reviews system to allow tourists to rate and comment on hotels, drivers, and attractions. Currently there is no mechanism for user feedback, which is critical for building trust and helping tourists make informed decisions. The database schema (docs/database.md) defines the `reviews` table with explicit FK columns, and the Eloquent model needs to be implemented to match.

## What Changes

- Create a new `reviews` migration with explicit FK columns (`hotel_id`, `driver_id`, `attraction_id`) instead of polymorphic relationships
- Create the `Review` Eloquent model with `belongsTo` relationships to User, Hotel, Driver, and Attraction
- Add database indexes on all FK columns for query performance
- Add CHECK constraint ensuring at least one of `hotel_id`, `driver_id`, or `attraction_id` is NOT NULL
- Add validation for rating (1-5 range) at the model level
- Implement a working `down()` method for migration rollback

## Capabilities

### New Capabilities

- `reviews`: Core reviews system covering the migration, Eloquent model, relationships, validation, and constraints for user-submitted ratings and comments on hotels, drivers, and attractions.

### Modified Capabilities

- `hotels`: Add `reviews()` HasMany relationship to Hotel model
- `drivers`: Add `reviews()` HasMany relationship to Driver model
- `attractions`: Add `reviews()` HasMany relationship to Attraction model

## Impact

- **Database**: New `reviews` table created via migration
- **Models**: New `Review` model; existing `Hotel`, `Driver`, `Attraction` models gain `reviews()` relationship
- **Validation**: Rating constrained to 1-5 at database and model level
- **No breaking changes**: Additive only; no existing tables modified
