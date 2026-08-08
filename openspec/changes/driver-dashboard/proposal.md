## Why

Drivers currently have no dedicated dashboard to manage their vehicles, view assigned bookings, or update their profile. The backend already has driver/vehicle/booking APIs but no frontend pages exist for the driver role. This change creates the complete driver dashboard experience.

## What Changes

- New driver dashboard overview page with stats (vehicles, bookings by status, rating, verification status)
- New vehicle management pages (list, create, edit, delete)
- New booking management pages (list, detail, status updates)
- New driver profile edit page
- New driver sidebar navigation and layout component
- New route definitions in App.jsx for `/driver/*`

## Capabilities

### New Capabilities

- `driver-dashboard`: Overview page showing driver stats, recent bookings, and quick actions
- `driver-vehicle-management`: CRUD pages for managing driver's vehicles (list, create, edit, delete)
- `driver-booking-management`: List and detail pages for transport bookings assigned to driver, with status updates
- `driver-profile-management`: Profile edit page for driver-specific fields (license, experience, languages, availability)

### Modified Capabilities

_(none - all capabilities are new)_

## Impact

- **Frontend**: New React components under `src/pages/driver/`, new `DriverLayout.jsx`, new `DriverSidebar.jsx`, new routes in `App.jsx`, new service file `driverService.js`
- **Backend**: No changes needed - all required APIs already exist (`GET/POST drivers/{id}/vehicles`, `GET/PUT driver/transport-bookings`, `PUT drivers/{id}`)
- **Auth**: Driver role already supported in auth system and middleware
