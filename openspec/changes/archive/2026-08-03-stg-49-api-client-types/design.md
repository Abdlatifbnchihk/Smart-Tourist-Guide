## Context

The frontend project has been scaffolded with React + Vite + Tailwind CSS (STG-48). The backend API is running at `localhost:8000` with Sanctum token authentication. We need a centralized API client and type definitions before building any feature pages.

## Goals / Non-Goals

**Goals:**
- Create a reusable Axios instance with interceptors for auth and error handling
- Define JavaScript type structures for all backend entities
- Ensure token management via localStorage
- Handle 401 responses by redirecting to login

**Non-Goals:**
- React Query hooks (separate task)
- Actual API calls (handled by feature tasks)
- TypeScript migration (using plain JavaScript)

## Decisions

### 1. File structure
- `services/apiClient.js` - Axios instance with interceptors
- `types/index.js` - All entity type definitions as JSDoc comments

**Rationale**: Keeps API logic separate from type definitions. JSDoc provides IDE support without TypeScript complexity.

### 2. Token storage
Use `localStorage` for auth token persistence.

**Rationale**: Tokens persist across browser sessions. HttpOnly cookies would be more secure but require backend cookie configuration.

### 3. Error handling
Response interceptor normalizes errors to `{ message, status, data }` format.

**Rationale**: Consistent error shape simplifies error handling in components.

### 4. Type definitions
Export as plain objects with JSDoc `@typedef` annotations.

**Rationale**: Provides IDE autocomplete and documentation without build step overhead.

## Risks / Trade-offs

- [localStorage XSS vulnerability] → Mitigated by CORS and SameSite policies
- [Token refresh not handled] → Acceptable for MVP; can add refresh token logic later
- [No TypeScript] → Trade-off for simplicity; JSDoc provides similar DX benefits
