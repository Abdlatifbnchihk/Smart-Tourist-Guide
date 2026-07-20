## MODIFIED Requirements

### Requirement: User model has correct relationships
The User model SHALL define relationships: `driver()` (hasOne), `bookings()` (hasMany), `reviews()` (hasMany), `favorites()` (hasMany), and include the `HasApiTokens` trait from Laravel Sanctum. The `role()` belongsTo relationship SHALL be removed.

#### Scenario: User can access driver profile
- **WHEN** a user with `role = 'Driver'` calls `$user->driver`
- **THEN** the system SHALL return the associated Driver model

#### Scenario: User can access bookings
- **WHEN** a user calls `$user->bookings`
- **THEN** the system SHALL return a HasMany relationship for Booking models

#### Scenario: User model has no role relationship
- **WHEN** a user calls `$user->role`
- **THEN** the system SHALL NOT have a belongsTo relationship (role is a string column)

#### Scenario: User model has HasApiTokens trait
- **WHEN** a User model instance is created
- **THEN** the model SHALL use the `HasApiTokens` trait from `Laravel\Sanctum\HasApiTokens`
