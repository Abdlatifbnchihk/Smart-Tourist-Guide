## Context

The attractions table currently has: id, city_id, name, description, address, opening_hours, timestamps. The AttractionController implementation requires two additional columns:
- `slug` for SEO-friendly URLs
- `created_by` for ownership tracking

These columns were added to the model but the migration was not created, causing a schema mismatch.

## Goals / Non-Goals

**Goals:**
- Add `slug` column with unique constraint for SEO-friendly URLs
- Add `created_by` column with foreign key to users table
- Maintain backward compatibility with existing data
- Update documentation to reflect schema changes

**Non-Goals:**
- Modify existing attraction data (slug will be null for existing records)
- Add slug generation for other entities (hotels, restaurants)
- Implement complex URL routing changes

## Decisions

### 1. Migration Strategy
**Decision:** Create a new migration file to add columns
**Rationale:** Follows Laravel conventions, allows rollback, maintains migration history
**Alternatives considered:**
- Modify existing migration: Rejected - would break existing deployments

### 2. Slug Uniqueness
**Decision:** Add unique index on slug column
**Rationale:** Ensures SEO-friendly URLs are unique, prevents duplicate slugs
**Alternatives considered:**
- No unique constraint: Rejected - would cause URL conflicts

### 3. Foreign Key Constraint
**Decision:** Add foreign key constraint on created_by to users table
**Rationale:** Maintains data integrity, follows relational database best practices
**Alternatives considered:**
- No foreign key: Rejected - would allow orphaned records

### 4. Default Values
**Decision:** Set slug default to NULL, created_by default to NULL
**Rationale:** Allows existing records to remain valid, new records will have values populated
**Alternatives considered:**
- Required columns: Rejected - would break existing data

## Risks / Trade-offs

**Risk 1:** Existing records will have NULL slug values
→ Mitigation: Slug is nullable, existing records remain valid

**Risk 2:** Slug uniqueness may fail if duplicate names exist
→ Mitigation: Controller appends random suffix for duplicates

**Risk 3:** Foreign key constraint may prevent deletion of users with attractions
→ Mitigation: Use restrictOnDelete to prevent accidental deletion

## Migration Plan

1. Run migration to add columns
2. Verify existing data remains intact
3. Test new attraction creation with slug generation
4. Update documentation

## Open Questions

- Should existing attractions have slugs generated retroactively?
- What happens if a user is deleted who created attractions?
