## Context

The Smart Tourist Guide Morocco platform needs a reviews system to allow tourists to rate and comment on hotels, drivers, and attractions. The database schema in `docs/database.md` defines the `reviews` table with explicit FK columns (not polymorphic), and the existing specs for hotels, drivers, and attractions already reference `hasMany(Review::class)` relationships. Currently, no migration or model exists for reviews.

## Goals / Non-Goals

**Goals:**
- Create a `reviews` migration matching the MLD design in `docs/database.md`
- Create a `Review` Eloquent model with all defined relationships
- Ensure the migration has a working `down()` method for rollback
- Add proper indexes on all FK columns
- Enforce at least one of `hotel_id`, `driver_id`, or `attraction_id` is NOT NULL via CHECK constraint

**Non-Goals:**
- Implementing review creation API endpoints (separate change)
- Adding authentication/authorization logic for reviews
- Implementing unique composite indexes for one-review-per-entity (not in MLD)
- Modifying existing Hotel, Driver, or Attraction models (relationships already defined in specs)

## Decisions

### 1. Explicit FK columns over polymorphic relationships
**Decision**: Use three nullable FK columns (`hotel_id`, `driver_id`, `attraction_id`) instead of `reviewable_id`/`reviewable_type` polymorphic columns.

**Rationale**: The MLD design in `docs/database.md` explicitly specifies this approach. It provides:
- Direct foreign key constraints for data integrity
- Simpler queries (no morph map resolution)
- Better index performance for entity-specific queries
- Consistency with the `favorites` table which uses the same pattern

**Alternatives considered**: Polymorphic relationships (rejected per MLD design).

### 2. CHECK constraint for at-least-one-FK
**Decision**: Use a MySQL CHECK constraint to ensure at least one of `hotel_id`, `driver_id`, or `attraction_id` is NOT NULL.

**Rationale**: Enforces the business rule at the database level. MySQL 8.0 supports CHECK constraints natively.

**Implementation**: `CHECK (hotel_id IS NOT NULL OR driver_id IS NOT NULL OR attraction_id IS NOT NULL)`

### 3. Model-level validation for rating range
**Decision**: Add a custom validation rule or cast to ensure `rating` is between 1 and 5.

**Rationale**: The MLD specifies `TINYINT UNSIGNED` for rating but the 1-5 range is a business rule best enforced at the model level via Laravel validation rules.

### 4. No morph map or morphMany/morphTo
**Decision**: Use only `belongsTo` relationships. No `MorphMap`, `MorphMany`, or `MorphTo` relationships.

**Rationale**: Explicit FK columns eliminate the need for polymorphic relationships. This simplifies the model and avoids the `Relation::morphMap()` registration.

## Risks / Trade-offs

- **[Risk]** CHECK constraint may not be enforced on older MySQL versions → **Mitigation**: Platform targets MySQL 8.0 which supports CHECK constraints natively.
- **[Risk]** Multiple nullable FKs could allow invalid states (no FK set) → **Mitigation**: CHECK constraint prevents this at the database level.
- **[Trade-off]** Three FK columns instead of two (polymorphic) adds schema complexity → **Accepted**: Gains data integrity and query simplicity per MLD design.

## Migration Plan

1. Run `php artisan make:migration create_reviews_table`
2. Implement the `up()` method with all columns, indexes, FK constraints, and CHECK constraint
3. Implement the `down()` method to drop the table
4. Create `Review` model with relationships, fillable attributes, and casts
5. Run `php artisan migrate` to apply
6. Verify with `php artisan migrate:rollback` that `down()` works
