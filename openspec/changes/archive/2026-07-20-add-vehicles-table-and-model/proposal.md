## Why

The transport/ride-booking module requires a vehicles table to store and manage driver vehicles. This is essential for the booking system to associate vehicles with driver assignments, enabling fare estimation and ride matching based on vehicle capacity and features.

## What Changes

- Add `vehicles` migration table with all MLD-compliant columns
- Create `Vehicle` Eloquent model with relationships to `Driver` and `Booking`
- Implement validation rules for vehicle attributes
- Add indexes for driver lookups and unique registration number constraint

## Capabilities

### New Capabilities
- `vehicles-management`: Vehicle CRUD operations and model relationships for the transport module

### Modified Capabilities
- `drivers`: Drivers will now have a `hasMany` relationship to vehicles (existing driver spec if modified at spec level)

## Impact

- New migration file in `database/migrations/`
- New model file `app/Models/Vehicle.php`
- Related changes to `Driver` model to add `vehicles()` relationship
- Affects transport booking flow and driver vehicle management
