## Why

Hotel managers need a dedicated dashboard to manage their properties, rooms, and bookings. Currently, there is no interface for hotel owners to oversee their operations, view statistics, or manage their listings. This change introduces a complete hotel manager dashboard with all necessary CRUD operations and booking management.

## What Changes

- Add hotel manager dashboard overview with statistics (total hotels, rooms, bookings by status, average rating)
- Add hotel listing page for managers to view their properties
- Add hotel creation/editing forms with fields: name, city, address, phone, email, description, stars
- Add room management page per hotel with list, add, edit, soft-delete, and restore capabilities
- Add room creation/editing forms with fields: number, type, capacity, price_per_night, quantity_available, availability toggle
- Add bookings page with status filtering and status update actions (confirm, complete, cancel)
- Integrate with existing API endpoints for hotel-manager and hotel-bookings

## Capabilities

### New Capabilities

- `hotel-manager-dashboard`: Dashboard overview page displaying statistics and summary metrics for hotel managers
- `hotel-manager-hotels`: Hotel listing and management pages (list, create, edit) for hotel owners
- `hotel-manager-rooms`: Room management pages (list, create, edit, soft-delete, restore) for hotel properties
- `hotel-manager-bookings`: Booking management page with filtering and status update capabilities

### Modified Capabilities

(none - all capabilities are new)

## Impact

- **Frontend**: New React components and pages under `/hotel-manager` route structure
- **API Integration**: Requires GET/POST/PUT endpoints for `/api/v1/hotel-manager/manage-hotel`, `/api/v1/hotel-manager/manage-rooms`, and GET/PUT for `/api/v1/hotel-bookings`
- **Routing**: New route definitions in React Router configuration
- **State Management**: New state handling for hotel, room, and booking data
- **UI Components**: Reuse of existing Tailwind CSS components and form patterns
