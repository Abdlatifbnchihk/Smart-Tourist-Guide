## Why

Tourists currently have no centralized place to manage their activity on the platform. After booking hotels, transport, saving favorites, or writing reviews, there is no dashboard to view, track, or cancel these items. This creates a poor user experience and forces tourists to navigate back through the app to re-find items they interacted with.

## What Changes

- **My Hotel Bookings page** (`/my-bookings/hotel`): List of the tourist's hotel bookings with booking number, hotel name, dates, status, total price, and a cancel option for pending/confirmed bookings.
- **My Transport Bookings page** (`/my-bookings/transport`): List of the tourist's transport bookings with booking number, driver name, dates, status, total price, and a cancel option.
- **Booking Detail page** (`/my-bookings/:id`): Full detail view for any booking (hotel or transport) showing all info, status, entities involved, and status actions (cancel if applicable).
- **Favorites page** (`/favorites`): List of saved items filterable by type (hotels, attractions, restaurants) with remove-favorite capability.
- **My Reviews page** (`/my-reviews`): List of reviews written by the user with edit and delete options.

## Capabilities

### New Capabilities

- `tourist-hotel-bookings`: Tourist-facing hotel booking list with cancel functionality. Uses `GET /api/v1/hotel-bookings` (scoped to authenticated user) and `PATCH /api/v1/hotel-bookings/{id}/cancel`.
- `tourist-transport-bookings`: Tourist-facing transport booking list with cancel functionality. Uses `GET /api/v1/transport-bookings` (scoped to authenticated user) and `PATCH /api/v1/transport-bookings/{id}/cancel`.
- `tourist-booking-detail`: Detail view for any booking type with status actions. Uses `GET /api/v1/hotel-bookings/{id}` or `GET /api/v1/transport-bookings/{id}`.
- `tourist-favorites`: Favorites management page with type filtering and removal. Uses `GET /api/v1/favorites` and `DELETE /api/v1/favorites/{id}`.
- `tourist-reviews`: User's review management with edit and delete. Uses `GET /api/v1/reviews` (filtered by current user) and `DELETE /api/v1/reviews/{id}`.

### Modified Capabilities

- `favorite-management`: The existing `GET /api/v1/favorites` endpoint may need to support type filtering if not already implemented.

## Impact

- **Frontend**: New React pages under `src/pages/my-bookings/`, `src/pages/favorites/`, `src/pages/my-reviews/`. New routes in `App.jsx`. Reuses existing UI components (StatusBadge, Skeleton, Button).
- **Backend**: Minor — verify existing endpoints support tourist-scoped queries (hotel-bookings index already scopes to auth user; reviews index may need `user_id` filter support). The `favorite-management` endpoint may need a `type` query parameter.
- **Services**: New or extended service functions in `frontend/src/services/bookingService.js`, `favoriteService.js`, `reviewService.js`.
