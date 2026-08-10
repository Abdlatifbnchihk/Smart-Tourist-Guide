## 1. Service Layer

- [x] 1.1 Create `src/services/adminService.js` with API functions: `getUsers(params)`, `getUser(id)`, `createUser(data)`, `updateUser(id, data)`, `deleteUser(id)`, `getCities()`

## 2. Users Management Page

- [x] 2.1 Create `src/pages/admin/UsersManagementPage.jsx` with users table (name, email, phone, role, status, active, created, actions)
- [x] 2.2 Add role, status, active filters and search input with backend query params
- [x] 2.3 Add create user modal with form: first_name, last_name, email, phone, password, role, status; conditional city_id and license_number when role=Driver
- [x] 2.4 Add edit user modal with pre-filled form (password field hidden)
- [x] 2.5 Add delete user confirmation modal

## 3. Routes & Integration

- [x] 3.1 Add `/admin/users` route in `App.jsx` pointing to `UsersManagementPage`
