## ADDED Requirements

### Requirement: Navigation bar displays
The application SHALL display a sticky navigation bar at the top of every page.

#### Scenario: Navbar renders
- **WHEN** any page loads
- **THEN** navigation bar displays with logo, navigation links, and auth buttons

### Requirement: Navbar contains logo
The navbar SHALL display "Smart Tourist Guide" text with compass icon in teal color.

#### Scenario: Logo displays
- **WHEN** navbar renders
- **THEN** left side shows compass icon and "Smart Tourist Guide" text in teal

### Requirement: Navbar contains navigation links
The navbar SHALL display horizontal navigation links: Home, Cities, Hotels, Attractions.

#### Scenario: Navigation links display
- **WHEN** navbar renders
- **THEN** center shows links for Home, Cities, Hotels, Attractions

#### Scenario: Active link highlighted
- **WHEN** user is on a page
- **THEN** corresponding navigation link is highlighted

### Requirement: Navbar contains auth buttons
The navbar SHALL display "Login" text link and "Sign Up" button on the right side.

#### Scenario: Auth buttons display
- **WHEN** navbar renders
- **THEN** right side shows "Login" link and "Sign Up" teal button

### Requirement: Navbar scroll effect
The navbar SHALL add shadow when user scrolls down.

#### Scenario: User scrolls down
- **WHEN** user scrolls past top of page
- **THEN** navbar gains subtle shadow

### Requirement: Footer displays on all pages
The application SHALL display a footer at the bottom of every page.

#### Scenario: Footer renders
- **WHEN** any page loads
- **THEN** footer displays with logo, Quick Links, Support links, and copyright

### Requirement: Footer contains social links
The footer SHALL display social media icons (Facebook, Instagram, Twitter).

#### Scenario: Social links display
- **WHEN** footer renders
- **THEN** left column shows social media icons

### Requirement: Footer contains quick links
The footer SHALL display quick links: Home, Cities, Hotels, Attractions.

#### Scenario: Quick links display
- **WHEN** footer renders
- **THEN** center column shows quick links

### Requirement: Footer contains support links
The footer SHALL display support links: About Us, Contact, Privacy Policy, Terms of Service.

#### Scenario: Support links display
- **WHEN** footer renders
- **THEN** right column shows support links