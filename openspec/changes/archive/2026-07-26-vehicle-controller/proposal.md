## Why

The `VehicleController` is referenced in `routes/api.php` (line 84) as an `apiResource` but does not exist, causing a 500 error on any vehicle-related route. Vehicles need full CRUD management: listing vehicles per driver, creating vehicles, viewing details, editing, and deleting. The `vehicles` table also lacks a `price_per_km` column needed for fare estimation.

## What Changes

- **New** `VehicleController` with index, store, show, update, destroy methods
- **New** `StoreVehicleRequest` and `UpdateVehicleRequest` form requests for validation
- **Updated** `VehicleResource` to include driver relationship
- **New** migration to add `price_per_km` column to `vehicles` table
- **Updated** routes: nest store/index under drivers, standalone routes for show/update/destroy
- **Ownership validation**: only the vehicle's owner driver (or admin) can create/update/delete

## Capabilities

### New Capabilities
- `vehicle-crud`: Full CRUD operations for vehicles with ownership validation, nested driver routes, type validation, price_per_km

### Modified Capabilities
- `vehicles-management`: Add price_per_km column requirement

## Impact

- **Controllers**: New `app/Http/Controllers/VehicleController.php`
- **Form Requests**: New `app/Http/Requests/StoreVehicleRequest.php`, `app/Http/Requests/UpdateVehicleRequest.php`
- **Resources**: Updated `app/Http/Resources/VehicleResource.php`
- **Migration**: New migration for `price_per_km` column on `vehicles` table
- **Routes**: Updated `routes/api.php` — nest vehicle store/index under drivers, standalone show/update/destroy
