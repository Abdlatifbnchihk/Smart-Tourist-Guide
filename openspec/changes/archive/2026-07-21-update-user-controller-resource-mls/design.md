## Context

The API layer (UserController, UserResource, Form Requests) needs to align with the MLD database schema. The current design may reference `name` instead of `first_name`/`last_name`, and `role_id` instead of `role` ENUM string. Driver profile management also needs to be exposed through the API.

## Goals / Non-Goals

**Goals:**
- UserController returns user data matching MLD fields exactly
- UserResource outputs `role` string, `status` string, `first_name`, `last_name` (no `role_id`)
- UpdateUserRequest validates `first_name`, `last_name`, `email`, `phone`
- Driver can update driver-specific fields (license, years_of_experience, etc.)
- Profile endpoint eager-loads driver relationship for driver role users

**Non-Goals:**
- Changing database schema (already correct)
- Adding new user fields beyond MLD
- Implementing avatar/photo upload
- User admin management (separate concern)

## Decisions

### Decision 1: UserResource maps MLD fields directly

**Choice:** Return `first_name`, `last_name`, `role`, `status` as top-level fields

**Rationale:** Direct field mapping matches MLD, simpler for API consumers, consistent with database column names

### Decision 2: Driver profile update uses separate endpoint

**Choice:** `PUT /api/v1/user/driver/profile` for driver-specific fields

**Rationale:** Separation of concerns, clearer validation rules, follows REST conventions

### Decision 3: Profile endpoint eager-loads relationships

**Choice:** `User::with('driver')->find($id)` in profile method

**Rationale:** Avoids N+1 queries when UserResource accesses `$user->driver`

## Risks / Trade-offs

**[Risk]** Existing API consumers expect `name` field -> Mitigation: Breaking change, document in API changelog

**[Risk]** Driver-specific fields are on drivers table, not users -> Mitigation: Separate update method queries Driver model directly
