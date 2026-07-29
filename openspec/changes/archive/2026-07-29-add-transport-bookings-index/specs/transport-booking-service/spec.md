## ADDED Requirements

### Requirement: List transport bookings with role-based filtering
The system SHALL provide a paginated list of transport bookings filtered by user role. Tourists SHALL see only their own bookings. Drivers SHALL see only bookings assigned to them.

#### Scenario: Tourist lists own transport bookings
- **WHEN** a tourist requests the transport bookings list
- **THEN** the system returns only bookings where `user_id` matches the authenticated tourist

#### Scenario: Driver lists assigned transport bookings
- **WHEN** a driver requests the transport bookings list
- **THEN** the system returns only bookings where `driver.user_id` matches the authenticated driver

#### Scenario: Unauthorized role sees no bookings
- **WHEN** a user with a role other than tourist or driver requests the transport bookings list
- **THEN** the system returns an empty list

#### Scenario: Paginated response with relationships
- **WHEN** a tourist or driver requests the transport bookings list
- **THEN** the response is paginated and includes eager-loaded `user`, `driver`, and `room.hotel` relationships
