## Why

The TransportBookingController currently lacks an index endpoint for listing transport bookings. Tourists cannot view their own transport bookings, and drivers cannot see their assigned transport bookings. This is a required feature for the Postman API testing and production use.

## What Changes

- Add `index` method to TransportBookingController with role-based filtering
- Tourist sees only own transport bookings
- Driver sees only assigned transport bookings
- Paginated response with eager-loaded relationships
- Add GET route for transport-bookings index

## Capabilities

### New Capabilities

(none - extending existing capability)

### Modified Capabilities

- `transport-booking-service`: Add index/list requirement with role-based filtering for tourist and driver roles

## Impact

- Modified file: `backend/app/Http/Controllers/Api/V1/TransportBookingController.php`
- Modified file: `backend/routes/api.php`
- New test: `backend/tests/Feature/Api/V1/TransportBookingControllerTest.php` (add index tests)
