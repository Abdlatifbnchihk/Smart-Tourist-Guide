## 1. Service Layer

- [x] 1.1 Create `src/services/driverService.js` with API functions: `getDriverProfile(userId)`, `updateDriverProfile(driverId, data)`, `getDriverVehicles(driverId)`, `createVehicle(driverId, data)`, `updateVehicle(vehicleId, data)`, `deleteVehicle(vehicleId)`, `getDriverBookings()`, `getDriverBooking(id)`, `updateBookingStatus(bookingId, status)`
- [x] 1.2 Create `src/context/DriverContext.jsx` to store driver profile ID resolved from user ID

## 2. Layout Components

- [x] 2.1 Create `src/components/driver/DriverSidebar.jsx` with navigation links: Dashboard, My Vehicles, My Bookings, Edit Profile, Back to Home, Logout
- [x] 2.2 Create `src/components/driver/DriverLayout.jsx` with sidebar + main content area

## 3. Dashboard Page

- [x] 3.1 Create `src/pages/driver/DriverDashboardPage.jsx` with stat cards: total vehicles, total bookings, pending, confirmed, completed, rating, verification status
- [x] 3.2 Add recent bookings table (top 5) and quick action links

## 4. Vehicle Management Pages

- [x] 4.1 Create `src/pages/driver/VehiclesManagementPage.jsx` with vehicle list table (brand/model, type, seats, registration, AC, price/km, actions)
- [x] 4.2 Add create vehicle modal with form fields: brand, model, type, seats, registration_number, air_conditioning, price_per_km
- [x] 4.3 Add edit vehicle modal with pre-filled form
- [x] 4.4 Add delete vehicle confirmation modal

## 5. Booking Management Pages

- [x] 5.1 Create `src/pages/driver/BookingsManagementPage.jsx` with booking list table (booking number, guest, dates, status, actions)
- [x] 5.2 Add status filter dropdown
- [x] 5.3 Create `src/pages/driver/BookingDetailPage.jsx` with full booking details and status action buttons
- [x] 5.4 Implement status transitions: Confirm, Start Trip, Complete, Cancel with confirmation modal

## 6. Profile Page

- [x] 6.1 Create `src/pages/driver/DriverProfilePage.jsx` with form: license_number, years_of_experience, languages, available toggle
- [x] 6.2 Implement profile update with success/error feedback

## 7. Routes & Integration

- [x] 7.1 Add driver routes in `App.jsx`: `/driver` (dashboard), `/driver/vehicles`, `/driver/vehicles/new`, `/driver/vehicles/:id/edit`, `/driver/bookings`, `/driver/bookings/:id`, `/driver/profile`
- [x] 7.2 Add "Driver Dashboard" link to Navbar.jsx for users with driver role
- [ ] 7.3 Test all pages with backend APIs
