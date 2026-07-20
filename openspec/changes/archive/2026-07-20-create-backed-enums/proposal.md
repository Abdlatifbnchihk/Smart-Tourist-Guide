## Why

The application uses string ENUM columns in the database for fixed value sets (roles, statuses, booking types). PHP 8.1+ backed enums provide type safety, IDE support, and a clean way to handle these values. Currently, models cast these columns to strings, losing the benefits of enum-based validation and labels for UI display.

## What Changes

- Create `app/Enums/Role.php` backed string enum with labels
- Create `app/Enums/UserStatus.php` backed string enum with labels
- Create `app/Enums/BookingStatus.php` backed string enum with labels
- Create `app/Enums/BookingType.php` backed string enum with labels
- **REMOVED**: `PaymentStatus.php` (not in MLD design)
- Update User model to cast `role` and `status` to their respective enums
- Update Booking model to cast `booking_type` and `status` to their respective enums

## Capabilities

### New Capabilities
- `backed-enums`: PHP 8.1+ backed string enums for all fixed value sets with labels for UI display

### Modified Capabilities
- `user-identity`: Update User model casts to use enum classes instead of string
- `booking-management`: Update Booking model casts to use enum classes instead of string

## Impact

- **Files Created**: 4 new enum files in `app/Enums/`
- **Files Modified**: `app/Models/User.php`, `app/Models/Booking.php` (casts)
- **Dependencies**: None (PHP 8.1+ native feature)
- **Breaking Changes**: None (enums are backward-compatible with string values)
