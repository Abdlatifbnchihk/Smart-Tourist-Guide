## 1. Form Request & API Resource

- [x] 1.1 Create `StoreHotelBookingRequest` with validation rules for room_id, start_date, end_date
- [x] 1.2 Add authorization check for tourist role in form request
- [x] 1.3 Create `HotelBookingResource` with user, room, hotel relationships

## 2. Controller Setup

- [x] 2.1 Create `HotelBookingController` in `App\Http\Controllers\Api\V1`
- [x] 2.2 Inject `HotelBookingService` in constructor

## 3. Index Endpoint

- [x] 3.1 Implement index method with role-based filtering
- [x] 3.2 Add tourist filtering: `Booking::where('user_id', $userId)`
- [x] 3.3 Add hotel_owner filtering: `whereHas('room.hotel', fn($q) => $q->where('created_by', $userId))`
- [x] 3.4 Add pagination support with configurable per_page

## 4. Store Endpoint

- [x] 4.1 Implement store method using `StoreHotelBookingRequest`
- [x] 4.2 Call `HotelBookingService::create()` with validated data
- [x] 4.3 Handle DomainException for unavailable room (return 422)
- [x] 4.4 Return 201 with `HotelBookingResource`

## 5. Show Endpoint

- [x] 5.1 Implement show method with authorization check
- [x] 5.2 Check if user owns booking (tourist) or manages hotel (hotel_owner)
- [x] 5.3 Return 403 if unauthorized
- [x] 5.4 Load relationships: user, room, hotel

## 6. Cancel Endpoint

- [x] 6.1 Implement cancel method with authorization check
- [x] 6.2 Check if user can cancel (tourist owns booking or hotel_owner manages hotel)
- [x] 6.3 Call `HotelBookingService::cancel()` on booking
- [x] 6.4 Handle RuntimeException for invalid transition (return 422)
- [x] 6.5 Return 200 with updated booking

## 7. Status Endpoint

- [x] 7.1 Implement status method with hotel_owner authorization
- [x] 7.2 Validate status field accepts only 'confirmed' or 'completed'
- [x] 7.3 Call appropriate service method based on status value
- [x] 7.4 Handle RuntimeException for invalid transition (return 422)
- [x] 7.5 Return 200 with updated booking

## 8. Routes

- [x] 8.1 Add resource routes for hotel-bookings in `api.php`
- [x] 8.2 Add custom routes for cancel and status endpoints

## 9. Testing

- [x] 9.1 Write test for tourist listing own bookings
- [x] 9.2 Write test for hotel_owner listing bookings for their hotels
- [x] 9.3 Write test for booking creation with validation
- [x] 9.4 Write test for booking detail authorization
- [x] 9.5 Write test for cancel authorization and validation
- [x] 9.6 Write test for status update authorization and validation