## ADDED Requirements

### Requirement: User table schema matches MLD design
The system SHALL store users in a `users` table with columns: `user_id` (BIGINT PK), `first_name` (VARCHAR 100), `last_name` (VARCHAR 100), `email` (VARCHAR 150, unique), `phone` (VARCHAR 20, unique), `password` (VARCHAR 255), `role` (ENUM), `status` (ENUM), `active` (BOOLEAN), `created_at`, `updated_at`.

#### Scenario: Users table has correct columns
- **WHEN** the migration runs
- **THEN** the `users` table SHALL have columns: `user_id`, `first_name`, `last_name`, `email`, `phone`, `password`, `role`, `status`, `active`, `created_at`, `updated_at`

#### Scenario: Users table does not have removed columns
- **WHEN** the migration runs
- **THEN** the `users` table SHALL NOT have columns: `role_id`, `name`, `avatar`, `email_verified_at`

### Requirement: Role is an ENUM on users table
The system SHALL use an ENUM column `role` on the `users` table with values: `Tourist`, `Driver`, `Hotel Manager`, `Administrator`. No separate `roles` table SHALL exist.

#### Scenario: User has valid role ENUM
- **WHEN** a user is created with `role = 'Tourist'`
- **THEN** the `role` column SHALL store the value `Tourist`

#### Scenario: Invalid role is rejected
- **WHEN** a user is created with `role = 'InvalidRole'`
- **THEN** the database SHALL reject the insert

### Requirement: Status is an ENUM on users table
The system SHALL use an ENUM column `status` on the `users` table with values: `Pending`, `Approved`, `Rejected`, `Suspended`. Default value SHALL be `Pending`.

#### Scenario: New user has Pending status
- **WHEN** a user is created without specifying status
- **THEN** the `status` column SHALL default to `Pending`

#### Scenario: Admin approves user
- **WHEN** an admin updates user status to `Approved`
- **THEN** the `status` column SHALL store `Approved`

### Requirement: Phone is required and unique
The system SHALL enforce `phone` as NOT NULL and UNIQUE across all users.

#### Scenario: User with duplicate phone is rejected
- **WHEN** a user is created with a phone number that already exists
- **THEN** the database SHALL reject the insert

#### Scenario: User without phone is rejected
- **WHEN** a user is created without a phone number
- **THEN** the database SHALL reject the insert

### Requirement: User model has correct relationships
The User model SHALL define relationships: `driver()` (hasOne), `bookings()` (hasMany), `reviews()` (hasMany), `favorites()` (hasMany). The `role()` belongsTo relationship SHALL be removed.

#### Scenario: User can access driver profile
- **WHEN** a user with `role = 'Driver'` calls `$user->driver`
- **THEN** the system SHALL return the associated Driver model

#### Scenario: User can access bookings
- **WHEN** a user calls `$user->bookings`
- **THEN** the system SHALL return a HasMany relationship for Booking models

#### Scenario: User model has no role relationship
- **WHEN** a user calls `$user->role`
- **THEN** the system SHALL NOT have a belongsTo relationship (role is a string column)

### Requirement: User model has correct fillable fields
The User model SHALL have `$fillable` = `['first_name', 'last_name', 'email', 'phone', 'password', 'role', 'status', 'active']`.

#### Scenario: Mass assignment works for all fields
- **WHEN** a user is created via `User::create([...])` with all fillable fields
- **THEN** all fields SHALL be persisted correctly

### Requirement: User model has correct casts
The User model SHALL cast `role` and `status` to string, `active` to boolean, and `password` to hashed.

#### Scenario: Role is cast to string
- **WHEN** a user is retrieved from database
- **THEN** `$user->role` SHALL be a string value (e.g., `'Tourist'`)

#### Scenario: Active is cast to boolean
- **WHEN** a user is retrieved from database
- **THEN** `$user->active` SHALL be a boolean value
