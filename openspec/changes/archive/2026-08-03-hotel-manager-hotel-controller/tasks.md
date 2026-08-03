## 1. Setup

- [x] 1.1 Create `app/Http/Controllers/HotelManager` directory if it doesn't exist
- [x] 1.2 Create `app/Http/Controllers/HotelManager/HotelController.php` with namespace `App\Http\Controllers\HotelManager`
- [x] 1.3 Import required classes: `Controller`, `Hotel`, `StoreHotelRequest`, `UpdateHotelRequest`, `HotelResource`, `Request`, `JsonResponse`, `Response`

## 2. Controller Implementation

- [x] 2.1 Implement `index()` method: filter hotels by `created_by` equal to authenticated user's ID, paginate results, return `HotelResource` collection
- [x] 2.2 Implement `store()` method: use `StoreHotelRequest`, set `created_by` to authenticated user's ID, create hotel, return 201 JSON with hotel data
- [x] 2.3 Implement `show()` method: find hotel by route model binding, check ownership (`created_by` matches authenticated user's ID), load `rooms` and `reviews` relationships, return `HotelResource` or 403 Forbidden
- [x] 2.4 Implement `update()` method: use `UpdateHotelRequest`, check ownership, update hotel, return JSON with updated hotel data or 403 Forbidden
- [x] 2.5 Implement `destroy()` method: check ownership, delete hotel, return 200 JSON success message or 403 Forbidden

## 3. Route Verification

- [x] 3.1 Verify existing route in `routes/api.php` under hotel-manager middleware group points to `App\Http\Controllers\HotelManager\HotelController`
- [x] 3.2 Ensure route uses `apiResource('manage-hotel', ...)` (already defined)

## 4. Verification

- [x] 4.1 Verify index method only returns hotels owned by authenticated user
- [x] 4.2 Verify store method auto-sets `created_by` correctly
- [x] 4.3 Verify show method returns 403 when trying to view another user's hotel
- [x] 4.4 Verify update method returns 403 when trying to update another user's hotel
- [x] 4.5 Verify destroy method returns 403 when trying to delete another user's hotel