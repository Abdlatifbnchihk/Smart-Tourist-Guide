## Why

The application needs a complete, well-structured API routing layer with proper versioning, authentication, and role-based access control. Currently, most routes are commented out and the API structure is incomplete. A properly organized routes file is essential for implementing all CRUD operations across the application.

## What Changes

- Complete `routes/api.php` with all route groups under `/api/v1` prefix
- Uncomment and implement auth routes (register, login, logout, me)
- Implement resource routes for all entities (cities, attractions, hotels, rooms, drivers, vehicles)
- Implement booking routes (hotel-bookings, transport-bookings)
- Implement review and favorite routes
- Implement AI itinerary route
- Add role-based middleware for admin, hotel_manager, and driver routes
- Proper HTTP methods for all endpoints (GET, POST, PUT/PATCH, DELETE)

## Capabilities

### New Capabilities
- `api-routing`: Complete API route structure with versioning, authentication, and role-based access control

### Modified Capabilities
- `api-authentication`: Add register, login, logout, me routes to auth routes

## Impact

- **Files Modified**: `backend/routes/api.php`
- **Controllers**: Will need to create placeholder controllers for all resource routes
- **Middleware**: Uses existing `auth:sanctum` and `role:admin` middleware
- **API**: All endpoints will be accessible under `/api/v1/` prefix
