## Why

The Smart Tourist Guide platform needs a `rooms` table to support the hotel booking module. Hotels are already defined in the system, but there is no way to represent individual bookable units (rooms) with pricing and capacity. This is a foundational requirement for the booking engine — without room records, tourists cannot search, compare, or reserve hotel accommodations.

## What Changes

- Add a new `rooms` database table with columns: `room_id`, `hotel_id` (FK), `number`, `type`, `capacity`, `price_per_night`, `available`, and timestamps.
- Create an Eloquent `Room` model with `belongsTo(Hotel)` and `hasMany(Booking)` relationships.
- Add database indexes on `hotel_id` and `price_per_night` for query performance.
- Enforce business rules: `price_per_night > 0`, `capacity >= 1`.

## Capabilities

### New Capabilities
- `rooms`: Room inventory management — defines the schema, model, and relationships for hotel rooms that can be booked by tourists.

### Modified Capabilities
<!-- No existing capabilities are modified by this change. -->

## Impact

- **Database**: New `rooms` table migration required. Must be created after the `hotels` table exists.
- **Models**: New `App\Models\Room` Eloquent model. The existing `Hotel` model already declares a `hasMany(Room::class)` relationship — this change fulfills that contract.
- **Booking system**: The `bookings` table already has a nullable `room_id` FK. This change enables that FK to resolve to actual room records.
- **API/Controllers**: Future work will need room-related endpoints (not in scope of this change).
