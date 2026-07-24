## Context

The Smart Tourist Guide platform already has an `attractions` table with columns: id, city_id, name, description, address, opening_hours, timestamps. The Attraction model exists but lacks soft deletes and proper CRUD endpoints. The platform uses Laravel Sanctum for API authentication with role-based middleware (admin, hotel_manager, driver, tourist). Existing controllers follow a consistent pattern with Form Requests for validation and API Resources for responses.

## Goals / Non-Goals

**Goals:**
- Implement complete CRUD operations for attraction management
- Add filtering by city_id, category, price range, and rating
- Add search functionality by attraction name
- Auto-generate URL-friendly slugs from attraction names
- Implement soft deletes to preserve data integrity
- Return consistent JSON responses using API Resources
- Include reviews and average_rating in attraction detail responses

**Non-Goals:**
- Image upload/storage for attractions (can be added later)
- Category management system (categories will be string-based for now)
- Price management (attractions don't have prices in current schema)
- Booking/reservation system for attractions
- Geolocation or map integration

## Decisions

### 1. Controller Location and Structure
**Decision:** Create `App\Http\Controllers\Api\V1\AttractionController`
**Rationale:** Follows existing project structure (Controllers/Api/V1/) and naming conventions. V1 namespace allows future API versioning.
**Alternatives considered:**
- Resource Controller: Would work but we need custom filtering logic
- Single Action Controllers: Overkill for standard CRUD

### 2. Form Request Validation
**Decision:** Create separate `StoreAttractionRequest` and `UpdateAttractionRequest` classes
**Rationale:** Follows Laravel best practices, keeps controller clean, allows reuse. Update request excludes current attraction ID from unique validation.
**Alternatives considered:**
- Inline validation in controller: Rejected - violates SRP and makes testing harder
- Single request class: Rejected - can't handle unique-except-current properly

### 3. Slug Generation
**Decision:** Auto-generate slug from name using `Str::slug()` in controller, not in request
**Rationale:** Slugs are derived data, not user input. Controller logic allows proper handling of duplicate slugs (append -1, -2, etc.).
**Alternatives considered:**
- Model mutator: Would trigger on every save, even when slug is explicitly provided
- Observer: Overkill for this use case

### 4. Soft Deletes
**Decision:** Add `SoftDeletes` trait to Attraction model
**Rationale:** Preserves data integrity, allows recovery, maintains foreign key relationships with reviews and favorites.
**Alternatives considered:**
- Hard delete: Would cascade delete reviews/favorites (data loss)
- Status flag: More complex, requires additional queries

### 5. Filtering Implementation
**Decision:** Use query builder with conditional WHERE clauses in controller
**Rationale:** Simple, maintainable, and follows existing patterns in the codebase. No need for complex filter packages.
**Alternatives considered:**
- Spatie Query Builder: Would add unnecessary dependency
- Scope-based: Less flexible for optional filters

### 6. Average Rating Calculation
**Decision:** Calculate in AttractionResource using loaded reviews relationship
**Rationale:** Keeps controller clean, allows caching later, follows resource pattern.
**Alternatives considered:**
- Database column: Would need trigger/sync logic
- Separate API call: Inefficient for client

## Risks / Trade-offs

**Risk 1:** Search performance with LIKE queries on large datasets
→ Mitigation: Add index on name column if needed, implement pagination

**Risk 2:** Slug uniqueness conflicts when multiple attractions have same name
→ Mitigation: Append random suffix or incrementing number in controller

**Risk 3:** N+1 queries when loading reviews for multiple attractions
→ Mitigation: Use `with('reviews')` eager loading in index query

**Risk 4:** Category filtering requires string matching (no category table)
→ Mitigation: Document category values, consider adding category table later

**Trade-off:** Calculating average_rating in resource vs database column
→ Chose resource calculation for simplicity, can optimize with column later if needed
