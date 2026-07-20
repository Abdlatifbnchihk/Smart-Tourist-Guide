## Context

The Smart Tourist Guide backend needs API authentication to protect endpoints. Currently, no authentication mechanism exists. Laravel Sanctum is the recommended authentication package for Laravel 11+ applications, providing both SPA-style cookie authentication and API token authentication.

## Goals / Non-Goals

**Goals:**
- Install and configure Laravel Sanctum for API token authentication
- Enable token issuance, revocation, and abilities for RBAC
- Configure middleware for stateful domains in local development
- Add `HasApiTokens` trait to User model

**Non-Goals:**
- Implement full RBAC logic (roles/abilities are configured, not enforced)
- SPA cookie-based authentication (not needed for API-only backend)
- Custom authentication guards beyond Sanctum defaults

## Decisions

**Use Laravel Sanctum over Passport:**
- Sanctum is lighter, simpler, and officially recommended for Laravel 11+
- Passport is overkill for this project (OAuth2 server not needed)
- Sanctum provides personal access tokens which fit the API token use case perfectly

**Stateful domains for local development:**
- Configure `localhost:8000` and `localhost:5173` for SPA-style auth if needed later
- This allows both API tokens and cookie-based auth during development

**Token abilities for RBAC:**
- Use token abilities (e.g., `admin`, `driver`, `hotel-manager`) to gate access
- Abilities are set when creating tokens and checked via `$token->can()` or middleware

## Risks / Trade-offs

- **Risk**: Sanctum migration adds a new table (`personal_access_tokens`) → Mitigation: This is expected and tracked in migration files
- **Risk**: Token storage on client side → Mitigation: Client implementation is out of scope for this backend change
