## Why

The admin sidebar already has a "Users Management" link at `/admin/users`, but no page exists for it. The backend `AdminController` provides full user CRUD (`GET/POST/PUT/DELETE /api/v1/admin/users`) with filtering by role, status, active state, and search. We need the frontend admin users page to complete this feature.

## What Changes

- Create `UsersManagementPage.jsx` for the admin dashboard with user list table, filtering, search, and CRUD operations
- Add user create/edit modal with form fields matching backend `StoreUserRequest` and `UpdateAdminUserRequest`
- Add user delete confirmation modal
- Add `/admin/users` route in `App.jsx`

## Capabilities

### New Capabilities
- `admin-user-management`: Admin user list with filtering (role, status, active), search, create/edit/delete users, bulk actions

### Modified Capabilities
- (none — existing backend APIs already support this)

## Impact

- Frontend: New page `src/pages/admin/UsersManagementPage.jsx`, route update in `App.jsx`
- Backend: None — existing `AdminController` and `apiResource('users')` already provide all endpoints
- The admin sidebar already has the "Users Management" link pointing to `/admin/users`
