## Purpose

Hotel Manager Bookings Management allows hotel owners to view and manage bookings for their properties. Provides listing with filtering and status update capabilities.

## Requirements

### Requirement: List bookings for hotel(s)
The system SHALL display a list of all bookings for the hotel manager's properties at `/hotel-manager/bookings`.

#### Scenario: View bookings list
- **WHEN** hotel manager navigates to `/hotel-manager/bookings`
- **THEN** system displays a table/list of bookings with columns: guest name, hotel name, room number, check-in date, check-out date, status, and action buttons

#### Scenario: Empty bookings list
- **WHEN** hotel manager has no bookings
- **THEN** system displays a message indicating no bookings exist

### Requirement: Filter bookings by status
The system SHALL allow hotel managers to filter bookings by status.

#### Scenario: Filter by pending status
- **WHEN** hotel manager selects "Pending" from status filter
- **THEN** system displays only bookings with pending status

#### Scenario: Filter by confirmed status
- **WHEN** hotel manager selects "Confirmed" from status filter
- **THEN** system displays only bookings with confirmed status

#### Scenario: Filter by completed status
- **WHEN** hotel manager selects "Completed" from status filter
- **THEN** system displays only bookings with completed status

#### Scenario: Clear status filter
- **WHEN** hotel manager selects "All" from status filter
- **THEN** system displays all bookings regardless of status

### Requirement: Update booking status
The system SHALL allow hotel managers to update booking status (confirm, complete, cancel).

#### Scenario: Confirm pending booking
- **WHEN** hotel manager clicks "Confirm" button on a pending booking
- **THEN** system sends PUT request to update booking status to confirmed and refreshes the list

#### Scenario: Complete confirmed booking
- **WHEN** hotel manager clicks "Complete" button on a confirmed booking
- **THEN** system sends PUT request to update booking status to completed and refreshes the list

#### Scenario: Cancel booking
- **WHEN** hotel manager clicks "Cancel" button on a booking
- **THEN** system displays confirmation dialog asking "Are you sure you want to cancel this booking?"

#### Scenario: Confirm cancellation
- **WHEN** hotel manager confirms cancellation
- **THEN** system sends PUT request to update booking status to cancelled and refreshes the list

#### Scenario: Prevent invalid status transitions
- **WHEN** hotel manager attempts to confirm a completed booking
- **THEN** system does not show the "Confirm" button for completed bookings

### Requirement: Booking status display
The system SHALL display booking status with appropriate visual indicators.

#### Scenario: Display pending status
- **WHEN** booking has pending status
- **THEN** system displays status with yellow/orange indicator

#### Scenario: Display confirmed status
- **WHEN** booking has confirmed status
- **THEN** system displays status with green indicator

#### Scenario: Display completed status
- **WHEN** booking has completed status
- **THEN** system displays status with blue/gray indicator

#### Scenario: Display cancelled status
- **WHEN** booking has cancelled status
- **THEN** system displays status with red indicator and strikethrough text
