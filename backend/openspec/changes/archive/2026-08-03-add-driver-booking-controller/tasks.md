## 1. Controller Setup

- [x] 1.1 Create `app/Http/Controllers/Driver/` directory if it doesn't exist
- [x] 1.2 Create `app/Http/Controllers/Driver/BookingController.php` with class skeleton, imports, and namespace

## 2. Controller Implementation

- [x] 2.1 Implement `index()` — query bookings where `driver.user_id` equals authenticated user, return booking list
- [x] 2.2 Implement `show()` — load booking via route model binding, verify driver ownership, return booking or 403
- [x] 2.3 Implement `updateStatus()` — verify ownership, validate status transition, update status, return updated booking

## 3. Status Transition Logic

- [x] 3.1 Define valid transition map: Pending→[Confirmed, Cancelled], Confirmed→[InProgress, Cancelled], InProgress→[Completed], Cancelled→[], Completed→[]
- [x] 3.2 Add validation in `updateStatus()` that checks current status against transition map
- [x] 3.3 Return 422 with allowed next states when transition is invalid

## 4. Route Adjustment

- [x] 4.1 Update routes/api.php to map the `update` action to `updateStatus` method (or confirm the existing `update` method name works)

## 5. Verification

- [x] 5.1 Verify the controller is loadable: `php artisan tinker` → `App\Http\Controllers\Driver\BookingController`
- [x] 5.2 Verify routes resolve correctly for `/driver/transport-bookings`
