## Why

The hotel management API endpoints are missing. The platform needs CRUD operations for hotels with proper filtering, search, and ownership validation to allow hotel owners to manage their properties.

## What Changes

- Add `HotelController` with full CRUD operations (index, store, show, update, destroy)
- Add `StoreHotelRequest` and `UpdateHotelRequest` form request validation
- Add `HotelResource` API resource with city, rooms, reviews, and average rating
- Add filtering by city_id, star_rating, min_price, max_price
- Add search by hotel name
- Add ownership validation (only hotel_owner can create/update/delete their hotels)
- Add soft delete support for hotels

## Capabilities

### New Capabilities
- `hotel-crud`: Hotel CRUD operations with ownership validation
- `hotel-filtering`: Filtering and search for hotel listings
- `hotel-resources`: API resources for hotel responses

### Modified Capabilities

## Impact

- New files: `HotelController`, `StoreHotelRequest`, `UpdateHotelRequest`, `HotelResource`
- Modified: `routes/api.php` (add hotel routes)
- Modified: `Hotel` model (add SoftDeletes, owner relationship)
- API: New endpoints for hotel management
