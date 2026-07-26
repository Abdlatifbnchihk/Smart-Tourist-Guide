## 1. Database & Model

- [x] 1.1 Create migration `add_soft_deletes_to_rooms_table` adding `deleted_at` timestamp column to `rooms` table
- [x] 1.2 Update `Room` model: add `SoftDeletes` trait, add `deleted_at` to casts

## 2. Form Requests

- [x] 2.1 Create `StoreRoomRequest` with rules: `number` required|string|max:20, `type` required|string|max:50, `capacity` required|integer|min:1, `price_per_night` required|numeric|gt:0, `available` boolean
- [x] 2.2 Create `UpdateRoomRequest` with same rules using `sometimes` for partial updates

## 3. API Resource

- [x] 3.1 Update `RoomResource` to use correct field names: `number`, `type`, `price_per_night`, `available`; add `hotel` relationship via `whenLoaded`

## 4. Controller

- [x] 4.1 Create `RoomController` with `index` method: list rooms for hotel via `/hotels/{hotelId}/rooms`, eager load hotel, apply filters (type, available, min_price, max_price), paginate
- [x] 4.2 Add `store` method: validate via `StoreRoomRequest`, check ownership (`$request->user()->id === $hotel->created_by || role === administrator`), create room under specified hotel, return 201
- [x] 4.3 Add `show` method: find room by ID, eager load hotel, return `RoomResource`
- [x] 4.4 Add `update` method: validate via `UpdateRoomRequest`, check ownership via room's parent hotel, update room, return 200
- [x] 4.5 Add `destroy` method: check ownership via room's parent hotel, soft delete room, return 200

## 5. Routes

- [x] 5.1 Update `routes/api.php`: replace `apiResource('rooms', ...)` with nested routes under `/hotels/{hotelId}/rooms` for index and store, standalone `/rooms/{id}` for show/update/destroy

## 6. Verification

- [x] 6.1 Run `php artisan migrate` to apply soft deletes migration
- [x] 6.2 Test all endpoints in Postman: list rooms, create room (owner + non-owner), show room, update room, delete room
