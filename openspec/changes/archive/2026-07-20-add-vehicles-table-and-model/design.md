## Context

The Smart Tourist Guide platform includes a transport/ride-booking module where drivers can offer vehicles for tourist bookings. The database schema (MLD) defines a `vehicles` table that stores physical vehicle information linked to drivers. This change implements the database migration and Eloquent model to support vehicle management.

**Current state:**
- `drivers` table exists with model and relationships
- `bookings` table has optional `driver_id` FK but no vehicle association
- No vehicles table or model exists yet

## Goals / Non-Goals

**Goals:**
- Create migration for `vehicles` table matching MLD specification exactly
- Create `Vehicle` Eloquent model with proper relationships
- Ensure data integrity via constraints and indexes
- Support future booking-to-vehicle association

**Non-Goals:**
- Modify existing booking flow to include vehicle selection
- Add vehicle CRUD controllers or API endpoints
- Implement fare calculation based on vehicle type

## Decisions

**1. Follow MLD schema exactly**
- Use `TINYINT UNSIGNED` for seats (not INT as in some alternatives)
- Column `type` not `taype` as mentioned in some notes - MLD shows `type`
- VARCHAR lengths match MLD: brand(100), model(100), type(50), registration_number(50)
- **Rationale**: MLD is the source of truth; deviating creates technical debt

**2. Use `bigIncrements` for PK and FK**
- `vehicle_id` as `bigIncrements` (standard Laravel convention)
- `driver_id` as `bigInteger` to match foreign key convention
- **Rationale**: Consistent with existing tables in the project

**3. Default values**
- `air_conditioning` defaults to `false`
- Timestamps are nullable per existing convention
- **Rationale**: Minimal required data; defaults for optional features

**4. Cascade on driver deletion**
- `ON DELETE CASCADE` for `driver_id` FK
- **Rationale**: A vehicle cannot exist without its driver; matches relationship table

## Risks / Trade-offs

**[Risk]** Future booking model changes needed to link vehicle to booking
→ **Mitigation**: This is out of scope; booking-vehicle association will be a separate change

**[Risk]** Type column naming confusion (user mentioned "taype" but MLD shows "type")
→ **Mitigation**: Follow MLD exactly as it's the source of truth

**[Trade-off]** Using `TINYINT UNSIGNED` for seats limits to 255 max seats
→ **Rationale**: Acceptable for transport vehicles; matches MLD definition
