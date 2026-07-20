## Context

The Smart Tourist Guide Morocco platform requires a hotels catalog to support lodging bookings. The database design (`docs/database.md`) defines the hotels table with specific columns, relationships, and constraints. This change implements the migration and Eloquent model following existing patterns in the codebase.

## Goals / Non-Goals

**Goals:**
- Create migration matching MLD exactly
- Implement Eloquent model with 4 defined relationships
- Add proper indexing on `city_id`
- Include star rating validation (1-5)

**Non-Goals:**
- Factory/seeder implementation
- API endpoints or controllers
- Policy/authorization logic

## Decisions

**Primary key: `hotel_id` (BIGINT auto-increment)**
- Rationale: Consistent with all other tables in the schema

**Foreign key: `city_id` with restrict on delete**
- Rationale: Hotel cannot exist without a city; prevents accidental cascade

**Star rating validation: `between:1,5`**
- Rationale: MLD specifies 1-5 range for official star classification

**Column types match MLD exactly**
- Rationale: Source of truth is `docs/database.md`

## Risks / Trade-offs

**Low Risk:** Standard migration/model creation
- Mitigation: Follow existing patterns from cities/restaurants
