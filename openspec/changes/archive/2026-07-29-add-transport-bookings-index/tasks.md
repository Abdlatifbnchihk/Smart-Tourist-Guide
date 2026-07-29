## 1. Controller Implementation

- [x] 1.1 Add `index` method to TransportBookingController
- [x] 1.2 Implement tourist filtering (user_id = auth user)
- [x] 1.3 Implement driver filtering (driver.user_id = auth user)
- [x] 1.4 Add eager loading for user, driver, room.hotel relationships
- [x] 1.5 Add pagination with configurable per_page

## 2. Routes

- [x] 2.1 Add GET transport-bookings route in api.php

## 3. Tests

- [x] 3.1 Write test for tourist listing own transport bookings
- [x] 3.2 Write test for driver listing assigned transport bookings
- [x] 3.3 Write test for unauthorized role seeing empty list
- [x] 3.4 Write test for paginated response with relationships
