## Why

The `RoomController` is referenced in `routes/api.php` (line 72) but does not exist, causing a 500 error on any room-related route. Hotels need full room management: listing rooms per hotel, creating rooms, viewing details with availability, editing, and soft deleting. Without this, the booking engine has no way to manage room inventory.

## What Changes

- **New** `RoomController` with index, store, show, update, destroy methods
- **New** `StoreRoomRequest` and `UpdateRoomRequest` form requests for validation
- **Updated** `RoomResource` to match actual migration columns (`type`, `price_per_night`, `available`) and include hotel relationship
- **New** migration to add `deleted_at` soft deletes column to `rooms` table
- **Updated** `Room` model to use `SoftDeletes` trait
- **Updated** routes: nest store/index under hotels, standalone routes for show/update/destroy
- **Ownership validation**: only the hotel owner (or admin) can create/update/delete rooms on their hotel

## Capabilities

### New Capabilities
- `room-crud`: Full CRUD operations for hotel rooms with ownership validation, nested hotel routes, soft deletes
- `room-filtering`: Filter rooms by hotel, type, availability, and price range on the index endpoint
- `room-resources`: Updated API resource for room responses including hotel relationship and availability calculation

### Modified Capabilities
- `rooms`: Add soft deletes requirement and update validation rules to match new form requests

## Impact

- **Controllers**: New `app/Http/Controllers/RoomController.php`
- **Form Requests**: New `app/Http/Requests/StoreRoomRequest.php`, `app/Http/Requests/UpdateRoomRequest.php`
- **Resources**: Updated `app/Http/Resources/RoomResource.php`
- **Models**: Updated `app/Models/Room.php` (add SoftDeletes)
- **Migration**: New migration for `deleted_at` column on `rooms` table
- **Routes**: Updated `routes/api.php` — nest room store/index under hotels, standalone show/update/destroy
