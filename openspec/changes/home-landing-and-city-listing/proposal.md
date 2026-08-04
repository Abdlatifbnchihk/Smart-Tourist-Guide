## Why

The Smart Tourist Guide platform needs a compelling entry point to attract users and showcase Morocco's tourism offerings. A well-designed landing page establishes brand identity, builds trust, and guides users toward key features (city exploration, hotel booking, AI trip planning). Without a landing page, users have no immediate understanding of the platform's value proposition.

## What Changes

- **New**: Home/Landing page (`/`) with hero banner, search bar, featured sections, and CTA
- **New**: Cities listing page (`/cities`) with grid view, search/filter, and city cards
- **New**: Navigation bar component with logo, links, and auth buttons
- **New**: Footer component with links, social media, and copyright
- **New**: City card component with image, stats, and hover effects
- **New**: Attraction card component for horizontal scroll section
- **New**: Feature card component for "Why Choose Us" section

## Capabilities

### New Capabilities

- `home-landing-page`: Hero section, featured cities/attractions/hotels, search bar, AI itinerary CTA
- `city-listing`: Grid view of all cities with search/filter, city cards with stats
- `shared-layout`: Navigation bar, footer, responsive layout components

### Modified Capabilities

- `api-integration`: Add API calls for fetching cities data

## Impact

- **Frontend**: New React components in `pages/`, `components/`
- **API**: GET `/api/v1/cities` for city listing and featured cities
- **Dependencies**: None new (using existing React + Vite + Tailwind stack)
- **Routing**: Add routes for `/` and `/cities`