## MODIFIED Requirements

### Requirement: API tokens can be issued
The system SHALL allow authenticated users to create personal access tokens and provide public routes for user registration and login.

#### Scenario: User creates a token
- **WHEN** an authenticated user calls `$user->createToken('device-name')`
- **THEN** a new token SHALL be created and returned

#### Scenario: Token has correct abilities
- **WHEN** a token is created with specific abilities
- **THEN** the token's `abilities` field SHALL contain only the specified abilities

#### Scenario: User can register via API
- **WHEN** a POST request is made to `/api/v1/auth/register` with valid user data
- **THEN** a new user SHALL be created and a token SHALL be returned

#### Scenario: User can login via API
- **WHEN** a POST request is made to `/api/v1/auth/login` with valid credentials
- **THEN** a token SHALL be returned for the authenticated user

#### Scenario: User can logout via API
- **WHEN** an authenticated user makes a POST request to `/api/v1/auth/logout`
- **THEN** the current token SHALL be revoked

#### Scenario: User can get profile via API
- **WHEN** an authenticated user makes a GET request to `/api/v1/auth/me`
- **THEN** the user's profile data SHALL be returned
