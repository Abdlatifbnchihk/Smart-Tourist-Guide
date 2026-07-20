# API Routing

## Purpose

Complete API route structure with versioning, authentication, and role-based access control.

## Requirements

### Requirement: All API routes are versioned under /api/v1
The system SHALL prefix all API routes with `/api/v1`.

#### Scenario: Route has correct prefix
- **WHEN** a request is made to `/api/v1/health`
- **THEN** the health check endpoint SHALL respond

#### Scenario: Old version routes are not accessible
- **WHEN** a request is made to `/api/v2/health`
- **THEN** the system SHALL return a 404 response

### Requirement: Auth routes are public
The system SHALL provide public routes for user registration and login.

#### Scenario: User can register
- **WHEN** a POST request is made to `/api/v1/auth/register`
- **THEN** the system SHALL create a new user and return a token

#### Scenario: User can login
- **WHEN** a POST request is made to `/api/v1/auth/login`
- **THEN** the system SHALL authenticate the user and return a token

### Requirement: Protected routes require Sanctum authentication
The system SHALL require valid Sanctum tokens for all protected routes.

#### Scenario: Request without token is rejected
- **WHEN** a request is made to a protected route without a token
- **THEN** the system SHALL return a 401 Unauthorized response

#### Scenario: Request with valid token is accepted
- **WHEN** a request is made to a protected route with a valid token
- **THEN** the system SHALL process the request

### Requirement: Admin routes require admin role
The system SHALL restrict admin routes to users with Administrator role.

#### Scenario: Non-admin user is rejected
- **WHEN** a non-admin user makes a request to an admin route
- **THEN** the system SHALL return a 403 Forbidden response

#### Scenario: Admin user is accepted
- **WHEN** an admin user makes a request to an admin route
- **THEN** the system SHALL process the request

### Requirement: Hotel manager routes require hotel_manager role
The system SHALL restrict hotel manager routes to users with Hotel Manager role.

#### Scenario: Non-hotel-manager user is rejected
- **WHEN** a non-hotel-manager user makes a request to a hotel manager route
- **THEN** the system SHALL return a 403 Forbidden response

#### Scenario: Hotel manager user is accepted
- **WHEN** a hotel manager user makes a request to a hotel manager route
- **THEN** the system SHALL process the request

### Requirement: Driver routes require driver role
The system SHALL restrict driver routes to users with Driver role.

#### Scenario: Non-driver user is rejected
- **WHEN** a non-driver user makes a request to a driver route
- **THEN** the system SHALL return a 403 Forbidden response

#### Scenario: Driver user is accepted
- **WHEN** a driver user makes a request to a driver route
- **THEN** the system SHALL process the request

### Requirement: Resource routes use proper HTTP methods
The system SHALL use correct HTTP methods for CRUD operations.

#### Scenario: GET for reading
- **WHEN** a GET request is made to a resource endpoint
- **THEN** the system SHALL return the resource(s)

#### Scenario: POST for creating
- **WHEN** a POST request is made to a resource endpoint
- **THEN** the system SHALL create a new resource

#### Scenario: PUT/PATCH for updating
- **WHEN** a PUT or PATCH request is made to a resource endpoint
- **THEN** the system SHALL update the existing resource

#### Scenario: DELETE for deleting
- **WHEN** a DELETE request is made to a resource endpoint
- **THEN** the system SHALL delete the resource
