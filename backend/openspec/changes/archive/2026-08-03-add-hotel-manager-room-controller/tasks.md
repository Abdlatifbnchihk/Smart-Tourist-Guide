## 1. Form Request Authorization

- [x] 1.1 Update `StoreRoomRequest::authorize()` to verify the `hotel_id` belongs to a hotel created by the authenticated user; return false (403) otherwise
- [x] 1.2 Update `UpdateRoomRequest::authorize()` to verify the target room's hotel was created by the authenticated user; return false (403) otherwise
- [x] 1.3 Add unique-per-hotel validation rule for `number` field in `StoreRoomRequest` (unique:rooms,number,NULL,room_id,hotel_id,{hotel_id})
- [x] 1.4 Add unique-per-hotel validation rule for `number` field in `UpdateRoomRequest` (unique:rooms,number,{room_id},room_id,hotel_id,{hotel_id})

## 2. RoomController Implementation

- [x] 2.1 Create `app/Http/Controllers/HotelManager/RoomController.php` with class skeleton, imports, and namespace matching `HotelController`
- [x] 2.2 Implement `index()` — paginate rooms where `hotel.created_by` equals authenticated user, return `RoomResource::collection`
- [x] 2.3 Implement `store()` — use `StoreRoomRequest`, create room, return `RoomResource` with HTTP 201
- [x] 2.4 Implement `show()` — load room via route model binding, verify ownership, return `RoomResource` or 403
- [x] 2.5 Implement `update()` — use `UpdateRoomRequest`, verify ownership, update room, return updated `RoomResource` or 403
- [x] 2.6 Implement `destroy()` — verify ownership, soft-delete room, return success message or 403
- [x] 2.7 Implement `restore()` — accept trashed room via `withTrashed()` route binding, verify ownership, restore room, return `RoomResource` or 403
- [x] 2.8 Implement `forceDelete()` — accept trashed room, verify ownership, permanently delete, return success message or 403

## 3. Route Registration

- [x] 3.1 Add custom routes for `restore` and `forceDelete` actions inside the `manage-rooms` apiResource group (POST `/{room}/restore`, DELETE `/{room}/force-delete`)
- [x] 3.2 Ensure `manage-rooms` apiResource only registers standard methods (index, store, show, update, destroy) and custom routes handle the rest

## 4. Verification

- [x] 4.1 Verify the controller is loadable: `php artisan tinker` → `App\Http\Controllers\HotelManager\RoomController`
- [x] 4.2 Run any existing test suite or manual check that routes resolve correctly
