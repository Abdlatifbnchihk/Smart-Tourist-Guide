## Why

The API route `hotel-manager/manage-rooms` is already registered in `routes/api.php:128` referencing `App\Http\Controllers\HotelManager\RoomController`, but the controller class does not exist. Hotel Manager Room Management pages (D4, D5) depend on this backend endpoint. Without it, hotel managers cannot manage rooms through the UI.

## What Changes

- **New** `RoomController` in `app/Http/Controllers/HotelManager/RoomController.php` with apiResource methods: `index`, `store`, `show`, `update`, `destroy`, plus custom `restore` and `forceDelete`.
- All methods enforce hotel ownership — a hotel manager can only operate on rooms belonging to hotels they created.
- Room number uniqueness validated per hotel (not globally).
- Soft delete via `restore`, `forceDelete` endpoints leveraging the existing `SoftDeletes` trait on the `Room` model.
- Form requests `StoreRoomRequest` and `UpdateRoomRequest` updated to include `hotel_id` validation scoped to the authenticated user's hotels.

## Capabilities

### New Capabilities
- `hotel-manager-room-management`: CRUD operations for hotel rooms under the hotel_manager role, including ownership scoping, soft deletes, and restore/permanent-delete workflows.

### Modified Capabilities

(none)

## Impact

- **New file**: `app/Http/Controllers/HotelManager/RoomController.php`
- **Modified files**: `app/Http/Requests/StoreRoomRequest.php`, `app/Http/Requests/UpdateRoomRequest.php` (add `hotel_id` ownership validation)
- **Existing dependencies reused**: `Room` model (SoftDeletes), `RoomResource`, `StoreRoomRequest`, `UpdateRoomRequest`
- **No new packages or migrations required**
