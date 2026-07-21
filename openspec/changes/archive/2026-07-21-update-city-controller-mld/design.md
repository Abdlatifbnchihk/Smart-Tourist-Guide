## Context

The CityController is part of the catalog routes for the Smart Tourist Guide Morocco platform. The MLD schema defines cities with columns: `city_id`, `name`, `region`, `description`. The current CityController may include extra columns (`country`, `image`, `latitude`, `longitude`) that are not in the MLD schema. Additionally, cities have relationships to hotels, restaurants, attractions, and drivers; the API should expose counts for these relationships.

## Goals / Non-Goals

**Goals:**
- Align CityController with MLD schema (remove non-existent columns)
- Add `restaurants_count` to API responses
- Ensure validation rules match MLD columns
- Maintain backward compatibility for existing consumers where feasible

**Non-Goals:**
- Changing database schema (already defined)
- Adding new endpoints for cities (already exists)
- Modifying other controllers (hotels, attractions, etc.)

## Decisions

1. **Remove `country`, `image`, `latitude`, `longitude` from CityResource and validation rules**
   - Rationale: These columns do not exist in MLD schema; including them would cause errors and misrepresent data.

2. **Add `restaurants_count` as a computed relationship count using `withCount('restaurants')`**
   - Rationale: The MLD schema defines a `hasMany` relationship between cities and restaurants; the API should expose this count for frontend display.

3. **Include restaurants relationship in `show()` method using `load('restaurants')`**
   - Rationale: User requirement to include restaurants relationship in show endpoint.

4. **Keep `name` and `description` as required fields, `region` as optional (per MLD)**
   - Rationale: MLD schema defines `name` (required), `description` (nullable), `region` (nullable). User explicitly said keep name and description; region is not mentioned but exists in MLD, so keep as optional.

5. **Use Eloquent's `withCount` for `restaurants_count`, `hotels_count`, `attractions_count`**
   - Rationale: Efficiently provides counts without loading full relationships; aligns with existing pattern for hotels/attractions counts.

## Risks / Trade-offs

- **Removing columns may break existing frontend consumers** → Mitigation: Communicate changes to frontend team; consider API versioning if needed.
- **Adding `restaurants_count` may increase query load** → Mitigation: Use eager loading with count, which is efficient and follows existing pattern for other counts.