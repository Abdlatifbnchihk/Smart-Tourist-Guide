## Why

The hotel booking service layer (`HotelBookingService`) is complete but has no HTTP interface. Tourists cannot create or manage bookings via the API, and hotel owners cannot confirm or complete bookings. We need a RESTful controller to expose booking operations with proper role-based access control.

## What Changes

- Add `HotelBookingController` with 5 endpoints for booking management
- Create `StoreHotelBookingRequest` form request for validation
- Create `HotelBookingResource` for consistent API responses
- Add API routes for hotel bookings
- Implement role-based filtering on index endpoint
- Integrate with existing `HotelBookingService` for business logic

## Capabilities

### New Capabilities
- `hotel-booking-controller`: RESTful API endpoints for hotel booking management with role-based access control, form validation, and API resources

### Modified Capabilities
- `hotel-booking-service`: Requirements unchanged, but controller will depend on service for all business logic

## Impact

- New controller file: `backend/app/Http/Controllers/Api/V1/HotelBookingController.php`
- New form request: `backend/app/Http/Requests/StoreHotelBookingRequest.php`
- New API resource: `backend/app\Http/Resources/HotelBookingResource.php`
- New routes in `backend/routes/api.php`
- Depends on existing `HotelBookingService` and `Booking` model