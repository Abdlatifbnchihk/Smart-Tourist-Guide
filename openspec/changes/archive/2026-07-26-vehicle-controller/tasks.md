## 1. Database

- [x] 1.1 Create migration `add_price_per_km_to_vehicles_table` adding `price_per_km` decimal(10,2) NOT NULL column to `vehicles` table

## 2. Form Requests

- [x] 2.1 Create `StoreVehicleRequest` with rules: `brand` required|string|max:100, `model` required|string|max:100, `type` required|in:sedan,suv,van,minibus, `seats` required|integer|min:1, `registration_number` required|string|max:50|unique:vehicles, `air_conditioning` boolean, `price_per_km` required|numeric|gt:0
- [x] 2.2 Create `UpdateVehicleRequest` with same rules using `sometimes` for partial updates, exclude current vehicle from unique check on registration_number

## 3. API Resource

- [x] 3.1 Update `VehicleResource` to include `price_per_km` field and driver relationship via whenLoaded

## 4. Controller

- [x] 4.1 Create `VehicleController` with `index` method: list vehicles for driver via `/drivers/{driverId}/vehicles`, eager load driver, paginate
- [x] 4.2 Add `store` method: validate via StoreVehicleRequest, check ownership (`$request->user()->id === $driver->user_id || role === administrator`), create vehicle under specified driver, return 201
- [x] 4.3 Add `show` method: find vehicle by ID, eager load driver, return VehicleResource
- [x] 4.4 Add `update` method: validate via UpdateVehicleRequest, check ownership via vehicle's driver, update vehicle, return 200
- [x] 4.5 Add `destroy` method: check ownership via vehicle's driver, delete vehicle, return 200

## 5. Routes

- [x] 5.1 Update `routes/api.php`: replace `apiResource('vehicles', ...)` with nested routes under `/drivers/{driverId}/vehicles` for index and store, standalone `/vehicles/{id}` for show/update/destroy

## 6. Verification

- [x] 6.1 Run `php artisan migrate` to apply price_per_km migration
- [x] 6.2 Test all endpoints in Postman: list vehicles, create vehicle (owner + non-owner), show vehicle, update vehicle, delete vehicle
