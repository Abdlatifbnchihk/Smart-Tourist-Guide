## Why

The Hotel Manager Dashboard pages (D2, D3) require a backend API to manage hotels owned by the authenticated hotel manager. Currently, the `HotelController` for the hotel manager role is missing, preventing hotel managers from creating, viewing, updating, or deleting their hotels through the admin interface. This controller is required to complete the hotel management feature for hotel managers.

## What Changes

- Create a new `HotelController` in `app/Http/Controllers/HotelManager/HotelController.php`
- Register an `apiResource` route for `/hotel-manager/manage-hotel` with the appropriate middleware
- Implement standard CRUD methods: `index`, `store`, `show`, `update`, `destroy`
- Include ownership validation for show, update, and destroy operations
- Auto-set `created_by` to the authenticated user on creation
- Include validation for required fields (name, city_id, address, etc.)

## Capabilities

### New Capabilities

- `hotel-manager-hotel-management`: Provides RESTful API endpoints for hotel managers to list, create, view, update, and delete their own hotels, including ownership validation and auto-assignment of creator.

### Modified Capabilities

_(No existing capabilities are being modified.)_

## Impact

- New controller file: `app/Http/Controllers/HotelManager/HotelController.php`
- New route definition in `routes/api.php` (already partially defined under hotel-manager middleware)
- Validation logic for hotel creation and updates
- Ownership validation for show/update/destroy operations
- No changes to existing hotel assignment or user-role relationships