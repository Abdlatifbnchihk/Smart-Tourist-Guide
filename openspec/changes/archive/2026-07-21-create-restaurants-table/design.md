## Context

The Smart Tourist Guide Morocco platform requires a restaurants catalog entity to enable tourists to discover dining options within cities. The database schema is defined in `docs/database.md` but the actual table, model, and API endpoints are missing. This change adds the foundational restaurants entity with basic CRUD operations.

## Goals / Non-Goals

**Goals:**
- Create `restaurants` table with exact columns from MLD design
- Add `price_range` validation (1-4) as specified
- Implement Eloquent model with `belongsTo(City::class)` relationship
- Provide API endpoints for restaurant CRUD operations
- Follow existing code patterns for consistency

**Non-Goals:**
- Complex filtering/search beyond basic CRUD
- Relationships to favorites (will be added in separate change)
- Advanced validation or business rules beyond schema

## Decisions

1. **Migration pattern**: Use `foreignId('city_id')->constrained('cities')->restrictOnDelete()->index()` following existing hotel migration pattern
   - Rationale: Consistent with existing codebase, ensures referential integrity

2. **price_range validation**: Use `nullable|integer|between:1,4` validation rule
   - Rationale: Matches user specification of TINYINT UNSIGNED NULLABLE (1-4)

3. **Model fillable attributes**: Include all columns except timestamps and primary key
   - Rationale: Allows mass assignment for create/update operations

4. **Resource transformation**: Follow CityResource pattern with conditional loading of counts
   - Rationale: Consistent API response format across catalog entities

5. **Controller structure**: Implement standard apiResource methods (index, store, show, update, destroy)
   - Rationale: Follows Laravel conventions and existing controller patterns

## Risks / Trade-offs

- **price_range validation** → Ensure client sends integer values between 1-4; mitigation: server-side validation
- **Missing favorites relationship** → Will need separate change to add hasMany(Favorite::class); mitigation: document as future work
- **No soft deletes** → Hard delete may cause issues with favorites; mitigation: use restrictOnDelete for foreign key