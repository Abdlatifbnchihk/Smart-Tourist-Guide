## Why

The admin panel includes a Role Management frontend page (B5) that expects a corresponding backend API to perform CRUD operations on roles. Currently, the `RoleController` is missing, preventing administrators from managing roles through the admin interface. This controller is required to complete the admin role management feature.

## What Changes

- Create a new `RoleController` in `app/Http/Controllers/Admin/RoleController.php`
- Register an `apiResource` route for `/admin/roles` with the appropriate middleware
- Implement standard CRUD methods: `index`, `store`, `show`, `update`, `destroy`
- Include validation for unique `name` and `slug` on create and update
- Ensure deletion checks for assigned users before removal

## Capabilities

### New Capabilities

- `admin-role-management`: Provides RESTful API endpoints for administrators to list, create, view, update, and delete roles, including user count and assignment checks.

### Modified Capabilities

_(No existing capabilities are being modified.)_

## Impact

- New controller file: `app/Http/Controllers/Admin/RoleController.php`
- New route definition in `routes/api.php` (or admin routes file)
- Validation logic for role creation and updates
- Potential addition of middleware assignment (`role:administrator`)
- No changes to existing role assignment or user-role relationships