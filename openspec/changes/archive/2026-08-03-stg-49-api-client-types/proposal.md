## Why

The frontend needs a centralized API client with request/response interceptors for authentication and error handling, plus type definitions for all backend entities to ensure type safety and IDE support across the application.

## What Changes

- Create `services/apiClient.js` with Axios instance, auth interceptors, and error handling
- Create `types/index.js` with all entity type definitions
- Update `api-integration` spec to include interceptor requirements

## Capabilities

### New Capabilities

- `api-client`: Axios instance with baseURL from env, request interceptor for auth token, response interceptor for 401 handling and error normalization
- `frontend-types`: JavaScript type definitions for all backend entities (User, City, Attraction, Hotel, Room, Driver, Vehicle, Bookings, Reviews, Favorites, Itinerary, API responses)

### Modified Capabilities

- `api-integration`: Add requirements for interceptors and token management

## Impact

- New files: `frontend/src/services/apiClient.js`, `frontend/src/types/index.js`
- Modified: `openspec/specs/api-integration/spec.md`
- Dependencies: None (standalone frontend change)
