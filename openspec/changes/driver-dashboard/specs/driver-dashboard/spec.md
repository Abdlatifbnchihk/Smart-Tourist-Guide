## ADDED Requirements

### Requirement: Driver Dashboard Overview
The system SHALL display a dashboard page at `/driver` showing driver-specific statistics and recent activity.

#### Scenario: Dashboard loads with stats
- **WHEN** driver navigates to `/driver`
- **THEN** system displays stat cards for: total vehicles, assigned bookings count, pending bookings, completed bookings, driver rating, and verification status

#### Scenario: Dashboard shows recent bookings
- **WHEN** driver dashboard loads
- **THEN** system displays a table of the 5 most recent transport bookings with guest name, route, status, and date

#### Scenario: Dashboard quick actions
- **WHEN** driver dashboard loads
- **THEN** system displays quick action links to: My Vehicles, My Bookings, Edit Profile

### Requirement: Driver Navigation Sidebar
The system SHALL display a fixed sidebar for driver routes with navigation links.

#### Scenario: Sidebar navigation items
- **WHEN** driver is on any `/driver/*` route
- **THEN** sidebar shows links for: Dashboard, My Vehicles, My Bookings, Edit Profile

#### Scenario: Active link highlighting
- **WHEN** driver is on a specific page
- **THEN** the corresponding sidebar link is highlighted

#### Scenario: Back to Home link
- **WHEN** driver views sidebar
- **THEN** sidebar displays a "Back to Home" link at the bottom

#### Scenario: Logout button
- **WHEN** driver clicks logout in sidebar
- **THEN** system logs out and redirects to login page
