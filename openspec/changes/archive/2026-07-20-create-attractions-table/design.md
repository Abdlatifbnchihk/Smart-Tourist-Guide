## Context

The Smart Tourist Guide Morocco platform requires an attractions catalog to power tourism discovery. The database design (`docs/database.md`) defines the attractions table with specific columns, relationships, and constraints. This change implements the migration and Eloquent model following existing patterns in the codebase.

## Goals / Non-Goals

**Goals:**
- Create migration matching MLD exactly
- Implement Eloquent model with 3 defined relationships
- Add proper indexing on `city_id`

**Non-Goals:**
- Factory/seeder implementation
- API endpoints or controllers
- Policy/authorization logic

## Decisions

**Primary key: `attraction_id` (BIGINT auto-increment)**
- Rationale: Consistent with all other tables in the schema

**Foreign key: `city_id` with restrict on delete**
- Rationale: Attraction cannot exist without a city; prevents accidental cascade

**Column types match MLD exactly**
- Rationale: Source of truth is `docs/database.md`

## Risks / Trade-offs

**Low Risk:** Standard migration/model creation
- Mitigation: Follow existing patterns from hotels/restaurants
