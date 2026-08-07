## 1. Service Layer

- [x] 1.1 Add `getMyHotelBookings(filters)` and `getMyTransportBookings(filters)` to `bookingService.js`
- [x] 1.2 Add `cancelMyHotelBooking(id)` and `cancelMyTransportBooking(id)` to `bookingService.js`
- [x] 1.3 Add `getMyBookingDetail(id)` to `bookingService.js` (fetches hotel or transport booking by ID)
- [x] 1.4 Create `favoriteService.js` with `getFavorites(type)`, `removeFavorite(id)`
- [x] 1.5 Create `reviewService.js` with `getMyReviews()`, `updateReview(id, data)`, `deleteReview(id)`

## 2. My Hotel Bookings Page

- [x] 2.1 Create `MyHotelBookingsPage.jsx` at `src/pages/my-bookings/` with table layout (booking #, hotel, room, dates, status, price)
- [x] 2.2 Add React Query hook for fetching hotel bookings with loading skeleton and empty state
- [x] 2.3 Implement cancel button per booking (visible only for Pending/Confirmed status) with confirmation dialog
- [x] 2.4 Add cancel mutation with optimistic update and list refresh

## 3. My Transport Bookings Page

- [x] 3.1 Create `MyTransportBookingsPage.jsx` at `src/pages/my-bookings/` with table layout (booking #, driver, vehicle, dates, status, price)
- [x] 3.2 Add React Query hook for fetching transport bookings with loading skeleton and empty state
- [x] 3.3 Implement cancel button per booking (visible only for Pending/Confirmed status) with confirmation dialog
- [x] 3.4 Add cancel mutation with optimistic update and list refresh

## 4. Booking Detail Page

- [x] 4.1 Create `BookingDetailPage.jsx` at `src/pages/my-bookings/` with dynamic content based on `booking_type`
- [x] 4.2 Implement hotel booking detail view (hotel name, room, dates, price, status)
- [x] 4.3 Implement transport booking detail view (driver, vehicle, distance, dates, price, status)
- [x] 4.4 Add cancel action button (visible for Pending/Confirmed) with confirmation and status refresh
- [x] 4.5 Handle "not found" state for invalid booking IDs

## 5. Favorites Page

- [x] 5.1 Create `FavoritesPage.jsx` at `src/pages/favorites/` with item list (name, type, remove button)
- [x] 5.2 Add React Query hook for fetching favorites with loading and empty states
- [x] 5.3 Implement type filter tabs (All, Hotels, Attractions, Restaurants) with client-side filtering
- [x] 5.4 Implement remove favorite with confirmation dialog and list refresh

## 6. My Reviews Page

- [x] 6.1 Create `MyReviewsPage.jsx` at `src/pages/my-reviews/` with review list (entity, rating, comment, date, edit/delete buttons)
- [x] 6.2 Add React Query hook for fetching reviews with loading and empty states
- [x] 6.3 Implement delete review with confirmation dialog and list refresh
- [x] 6.4 Implement inline edit form (pre-filled rating + comment) with save/cancel actions

## 7. Routing & Navigation

- [x] 7.1 Add routes to `App.jsx`: `/my-bookings/hotel`, `/my-bookings/transport`, `/my-bookings/:id`, `/favorites`, `/my-reviews`
- [x] 7.2 Add sidebar navigation links for tourists (My Hotel Bookings, My Transport Bookings, Favorites, My Reviews)
- [x] 7.3 Ensure routes are protected (redirect to login if unauthenticated)

## 8. Polish & Verification

- [x] 8.1 Verify all pages render correctly with API responses (test with real data)
- [x] 8.2 Verify cancel flows work end-to-end (hotel and transport)
- [x] 8.3 Verify favorites filtering and removal
- [x] 8.4 Verify reviews edit and delete
- [x] 8.5 Run frontend build to check for TypeScript/build errors
