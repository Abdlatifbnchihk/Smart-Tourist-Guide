## Purpose

Environment variable configuration for the backend Laravel application. Defines required variables and their defaults for local development.

## Requirements

### Requirement: Cache driver configuration
The backend `.env.example` file SHALL include the `CACHE_DRIVER` environment variable with a default value of `redis`.

#### Scenario: Cache driver variable present
- **WHEN** a developer copies `.env.example` to `.env`
- **THEN** the `CACHE_DRIVER` variable SHALL be present with value `redis`

### Requirement: All required environment variables present
The backend `.env.example` file SHALL contain all required environment variables with sensible defaults for local development.

#### Scenario: Required variables exist
- **WHEN** a developer sets up the backend environment
- **THEN** the following variables SHALL be present:
  - `APP_NAME`, `APP_ENV`, `APP_KEY`, `APP_DEBUG`, `APP_URL`
  - `DB_CONNECTION`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`
  - `SANCTUM_STATEFUL_DOMAINS` (configured for localhost:8000,localhost:5173)
  - `FRONTEND_URL` (http://localhost:5173)
  - `CLAUDE_API_KEY` (placeholder for AI features)
  - `MAIL_MAILER`, `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`
  - `CACHE_DRIVER`, `SESSION_DRIVER` (redis)
  - `QUEUE_CONNECTION` (redis)
