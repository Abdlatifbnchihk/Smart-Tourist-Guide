## Context

The Smart Tourist Guide platform supports 3 booking types via a single `bookings` table:
- **Hotel** — room-only bookings (implemented via `HotelBookingService`)
- **Hotel + Driver** — room + transport combo
- **Airport Transfer** — transport-only bookings

Currently only `HotelBookingService` exists. Jira ticket STG-41 requires transport booking business logic. The `bookings` table already has nullable `room_id` and `driver_id` FKs with a `booking_type` discriminator, so no schema change is needed for the booking table itself.

Transport bookings differ from hotel bookings:
- Price is computed from distance (`price_per_km × distance_km`), not nights
- Status flow includes `in_progress` (ride started) before `completed`
- Vehicle-driver relationship must be validated

## Goals / Non-Goals

**Goals:**
- Create `TransportBookingService` for airport transfer and hotel+driver bookings
- Add `in_progress` status to `BookingStatus` enum for transport flow
- Add `price_per_km` to vehicles table for fare computation
- Reuse existing `bookings` table and `Booking` model (no separate table)
- Unit tests for all transport booking scenarios

**Non-Goals:**
- Real-time GPS tracking or ride matching
- Payment gateway integration
- Driver location updates
- Modifying existing `HotelBookingService` logic
- Creating a separate `transport_bookings` table

## Decisions

**1. Single Service vs Separate Service**
- **Decision**: Create separate `TransportBookingService` alongside existing `HotelBookingService`
- **Why**: Each service has distinct business logic (availability check vs vehicle validation, different price computation). Keeps concerns separated. Both services operate on the same `Booking` model.
- **Alternative considered**: Merge into one `BookingService` — rejected because it would become bloated with conditional logic for each booking type.

**2. Status Enum Extension**
- **Decision**: Add `InProgress` case to `BookingStatus` enum
- **Why**: Transport bookings have a ride-in-progress state that hotel bookings don't need. The existing hotel transitions remain valid; `InProgress` is only used by transport.
- **Impact**: Hotel status transitions are unaffected (they don't reference `InProgress`).

**3. Price Computation**
- **Decision**: `TransportBookingService::create()` computes `total_price = vehicle->price_per_km × distance_km`
- **Why**: Price must be server-side computed per security requirements. Client-provided price is ignored.
- **Input**: `vehicle_id`, `distance_km` (provided by user or computed from route)

**4. Vehicle-Driver Validation**
- **Decision**: Service validates that `vehicle.driver_id` matches the `driver_id` on the booking
- **Why**: Prevents booking a vehicle that doesn't belong to the selected driver. Enforces data integrity at service level.

**5. Controller Strategy**
- **Decision**: Extend existing `HotelBookingController` with transport-aware methods OR create unified `BookingController`
- **Recommended**: Create `TransportBookingController` for transport-specific endpoints, keep `HotelBookingController` for hotel-only. Both use the same `Booking` model.
- **Alternative**: One unified controller — rejected for clarity and separation of concerns.

## Risks / Trade-offs

- **Risk**: Adding `in_progress` to `BookingStatus` might affect existing hotel booking logic
  → **Mitigation**: Hotel service doesn't reference `InProgress` in its transition map. Only transport service uses it.

- **Risk**: `price_per_km` migration on vehicles table might affect existing vehicle data
  → **Mitigation**: Column is nullable with default 0. Existing vehicles remain valid; admins set pricing later.

- **Risk**: Separate services could lead to code duplication (booking number generation, transition logic)
  → **Mitigation**: Extract shared logic into traits or base service class if duplication becomes problematic.

## Migration Plan

1. Add `InProgress` to `BookingStatus` enum
2. Create migration to add `price_per_km` (decimal, nullable, default 0) to vehicles table
3. Update `Vehicle` model fillable and casts
4. Create `TransportBookingService`
5. Create `TransportBookingController`
6. Add routes for transport bookings
7. Write unit tests
8. Run full test suite to verify no regressions
