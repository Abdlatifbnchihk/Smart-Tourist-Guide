## Context

The Smart Tourist Guide Morocco platform needs a favorites/bookmarks system to let tourists save hotels, restaurants, and attractions for quick future access. The database schema in `docs/database.md` defines the `favorites` table with explicit FK columns (not polymorphic) and partial unique indexes to prevent duplicate favorites per entity type.

## Goals / Non-Goals

**Goals:**
- Create a `favorites` migration matching the MLD design in `docs/database.md`
- Create a `Favorite` Eloquent model with all defined relationships
- Add partial unique indexes to prevent duplicate favorites per entity type per user
- Ensure the migration has a working `down()` method for rollback
- Enforce at least one of `hotel_id`, `restaurant_id`, or `attraction_id` is NOT NULL via CHECK constraint

**Non-Goals:**
- Implementing favorite creation/removal API endpoints (separate change)
- Adding authentication/authorization logic for favorites
- Implementing bulk favorite operations
- Modifying existing Hotel, Restaurant, or Attraction models

## Decisions

### 1. Explicit FK columns over polymorphic relationships
**Decision**: Use three nullable FK columns (`hotel_id`, `restaurant_id`, `attraction_id`) instead of `favorable_id`/`favorable_type` polymorphic columns.

**Rationale**: The MLD design in `docs/database.md` explicitly specifies this approach. It provides:
- Direct foreign key constraints for data integrity
- Simpler queries (no morph map resolution)
- Better index performance for entity-specific queries
- Consistency with the `reviews` table which uses the same pattern

**Alternatives considered**: Polymorphic relationships (rejected per MLD design).

### 2. Partial unique indexes for deduplication
**Decision**: Use partial unique indexes with WHERE clauses to prevent duplicate favorites per entity type per user.

**Rationale**: The MLD specifies unique composite indexes per entity type. MySQL supports partial indexes via conditional syntax.

**Implementation**: Unique constraints on `(user_id, hotel_id)`, `(user_id, restaurant_id)`, and `(user_id, attraction_id)` where the entity FK is NOT NULL.

### 3. CHECK constraint for at-least-one-FK
**Decision**: Use a MySQL CHECK constraint to ensure at least one of `hotel_id`, `restaurant_id`, or `attraction_id` is NOT NULL.

**Rationale**: Enforces the business rule at the database level. MySQL 8.0 supports CHECK constraints natively.

### 4. No morph map or morphMany/morphTo
**Decision**: Use only `belongsTo` relationships. No `MorphMap`, `MorphMany`, or `MorphTo` relationships.

**Rationale**: Explicit FK columns eliminate the need for polymorphic relationships. This simplifies the model and avoids the `Relation::morphMap()` registration.

## Risks / Trade-offs

- **[Risk]** CHECK constraint may not be enforced on older MySQL versions → **Mitigation**: Platform targets MySQL 8.0 which supports CHECK constraints natively.
- **[Risk]** Multiple nullable FKs could allow invalid states (no FK set) → **Mitigation**: CHECK constraint prevents this at the database level.
- **[Trade-off]** Three FK columns instead of two (polymorphic) adds schema complexity → **Accepted**: Gains data integrity and query simplicity per MLD design.

## Migration Plan

1. Run `php artisan make:migration create_favorites_table`
2. Implement the `up()` method with all columns, indexes, FK constraints, and CHECK constraint
3. Implement the `down()` method to drop the table
4. Create `Favorite` model with relationships, fillable attributes
5. Run `php artisan migrate` to apply
6. Verify with `php artisan migrate:rollback` that `down()` works
