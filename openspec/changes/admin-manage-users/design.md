## Context

The admin dashboard has sidebar links for all management pages (cities, hotels, attractions, bookings, reviews), but the "Users Management" page at `/admin/users` is missing. The backend `AdminController` already provides full user CRUD with `apiResource('users')` at `/api/v1/admin/users`, including filtering by role, status, active state, and search. The `AdminUserResource` returns `user_id`, `first_name`, `last_name`, `email`, `phone`, `role`, `status`, `active`, `driver`, `bookings_count`, `created_at`, `updated_at`.

## Goals / Non-Goals

**Goals:**
- Create `UsersManagementPage.jsx` matching the existing admin page patterns (table, filters, modals)
- Support user list with role/status/active filters and search
- Support create, edit, and delete user operations via modals
- Conditional driver fields (city_id, license_number) when role is "Driver"

**Non-Goals:**
- No backend changes needed — all APIs already exist
- No bulk actions or import/export
- No user activity logs or audit trails

## Decisions

1. **Follow existing admin page pattern** — Use the same table + modal structure as `CitiesManagementPage.jsx` and `HotelsManagementPage.jsx` for consistency
2. **Client-side filtering for dropdowns, server-side for search** — Role/status/active filters send query params to backend; search also sends to backend via `?search=` param
3. **Conditional form fields** — Show city_id and license_number fields only when role is "Driver" (matching `StoreUserRequest` validation)
4. **Password required only on create** — `StoreUserRequest` requires password; `UpdateAdminUserRequest` does not

## Risks / Trade-offs

- [Risk] Password field handling — Must not send empty password on edit → Only include password in create payload
- [Risk] Role change after creation — Changing role from/to Driver may require driver profile creation/deletion → Backend `AdminController@store` handles Driver creation; edit does not change role's driver association
