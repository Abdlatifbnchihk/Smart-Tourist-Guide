## 1. Database

- [x] 1.1 Create migration `add_is_verified_to_drivers_table` adding `is_verified` boolean column (default false) to `drivers` table

## 2. Form Requests

- [x] 2.1 Create `StoreDriverRequest` with rules: `city_id` required|exists:cities,id, `license_number` required|string|max:20|unique:drivers, `years_of_experience` nullable|integer|min:0, `languages` nullable|string|max:255, `available` boolean
- [x] 2.2 Create `UpdateDriverRequest` with same rules using `sometimes` for partial updates, exclude current driver from unique check on license_number

## 3. API Resource

- [x] 3.1 Create `DriverResource` with fields: id, user_id, city_id, license_number, years_of_experience, languages, available, is_verified, created_at, updated_at; include user, city, vehicles, reviews relationships via whenLoaded

## 4. Controller

- [x] 4.1 Create `DriverController` with `index` method: paginated list, filter by city_id, filter by is_verified (verified param), eager load user and city
- [x] 4.2 Add `store` method: validate via StoreDriverRequest, check driver role, set user_id from authenticated user, create driver, return 201
- [x] 4.3 Add `show` method: find driver by ID, eager load user, city, vehicles, reviews.user, return DriverResource
- [x] 4.4 Add `update` method: validate via UpdateDriverRequest, check ownership (user_id matches auth user or admin), update driver, return 200
- [x] 4.5 Add `verify` method: check admin role, toggle is_verified, return 200 with updated driver

## 5. Routes

- [x] 5.1 Update `routes/api.php`: replace `apiResource('drivers', ...)` with explicit routes including `PATCH /drivers/{id}/verify` for admin verification

## 6. Verification

- [x] 6.1 Run `php artisan migrate` to apply is_verified migration
- [x] 6.2 Test all endpoints in Postman: list drivers, create profile (driver + non-driver), show driver, update profile, verify toggle (admin + non-admin)
