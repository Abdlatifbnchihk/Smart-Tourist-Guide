## Purpose

Centralized Axios API client with authentication interceptors and token management for frontend-backend communication.

## Requirements

### Requirement: Axios instance created
The API client SHALL create an Axios instance with baseURL from `VITE_API_URL` environment variable.

#### Scenario: Axios base URL is configured
- **WHEN** the API client module is imported
- **THEN** an Axios instance exists with `baseURL` set to `VITE_API_URL`

### Requirement: Request interceptor attaches auth token
The API client SHALL attach the Authorization header from localStorage token on every request.

#### Scenario: Token exists in localStorage
- **WHEN** a request is made and `localStorage` contains a token
- **THEN** the request includes `Authorization: Bearer <token>` header

#### Scenario: No token in localStorage
- **WHEN** a request is made and no token exists
- **THEN** the request proceeds without Authorization header

### Requirement: Response interceptor handles 401
The API client SHALL redirect to `/login` on 401 unauthorized responses.

#### Scenario: 401 response received
- **WHEN** the API returns a 401 status code
- **THEN** the user is redirected to `/login`

### Requirement: Error response normalization
The API client SHALL normalize error responses to a consistent format.

#### Scenario: API error occurs
- **WHEN** the API returns an error response
- **THEN** the error is normalized to `{ message, status, data }` format

### Requirement: Token storage management
The API client SHALL provide methods to get, set, and remove auth tokens from localStorage.

#### Scenario: Set token
- **WHEN** `setToken(token)` is called
- **THEN** the token is stored in `localStorage` under key `auth_token`

#### Scenario: Get token
- **WHEN** `getToken()` is called
- **THEN** the token is retrieved from `localStorage`

#### Scenario: Remove token
- **WHEN** `removeToken()` is called
- **THEN** the token is removed from `localStorage`