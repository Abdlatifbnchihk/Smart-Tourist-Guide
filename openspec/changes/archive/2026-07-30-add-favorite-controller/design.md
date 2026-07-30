## Context

The project already has a `Favorite` model with separate columns (`hotel_id`, `restaurant_id`, `attraction_id`) instead of a polymorphic morphTo relationship. The user wants to add API endpoints for favorite management with toggle behavior.

Current state:
- Favorite model exists with separate nullable foreign keys
- Unique constraints exist for each type
- No FavoriteController exists
- No FavoriteResource exists
- Routes partially defined in api.php

## Goals / Non-Goals

**Goals:**
- Create FavoriteController with index, toggle, destroy endpoints
- Create FavoriteResource for API responses
- Implement toggle behavior (add if not exists, remove if exists)
- Support filtering by type (hotel, attraction)
- Only return authenticated user's favorites

**Non-Goals:**
- Refactoring existing Favorite model to use morphTo
- Adding restaurant favorites (already supported in model)
- Favorite sorting or ordering

## Decisions

**1. Reuse Existing Model**
- **Decision**: Use existing Favorite model with separate columns instead of morphTo
- **Why**: Avoids migration changes, maintains data integrity, simpler implementation
- **Alternative**: Refactor to morphTo - rejected due to complexity and existing data

**2. Toggle Logic Location**
- **Decision**: Handle toggle in controller, keep service layer thin
- **Why**: Simple business logic, no complex validation needed
- **Alternative**: Create FavoriteService - overkill for this scope

**3. Type Filtering**
- **Decision**: Use query parameter `type` (hotel/attraction/restaurant)
- **Why**: Clean API design, easy to extend

## Risks / Trade-offs

- **Risk**: Separate columns approach is less flexible → **Mitigation**: Works for current requirements
- **Risk**: Toggle race condition → **Mitigation**: Database unique constraint prevents duplicates
