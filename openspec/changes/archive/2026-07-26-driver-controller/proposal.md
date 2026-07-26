## Why

The `DriverController` is referenced in `routes/api.php` (line 82) as an `apiResource` but does not exist, causing a 500 error on any driver-related route. Drivers need full profile management: creating profiles, listing drivers with filters, viewing details with vehicles and reviews, editing profiles, and admin-only verification. Without this, the transport/ride-booking module has no way to manage driver profiles.

## What Changes

- **New** `DriverController` with index, store, show, update, and verify methods
- **New** `StoreDriverRequest` and `UpdateDriverRequest` form requests for validation
- **New** `DriverResource` API resource for driver responses with user, city, vehicles, reviews
- **Updated** routes: replace `apiResource` with explicit routes including `PATCH /drivers/{id}/verify`
- **Role restriction**: only `driver` role can create a profile; only own profile can be edited; admin-only verify toggle

## Capabilities

### New Capabilities
- `driver-crud`: Full CRUD operations for driver profiles with role-based access control, ownership validation, and admin verification toggle

### Modified Capabilities
- (none — existing `drivers` spec covers schema/model only, no API behavior changes)

## Impact

- **Controllers**: New `app/Http/Controllers/DriverController.php`
- **Form Requests**: New `app/Http/Requests/StoreDriverRequest.php`, `app/Http/Requests/UpdateDriverRequest.php`
- **Resources**: New `app/Http/Resources/DriverResource.php`
- **Routes**: Updated `routes/api.php` — replace `apiResource('drivers', ...)` with explicit routes
