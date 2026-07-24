## Why

The Smart Tourist Guide platform needs a complete attraction management system. Tourists need to discover attractions by city, category, price, and rating. Admins and hotel managers need to create, edit, and manage attraction listings. Without proper CRUD endpoints with filtering and search, the platform cannot serve its core purpose of helping tourists discover local attractions.

## What Changes

- Add `GET /api/v1/attractions` endpoint with pagination, filtering (city_id, category, min_price, max_price, min_rating), and search by name
- Add `POST /api/v1/attractions` endpoint for admin/hotel_manager to create attractions
- Add `GET /api/v1/attractions/{id}` endpoint to retrieve attraction details with reviews
- Add `PUT /api/v1/attractions/{id}` endpoint for owner to edit attraction
- Add `DELETE /api/v1/attractions/{id}` endpoint for owner to soft delete attraction
- Create `StoreAttractionRequest` form request for validation
- Create `UpdateAttractionRequest` form request for validation
- Create `AttractionResource` API resource for consistent JSON responses
- Auto-generate slug from name using `Str::slug()`
- Implement soft deletes on Attraction model
- Include reviews and average_rating in detail response

## Capabilities

### New Capabilities

- `attraction-crud`: Full CRUD operations for attractions with ownership validation
- `attraction-filtering`: Query parameter filters for city_id, category, price range, and rating
- `attraction-search`: LIKE-based search on attraction name field
- `attraction-resources`: API resource transformation for attraction responses

### Modified Capabilities

<!-- No existing capabilities are being modified -->

## Impact

- **Backend API**: New routes in `routes/api.php` under `/api/v1/attractions`
- **Controllers**: New `AttractionController` with 5 methods
- **Form Requests**: New `StoreAttractionRequest` and `UpdateAttractionRequest` classes
- **API Resources**: New `AttractionResource` class
- **Models**: Attraction model updated with `SoftDeletes` trait
- **Database**: No migration changes needed (schema already exists)
- **Middleware**: Uses existing `auth:sanctum` and `role:admin|hotel_manager` middleware
