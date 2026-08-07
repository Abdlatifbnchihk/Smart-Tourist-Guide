## Purpose

Hotel Manager Dashboard provides an overview interface for hotel owners to view statistics and navigate to management pages. Allows managers to quickly see key metrics and access their hotels and bookings.

## Requirements

### Requirement: Dashboard displays overview statistics
The system SHALL display a dashboard overview page at `/hotel-manager` showing key statistics for the logged-in hotel manager.

#### Scenario: View dashboard statistics
- **WHEN** hotel manager navigates to `/hotel-manager`
- **THEN** system displays: total number of hotels owned, total rooms across all hotels, count of pending bookings, count of confirmed bookings, count of completed bookings, and average rating across all hotels

### Requirement: Dashboard links to management pages
The system SHALL provide navigation links from the dashboard to other management pages.

#### Scenario: Navigate to hotels list
- **WHEN** hotel manager clicks "My Hotels" link on dashboard
- **THEN** system navigates to `/hotel-manager/hotels`

#### Scenario: Navigate to bookings
- **WHEN** hotel manager clicks "Bookings" link on dashboard
- **THEN** system navigates to `/hotel-manager/bookings`

### Requirement: Dashboard shows recent activity
The system SHALL display recent bookings or updates on the dashboard.

#### Scenario: View recent bookings
- **WHEN** hotel manager views dashboard
- **THEN** system shows a list of the 5 most recent bookings with status and date
