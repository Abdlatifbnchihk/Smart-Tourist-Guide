## 1. Enum & Migration

- [x] 1.1 Add `InProgress = 'InProgress'` case to `BookingStatus` enum with label
- [x] 1.2 Create migration to add `price_per_km` (decimal 10,2, nullable, default 0) to vehicles table
- [x] 1.3 Update `Vehicle` model — add `price_per_km` to fillable and casts

## 2. TransportBookingService

- [x] 2.1 Create `TransportBookingService` in `app/Services/`
- [x] 2.2 Implement `create(array $data)` — validate vehicle belongs to driver, compute total_price, create booking with status Pending
- [x] 2.3 Implement `confirm(Booking $booking)` — transition Pending→Confirmed
- [x] 2.4 Implement `start(Booking $booking)` — transition Confirmed→InProgress
- [x] 2.5 Implement `complete(Booking $booking)` — transition InProgress→Completed
- [x] 2.6 Implement `cancel(Booking $booking)` — transition Pending/Confirmed→Cancelled
- [x] 2.7 Implement private `transition()` method with transport-specific VALID_TRANSITIONS map

## 3. Controller & Routes

- [x] 3.1 Create `TransportBookingController` in `app/Http/Controllers/Api/V1/`
- [x] 3.2 Implement `store` method using transport service create
- [x] 3.3 Implement `show` method with authorization (tourist owns booking or driver owns hotel)
- [x] 3.4 Implement `cancel` method with authorization
- [x] 3.5 Implement `status` method for driver to confirm/start/complete
- [x] 3.6 Create `StoreTransportBookingRequest` with validation rules (vehicle_id, driver_id, distance_km, start_date, end_date)
- [x] 3.7 Add transport booking routes in `api.php` under `auth:sanctum` middleware

## 4. Form Request & Resource

- [x] 4.1 Create `StoreTransportBookingRequest` — validate vehicle_id, driver_id, distance_km required|gt:0, start_date, end_date
- [x] 4.2 Create `TransportBookingResource` — same structure as `HotelBookingResource` with transport fields

## 5. Tests

- [x] 5.1 Write test for creating airport transfer booking successfully
- [x] 5.2 Write test for creating hotel+driver booking successfully
- [x] 5.3 Write test for vehicle-driver mismatch rejection
- [x] 5.4 Write test for price computation (price_per_km x distance_km)
- [x] 5.5 Write test for client-provided total_price being ignored
- [x] 5.6 Write test for all status transitions (confirm, start, complete, cancel)
- [x] 5.7 Write test for invalid status transitions (start from pending, confirm completed, etc.)
- [x] 5.8 Write test for zero/negative distance rejection
- [x] 5.9 Write test for authorization (tourist sees own, driver sees their)
