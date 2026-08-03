## Context

The Smart Tourist Guide backend has an existing `HotelManager\HotelController` providing CRUD for hotels. Routes for `manage-rooms` (apiResource) are already wired in `routes/api.php:128` under the `role:hotel_manager` middleware, but the referenced controller class `App\Http\Controllers\HotelManager\RoomController` does not exist. The `Room` model already supports `SoftDeletes` and has form requests (`StoreRoomRequest`, `UpdateRoomRequest`) and a `RoomResource` in place.

## Goals / Non-Goals

**Goals:**
- Implement a complete `RoomController` satisfying the apiResource contract (index, store, show, update, destroy) plus `restore` and `forceDelete` custom actions.
- Enforce that every room operation is scoped to the authenticated hotel manager's own hotels.
- Validate room number uniqueness per hotel (not globally).
- Reuse existing `StoreRoomRequest`, `UpdateRoomRequest`, and `RoomResource` without duplication.

**Non-Goals:**
- Modifying the Room model schema or adding migrations (fields are already defined).
- Implementing image upload or room amenities (not requested).
- Changing the existing `HotelController` behaviour.

## Decisions

| Decision | Choice | Rationale |
|---|---|---|
| **Controller location** | `app/Http/Controllers/HotelManager/RoomController.php` | Matches existing `HotelController` convention under the same namespace. |
| **Ownership enforcement** | Inline check in each method (`$room->hotel->created_by === $request->user()->id`) | Mirrors the pattern already used in `HotelController`. Consistent and explicit. |
| **Hotel_id on store** | Resolve from the authenticated user's hotels; validate `hotel_id` exists and belongs to user | Prevents a manager from assigning a room to another manager's hotel. The existing `StoreRoomRequest` already requires `hotel_id` — extend its `authorize()` to verify ownership. |
| **Room number uniqueness** | Unique per hotel (`unique:rooms,number,NULL,room_id,hotel_id,$hotelId`) | Business rule: room "101" can exist in different hotels but must be unique within one hotel. |
| **Soft delete / restore / forceDelete** | Dedicated `restore` and `forceDelete` methods accepting a trashed model via route-model binding with `withTrashed()` | Leverages the existing `SoftDeletes` trait. Clean separation from standard `destroy`. |
| **Form request updates** | Update `StoreRoomRequest::authorize()` and `UpdateRoomRequest::authorize()` to check hotel ownership | Keeps authorization logic in the request layer, consistent with Laravel conventions. |
| **Response format** | Return `RoomResource` for single items, `RoomResource::collection` for lists | Already defined in the codebase; consistent across all controllers. |

**Alternatives considered:**
- *Policy-based authorization*: More scalable but overkill for two controllers; can be refactored later.
- *Scope queries via middleware*: Would require a new middleware class; inline checks are clearer for this scope.

## Risks / Trade-offs

- [Race condition on room number uniqueness] → mitigated by database-level unique constraint per hotel; validation alone is not sufficient.
- [Trashed rooms returned in index by default] → index will exclude trashed rooms (`whereNull('deleted_at')`); managers can filter via query param if needed.
- [Form request authorize() now has business logic] → acceptable because the existing `HotelController` already follows this pattern; can be extracted to a Policy later.
