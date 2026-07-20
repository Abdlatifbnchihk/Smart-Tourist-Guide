## MODIFIED Requirements

### Requirement: User can register via API

#### Scenario: User registers as Tourist
- **WHEN** a POST request is made to `/api/v1/auth/register` with `role = 'Tourist'`
- **THEN** a new user SHALL be created with `role = 'Tourist'`
- **AND** a token SHALL be returned

#### Scenario: User registers as Driver
- **WHEN** a POST request is made to `/api/v1/auth/register` with `role = 'Driver'`
- **THEN** a new user SHALL be created with `role = 'Driver'`
- **AND** a driver profile SHALL be auto-created with `user_id`, `first_name`, `last_name`, `city_id`, and `license_number`
- **AND** a token SHALL be returned

#### Scenario: Registration uses Form Request validation
- **WHEN** a POST request is made to `/api/v1/auth/register`
- **THEN** the request SHALL be validated via `RegisterUserRequest`
- **AND** validation rules SHALL include: `first_name`, `last_name`, `email`, `phone`, `password`, `role`
- **AND** when `role = 'Driver'`, additional required fields: `city_id`, `license_number`

## ADDED Requirements

### Requirement: RegisterUserRequest validates registration fields
The `RegisterUserRequest` form request SHALL validate:
- `first_name`: required, string, max 100
- `last_name`: required, string, max 100
- `email`: required, email, max 150, unique users
- `phone`: required, string, max 20, unique users
- `password`: required, string, min 8, confirmed
- `role`: required, in: Tourist, Driver, Hotel Manager, Administrator
- When `role = 'Driver'`: `city_id` required, `license_number` required

#### Scenario: Valid registration data passes validation
- **WHEN** a registration request contains all required fields with valid values
- **THEN** validation SHALL pass

#### Scenario: Missing required field fails validation
- **WHEN** a registration request is missing a required field
- **THEN** validation SHALL fail with appropriate error message

#### Scenario: Invalid role value fails validation
- **WHEN** a registration request has `role = 'invalid'`
- **THEN** validation SHALL fail

### Requirement: LoginUserRequest validates login fields
The `LoginUserRequest` form request SHALL validate:
- `email`: required, email
- `password`: required

#### Scenario: Valid login credentials pass validation
- **WHEN** a login request contains valid email and password
- **THEN** validation SHALL pass

### Requirement: No Role model references
The authentication system SHALL NOT import or reference any `Role` model. Only ENUM string values SHALL be used for role assignment.

#### Scenario: No Role model import in AuthController
- **WHEN** the `AuthController` is loaded
- **THEN** no `use App\Models\Role` import SHALL exist

#### Scenario: No role_id references
- **WHEN** creating a user during registration
- **THEN** the `role` field SHALL be set directly from the request ENUM value
- **AND** no `role_id` field SHALL be included
