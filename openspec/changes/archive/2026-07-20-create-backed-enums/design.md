## Context

The application uses MySQL ENUM columns for fixed value sets (roles, statuses, booking types). Currently, Laravel models cast these to strings, which works but lacks type safety and IDE support. PHP 8.1+ backed enums provide a native way to handle these values with labels for UI display.

Current state:
- User model has `role` and `status` string casts
- Booking model has `booking_type` and `status` string casts
- Database ENUMs are defined in migrations
- No enum classes exist yet

## Goals / Non-Goals

**Goals:**
- Create PHP 8.1+ backed string enums for all fixed value sets
- Include labels for UI display on each enum case
- Update model casts to use enum classes
- Maintain backward compatibility with existing string values

**Non-Goals:**
- Changing database schema (ENUMs already exist)
- Adding validation logic (handled in controllers)
- Creating enum-based middleware (separate task)
- Removing PaymentStatus.php (already not in MLD)

## Decisions

**Decision 1: Use backed string enums (not integer-backed)**
- Rationale: Database stores string values, not integers
- Alternatives considered:
  - Integer-backed enums: Rejected because database ENUMs use strings
  - Constant classes: Less type-safe, no pattern matching support

**Decision 2: Add label() method for UI display**
- Rationale: Frontend needs human-readable labels (e.g., "Hotel Manager" not "Hotel_Manager")
- Implementation: `label()` method returns formatted string for each case

**Decision 3: Cast enums in models**
- Rationale: Automatic conversion between database strings and PHP enums
- Implementation: `protected $casts = ['role' => Role::class]`

## Risks / Trade-offs

- **Risk**: Existing code expects string values → Mitigation: Enums are backward-compatible via `->value`
- **Risk**: Validation may break → Mitigation: Use `Rule::enum()` for validation
- **Trade-off**: More files to maintain → Acceptable for type safety benefits
