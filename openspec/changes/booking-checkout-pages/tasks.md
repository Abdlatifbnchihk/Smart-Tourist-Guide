## 1. Setup and Service Layer

- [x] 1.1 Create `bookingService.js` in `frontend/src/services/` with `createHotelBooking(data)` and `createTransportBooking(data)` functions using apiClient
- [x] 1.2 Add `getDrivers(filters)` function to bookingService for fetching available drivers

## 2. Hotel Booking Checkout Page

- [x] 2.1 Create `HotelBookingCheckout.jsx` in `frontend/src/pages/booking/`
- [x] 2.2 Add booking route to `App.jsx` at `/booking/hotel` wrapped in ProtectedRoute
- [x] 2.3 Implement room data extraction from location.state with fallback error handling
- [x] 2.4 Display room summary: hotel name, room type, price per night, capacity
- [x] 2.5 Create check-in date picker input with min date validation
- [x] 2.6 Create check-out date picker input with min date = check-in + 1 day
- [x] 2.7 Create guest count numeric input
- [x] 2.8 Implement price calculation display: `price_per_night x nights = total`
- [x] 2.9 Implement "Confirm Booking" button with form validation
- [x] 2.10 Handle API submission with loading state, success message, and error handling

## 3. Transport Booking Checkout Page

- [x] 3.1 Create `TransportBookingCheckout.jsx` in `frontend/src/pages/booking/`
- [x] 3.2 Add booking route to `App.jsx` at `/booking/transport` wrapped in ProtectedRoute
- [x] 3.3 Fetch drivers list from API using React Query
- [x] 3.4 Display driver/vehicle selection cards with name, rating, vehicle info, price per km
- [x] 3.5 Create distance input field in km
- [x] 3.6 Create pickup date picker input
- [x] 3.7 Create dropoff date picker input
- [x] 3.8 Create booking type selector with "Hotel + Driver" and "Airport Transfer" options
- [x] 3.9 Implement price estimate display: `price_per_km x distance = total`
- [x] 3.10 Implement "Confirm Booking" button with form validation
- [x] 3.11 Handle API submission with loading state, success message, and error handling

## 4. Route Updates

- [x] 4.1 Update `RoomSelectionPage.jsx` to navigate to `/booking/hotel` instead of `/checkout`
- [x] 4.2 Pass room and hotel data via location.state in navigation
