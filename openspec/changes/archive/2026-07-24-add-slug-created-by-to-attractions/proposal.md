## Why

The AttractionController implementation requires `slug` and `created_by` columns that don't exist in the current attractions table schema. These columns are needed for:
- **slug**: SEO-friendly URLs for attractions (e.g., `/attractions/jardin-majorelle`)
- **created_by**: Track which user created an attraction for ownership validation in update/delete operations

Without these columns, the attraction CRUD functionality will fail at runtime.

## What Changes

- Add `slug` column (VARCHAR, unique) to attractions table via new migration
- Add `created_by` column (BIGINT FK to users) to attractions table via new migration
- Update database documentation to reflect new columns
- Update MCD/MLD diagrams to include new columns

## Capabilities

### New Capabilities

- `attraction-slug`: Auto-generated URL-friendly slugs for attractions
- `attraction-ownership`: Track attraction creator for authorization

### Modified Capabilities

- `attraction-crud`: Add slug generation and ownership tracking to create/update operations

## Impact

- **Database**: New migration to add columns to attractions table
- **Models**: Attraction model already updated with slug and created_by in fillable
- **Controllers**: AttractionController already uses these columns
- **Documentation**: database.md needs update
- **Diagrams**: MCD.svg and MLD.svg need update
