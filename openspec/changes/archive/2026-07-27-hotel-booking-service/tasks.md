## 1. Migration

- [x] 1.1 Create migration to add `quantity_available` column to `rooms` table (default: 1)
- [x] 1.2 Run the migration

## 2. Model Updates

- [x] 2.1 Add `bookings()` relationship to Room model (hasMany HotelBooking)
- [x] 2.2 Add `room()` relationship to HotelBooking model (belongsTo Room)
- [x] 2.3 Ensure `quantity_available` is in Room model fillable and cast

## 3. Service Implementation

- [x] 3.1 Create `App\Services\HotelBookingService` class
- [x] 3.2 Implement `create(array $data)` — validate check_out > check_in
- [x] 3.3 Implement availability check — query overlapping confirmed bookings vs quantity_available
- [x] 3.4 Implement price computation — price_per_night × nights using Carbon diffInDays
- [x] 3.5 Implement `cancel(HotelBooking $booking)` — transition from pending/confirmed
- [x] 3.6 Implement `confirm(HotelBooking $booking)` — transition from pending
- [x] 3.7 Implement `complete(HotelBooking $booking)` — transition from confirmed
- [x] 3.8 Add status transition validation with RuntimeException for invalid transitions

## 4. Tests

- [x] 4.1 Create `tests/Unit/Services/HotelBookingServiceTest.php`
- [x] 4.2 Write test: create booking when room is available
- [x] 4.3 Write test: create booking when room is unavailable
- [x] 4.4 Write test: price computed correctly
- [x] 4.5 Write test: client-provided total_price is ignored
- [x] 4.6 Write test: rejects check_out <= check_in
- [x] 4.7 Write test: valid status transitions (pending→confirmed, confirmed→completed, pending→cancelled, confirmed→cancelled)
- [x] 4.8 Write test: invalid status transitions throw RuntimeException
