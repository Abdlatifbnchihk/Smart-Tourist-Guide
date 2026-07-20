## Context

The Smart Tourist Guide platform uses Laravel with MySQL 8.0. The `hotels` table already exists with a `hasMany(Room::class)` relationship declared, and the `bookings` table has a nullable `room_id` FK waiting to resolve. This change adds the missing `rooms` table and Eloquent model to complete the hotel booking domain.

Current state:
- `hotels` table: exists, with `hotel_id` PK
- `bookings` table: exists, with nullable `room_id` FK referencing `rooms.room_id`
- No `rooms` table or `Room` model exists yet

## Goals / Non-Goals

**Goals:**
- Create a `rooms` migration matching the MLD design in `docs/database.md`
- Create a `Room` Eloquent model with proper relationships, casts, and validation
- Add indexes on `hotel_id` and `price_per_night`
- Enforce `price_per_night > 0` and `capacity >= 1` at the model level
- Implement a working `down()` method for rollback

**Non-Goals:**
- Room CRUD controllers or API endpoints (future work)
- Room seeders or factory (can be added separately)
- Modifying the `Hotel` or `Booking` models (relationships already declared)
- Soft deletes (explicitly removed from design per requirements)

## Decisions

**1. Migration follows Laravel conventions with explicit column types**
- Use `bigIncrements('room_id')` for the PK (not `id`) to match the MLD naming
- Use `foreignId('hotel_id')->constrained('hotels', 'hotel_id')` for the FK
- Use `decimal('price_per_night', 10, 2)` for精确 pricing
- Rationale: Matches `docs/database.md` exactly and follows existing migration patterns in the project

**2. Model uses `$primaryKey` and `$fillable` overrides**
- Set `protected $primaryKey = 'room_id'` since the PK is not the default `id`
- Set `$fillable` for mass-assignment protection on all columns
- Rationale: Consistent with how other models (Hotel, Driver) handle custom PKs

**3. Validation via Eloquent model rules (not FormRequest)**
- Use `Rule::in` or closure-based rules for `price_per_night > 0` and `capacity >= 1`
- Rationale: Keeps validation close to the data layer; controllers can layer additional rules

**4. No soft deletes**
- The `deleted_at` column was explicitly removed from requirements
- Rationale: Room records should be permanently deletable; availability is controlled via the `available` boolean

## Risks / Trade-offs

- **FK constraint on `hotel_id` with cascade delete**: If a hotel is deleted, all its rooms are deleted. This is correct per the MLD (`ON DELETE CASCADE`), but means hotel deletion cascades through rooms to bookings. → Mitigation: The application layer should prevent hotel deletion when active bookings exist.

- **No unique constraint on `(hotel_id, number)`**: The MLD does not specify a composite unique index. Two hotels could theoretically have rooms with the same number, which is fine. Within a single hotel, room numbers should be unique but this is not enforced at the DB level. → Mitigation: Can add a composite unique index later if needed.

- **`available` defaults to `true`**: New rooms are immediately available. This is correct for initial creation but means imported rooms default to bookable. → Mitigation: Acceptable for the current use case.
