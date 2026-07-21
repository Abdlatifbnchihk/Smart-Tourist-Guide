## MODIFIED Requirements

### Requirement: User model has correct fillable fields

The User model SHALL have `$fillable` = `['first_name', 'last_name', 'email', 'phone', 'password', 'role', 'status', 'active']`. The field `name` SHALL NOT exist in the fillable array.

#### Scenario: Mass assignment works for all fields

- **WHEN** a user is created via `User::create([...])` with all fillable fields
- **THEN** all fields SHALL be persisted correctly

#### Scenario: Name field does not exist

- **WHEN** checking User model `$fillable`
- **THEN** the array SHALL NOT contain `name` or `role_id`
