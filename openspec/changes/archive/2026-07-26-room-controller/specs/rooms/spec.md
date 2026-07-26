## MODIFIED Requirements

### Requirement: Room model soft deletes
The `Room` model SHALL use the `SoftDeletes` trait. A `deleted_at` column SHALL exist on the `rooms` table. Soft-deleted rooms SHALL be excluded from default queries.

#### Scenario: Soft delete a room
- **WHEN** `$room->delete()` is called
- **THEN** `deleted_at` is set to current timestamp and the row remains in the database

#### Scenario: Soft deleted room excluded from query
- **WHEN** `Room::all()` is queried
- **THEN** rooms with `deleted_at` set are NOT included in results

#### Scenario: Restore soft deleted room
- **WHEN** `$room->restore()` is called on a soft-deleted room
- **THEN** `deleted_at` is set to null and room appears in queries again
