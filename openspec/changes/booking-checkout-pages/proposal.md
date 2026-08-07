## Why

The booking flow is broken - RoomSelectionPage navigates to `/checkout` but no checkout page exists. Tourists cannot complete hotel bookings or create transport bookings from the frontend. The backend APIs are fully implemented but have no frontend UI to interact with them.

## What Changes

- **Hotel Booking Checkout Page** (`/booking/hotel`): Date picker for check-in/check-out, guest count input, room summary, price calculation (price_per_night x nights), and confirm booking button calling `POST /api/v1/hotel-bookings`.
- **Transport Booking Checkout Page** (`/booking/transport`): Driver/vehicle selection list, distance input in km, pickup/dropoff date pickers, booking type selector (Hotel+Driver / Airport Transfer), price estimate (price_per_km x distance), and confirm booking button calling `POST /api/v1/transport-bookings`.
- **Booking Service**: New `bookingService.js` with API functions for hotel and transport booking creation.
- **Route Updates**: Add checkout routes to `App.jsx` and update `RoomSelectionPage` to navigate to correct checkout path.

## Capabilities

### New Capabilities
- `hotel-booking-checkout`: Frontend checkout page for hotel bookings with date selection, price calculation, and booking confirmation.
- `transport-booking-checkout`: Frontend checkout page for transport bookings with driver/vehicle selection, distance input, and booking confirmation.

### Modified Capabilities
- None - no existing specs require modification.

## Impact

- **Frontend code**: New pages (`HotelBookingCheckout.jsx`, `TransportBookingCheckout.jsx`), new service file (`bookingService.js`), updates to `App.jsx` routing, updates to `RoomSelectionPage.jsx` navigation.
- **Backend API**: No changes - existing `POST /api/v1/hotel-bookings` and `POST /api/v1/transport-bookings` endpoints are sufficient.
- **Dependencies**: No new dependencies required.
- **Auth**: Both checkout pages require authentication (ProtectedRoute).
