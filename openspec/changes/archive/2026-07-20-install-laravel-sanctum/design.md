## Context

The Smart Tourist Guide application currently has user authentication via the `users` table with email/password credentials. The system needs to secure API endpoints for mobile clients and SPAs. Laravel Sanctum provides a lightweight authentication system that supports both SPA authentication via cookies and API token-based authentication.

Current state:
- User model exists with email/password authentication
- No API token mechanism in place
- Routes are unprotected

## Goals / Non-Goals

**Goals:**
- Enable API token-based authentication for protected routes
- Support role-based access control via token abilities
- Configure stateful domains for local development
- Maintain compatibility with existing User model and roles

**Non-Goals:**
- Implementing OAuth or social login
- Changing the existing session-based authentication
- Implementing token refresh mechanisms (basic token lifecycle is sufficient)
- Frontend implementation of token management

## Decisions

**Decision 1: Use Sanctum's Token Guard (not SPA/cookie authentication)**
- Rationale: The application needs to support mobile API clients that cannot use cookies
- Alternatives considered:
  - SPA cookie authentication: Rejected because mobile clients need bearer tokens
  - Passport: Rejected as overkill for this use case; Sanctum is simpler and sufficient

**Decision 2: Use token abilities for RBAC instead of separate middleware**
- Rationale: Token abilities allow fine-grained permission checking at the token level
- Example: `$token->can('manage-bookings')` checks ability directly
- Alternatives considered:
  - Separate role middleware: More code, less flexible than token-level abilities

**Decision 3: Configure stateful domains for local development**
- Rationale: Enables SPA development on localhost with proper CORS handling
- Domains: `localhost:8000`, `localhost:5173` (Vite dev server)

## Risks / Trade-offs

- **Risk**: Token泄露 (token leakage) → Mitigation: Tokens should have appropriate expiration; users should be able to revoke tokens
- **Risk**: Migration adds new table → Mitigation: Non-destructive; existing data unaffected
- **Trade-off**: Adding `HasApiTokens` trait modifies User model → Acceptable as it's additive, not breaking
