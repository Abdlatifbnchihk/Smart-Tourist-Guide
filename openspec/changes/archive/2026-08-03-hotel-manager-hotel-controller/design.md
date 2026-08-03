## Context

The Hotel Manager Dashboard pages (D2, D3) require a backend API for hotel managers to manage their own hotels. Currently, the only hotel management controller is `App\Http\Controllers\Api\V1\HotelController`, which provides generic CRUD operations without role restrictions and lists all hotels (not filtered by owner). The hotel manager role needs a dedicated controller that restricts access to hotel managers, filters hotels by ownership, and ensures only owners can view, update, or delete their hotels.

## Goals / Non-Goals

**Goals:**
- Provide a RESTful API for hotel managers to manage their own hotels
- Restrict access to users with the `Hotel Manager` role
- Filter hotel listings to show only hotels created by the authenticated user
- Auto-set `created_by` to the authenticated user on hotel creation
- Validate ownership before showing, updating, or deleting a hotel
- Maintain consistency with existing hotel CRUD patterns

**Non-Goals:**
- Modifying the existing `Api\V1\HotelController` (which serves public listings)
- Changing the `Hotel` model or database schema
- Implementing hotel manager role assignment or permissions beyond the existing ENUM system
- Adding new frontend components (only the backend API)

## Decisions

### 1. Create a separate controller under `HotelManager` namespace
**Decision:** Place the controller in `app/Http/Controllers/HotelManager/HotelController.php`.  
**Rationale:** Follows the existing pattern for role-specific controllers (e.g., `Admin\AdminController`). Keeps role-specific logic isolated and avoids polluting the public API controller.

### 2. Use the same `Hotel` model and `created_by` field
**Decision:** Leverage the existing `Hotel` model and its `created_by` column (already used by the public controller).  
**Rationale:** No schema changes needed; the `created_by` field already stores the user ID of the creator. The model already has relationships for city, rooms, and reviews.

### 3. Apply `role:hotel_manager` middleware
**Decision:** Use the existing `role:hotel_manager` middleware on the route group.  
**Rationale:** Ensures only users with the `Hotel Manager` role can access these endpoints. The middleware is already registered and used for other hotel manager routes.

### 4. Filter index by `created_by`
**Decision:** The `index` method should only return hotels where `created_by` equals the authenticated user's ID.  
**Rationale:** Hotel managers should only see their own hotels, not all hotels in the system.

### 5. Ownership validation for show/update/destroy
**Decision:** Before showing, updating, or deleting a hotel, verify that `created_by` matches the authenticated user's ID.  
**Rationale:** Prevents hotel managers from accessing or modifying hotels they don't own. Returns 403 Forbidden if ownership check fails.

### 6. Reuse existing form request classes
**Decision:** Use `StoreHotelRequest` and `UpdateHotelRequest` from `App\Http\Requests`.  
**Rationale:** These already contain validation rules for hotel fields. No need to duplicate validation logic.

## Risks / Trade-offs

- **Risk:** The `created_by` field might not be indexed, causing performance issues with large datasets.  
  **Mitigation:** The hotels table is expected to be small per manager. If performance becomes an issue, add an index on `created_by`.

- **Risk:** The existing public `HotelController` also sets `created_by` and checks ownership for update/delete. There may be duplication.  
  **Mitigation:** The new controller is role-specific and filters by ownership, while the public controller is for general access. Both can coexist.

- **Trade-off:** Not using a dedicated Resource class for the hotel manager endpoints.  
  **Justification:** The existing `HotelResource` can be reused, keeping response consistent across controllers.