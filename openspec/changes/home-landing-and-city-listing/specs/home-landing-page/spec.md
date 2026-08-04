## ADDED Requirements

### Requirement: Hero section displays
The home page SHALL display a full-width hero section with background image, headline, subheadline, and search bar.

#### Scenario: Hero section renders
- **WHEN** user navigates to `/`
- **THEN** hero section displays with Morocco background image, dark overlay, headline "Discover Morocco's Hidden Gems", and search bar

### Requirement: Search bar accepts input
The hero search bar SHALL accept text input for searching cities, hotels, and attractions.

#### Scenario: User types in search bar
- **WHEN** user types in the search bar
- **THEN** input field updates with the entered text

#### Scenario: User submits search
- **WHEN** user clicks "Search" button or presses Enter
- **THEN** system navigates to appropriate listing page with search query

### Requirement: Featured cities section displays
The home page SHALL display a section with featured city cards in a 3-column grid.

#### Scenario: Featured cities load
- **WHEN** home page loads
- **THEN** "Explore Moroccan Cities" section displays with 3 city cards showing name, region, and stats

### Requirement: Featured attractions section displays
The home page SHALL display a horizontal scrollable row of attraction cards.

#### Scenario: Featured attractions load
- **WHEN** home page loads
- **THEN** "Popular Attractions" section displays with scrollable attraction cards showing name, city, rating, and price

### Requirement: Why Choose Us section displays
The home page SHALL display a 3-column section with feature cards highlighting platform benefits.

#### Scenario: Why Choose Us renders
- **WHEN** home page loads
- **THEN** "Why Choose Us" section displays with 3 feature cards: Verified Local Drivers, AI Trip Planning, Best Price Guarantee

### Requirement: AI Itinerary CTA section displays
The home page SHALL display a call-to-action section for AI trip planning.

#### Scenario: AI CTA renders
- **WHEN** user scrolls to CTA section
- **THEN** teal banner displays with "Plan Your Trip with AI" headline and "Start Planning" button

### Requirement: City card displays correctly
Each city card SHALL display city image, name, region badge, and stats (hotel count, attraction count).

#### Scenario: City card renders
- **WHEN** city card component receives city data
- **THEN** card displays image, city name, region badge, and hotel/attraction counts

#### Scenario: City card hover effect
- **WHEN** user hovers over city card
- **THEN** card lifts with increased shadow

### Requirement: City card click navigates
Clicking a city card SHALL navigate to the city detail page.

#### Scenario: User clicks city card
- **WHEN** user clicks on a city card
- **THEN** system navigates to `/cities/{city_id}`

### Requirement: Attraction card displays correctly
Each attraction card SHALL display image, name, city name, star rating, and price.

#### Scenario: Attraction card renders
- **WHEN** attraction card component receives attraction data
- **THEN** card displays image, attraction name, city name, star rating, and price

### Requirement: Footer displays
The home page SHALL display a footer with logo, quick links, support links, and copyright.

#### Scenario: Footer renders
- **WHEN** user scrolls to bottom of page
- **THEN** footer displays with logo, Quick Links, Support links, and copyright notice