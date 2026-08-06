## Why

The application currently lacks hotel detail and room selection pages. Users cannot view hotel information, reviews, or browse available rooms. This is essential for the core booking flow - without these pages, users cannot make informed decisions about hotel bookings.

## What Changes

- **New Hotel Detail Page** (`/hotels/:id`): Displays comprehensive hotel information including name, address, phone, email, description, star rating, average user rating, reviews list, and room summary. Includes "Book Now" and "Add to Favorites" action buttons.
- **New Room Selection Page** (`/hotels/:hotel-id/rooms`): Allows users to browse and filter available rooms by type, availability status, and price range. Displays room cards with number, type, capacity, price per night, and availability status. Selection navigates to booking checkout.
- **API Integration**: Connects to `GET /api/v1/hotels/{hotel}` and `GET /api/v1/hotels/{hotelId}/rooms` endpoints.

## Capabilities

### New Capabilities

- `hotel-detail`: Hotel detail page with info display, ratings, reviews, and booking/favorite actions
- `room-selection`: Room listing with filtering, room cards, and selection for booking

### Modified Capabilities

- None - this is new functionality

## Impact

- **New Pages**: `src/pages/hotels/HotelDetailPage.jsx`, `src/pages/hotels/RoomSelectionPage.jsx`
- **Routing**: Add routes `/hotels/:id` and `/hotels/:hotelId/rooms` in App.jsx
- **API Services**: New service functions for hotel and room endpoints
- **Dependencies**: None new - existing React, React Router, Tailwind CSS, and Tanstack React Query are sufficient
