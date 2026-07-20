## ADDED Requirements

### Requirement: Role enum exists with correct values
The system SHALL have a `Role` backed string enum with values: Tourist, Driver, Hotel Manager, Administrator.

#### Scenario: Role enum has all values
- **WHEN** checking `Role::cases()`
- **THEN** the enum SHALL contain: Tourist, Driver, Hotel Manager, Administrator

#### Scenario: Role enum is backed by strings
- **WHEN** accessing `Role::Tourist->value`
- **THEN** the value SHALL be `'Tourist'`

#### Scenario: Role enum has labels
- **WHEN** calling `Role::Tourist->label()`
- **THEN** it SHALL return a human-readable label

### Requirement: UserStatus enum exists with correct values
The system SHALL have a `UserStatus` backed string enum with values: Pending, Approved, Rejected, Suspended.

#### Scenario: UserStatus enum has all values
- **WHEN** checking `UserStatus::cases()`
- **THEN** the enum SHALL contain: Pending, Approved, Rejected, Suspended

#### Scenario: UserStatus enum is backed by strings
- **WHEN** accessing `UserStatus::Pending->value`
- **THEN** the value SHALL be `'Pending'`

#### Scenario: UserStatus enum has labels
- **WHEN** calling `UserStatus::Pending->label()`
- **THEN** it SHALL return a human-readable label

### Requirement: BookingStatus enum exists with correct values
The system SHALL have a `BookingStatus` backed string enum with values: Pending, Confirmed, Cancelled, Completed.

#### Scenario: BookingStatus enum has all values
- **WHEN** checking `BookingStatus::cases()`
- **THEN** the enum SHALL contain: Pending, Confirmed, Cancelled, Completed

#### Scenario: BookingStatus enum is backed by strings
- **WHEN** accessing `BookingStatus::Pending->value`
- **THEN** the value SHALL be `'Pending'`

#### Scenario: BookingStatus enum has labels
- **WHEN** calling `BookingStatus::Pending->label()`
- **THEN** it SHALL return a human-readable label

### Requirement: BookingType enum exists with correct values
The system SHALL have a `BookingType` backed string enum with values: Hotel, Hotel + Driver, Airport Transfer.

#### Scenario: BookingType enum has all values
- **WHEN** checking `BookingType::cases()`
- **THEN** the enum SHALL contain: Hotel, Hotel + Driver, Airport Transfer

#### Scenario: BookingType enum is backed by strings
- **WHEN** accessing `BookingType::Hotel->value`
- **THEN** the value SHALL be `'Hotel'`

#### Scenario: BookingType enum has labels
- **WHEN** calling `BookingType::Hotel->label()`
- **THEN** it SHALL return a human-readable label

### Requirement: Models cast columns to enums
The system SHALL cast enum columns to their respective enum classes in models.

#### Scenario: User model casts role to Role enum
- **WHEN** a User is retrieved from database
- **THEN** `$user->role` SHALL be an instance of `Role` enum

#### Scenario: User model casts status to UserStatus enum
- **WHEN** a User is retrieved from database
- **THEN** `$user->status` SHALL be an instance of `UserStatus` enum

#### Scenario: Booking model casts status to BookingStatus enum
- **WHEN** a Booking is retrieved from database
- **THEN** `$booking->status` SHALL be an instance of `BookingStatus` enum

#### Scenario: Booking model casts booking_type to BookingType enum
- **WHEN** a Booking is retrieved from database
- **THEN** `$booking->booking_type` SHALL be an instance of `BookingType` enum
