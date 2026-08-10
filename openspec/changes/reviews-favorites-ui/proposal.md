## Why

The Smart Tourist Guide frontend lacks user-facing pages for creating reviews and managing favorites. While backend APIs exist for reviews and favorites, tourists cannot currently submit new reviews or access a dedicated favorites page with filtering. This creates a gap in the user experience—tourists can view their existing reviews and favorites but have no way to add new reviews or easily browse saved items by category.

## What Changes

- **New Write Review Page** (`/reviews/new`): Form with star rating selector, comment textarea, and entity selector (hotel/driver/attraction) for submitting new reviews
- **New Favorites Page** (`/favorites`): Tab-filtered card grid showing saved hotels, attractions, and restaurants with remove functionality
- **Reusable Review Card Component**: Displays star rating, user name, date, comment, and edit/delete buttons for review owners
- **Reusable Favorite Button Component**: Heart icon toggle for adding/removing items from favorites
- **Reusable Rating Display Component**: Star rating visualization showing average scores, used in hotel, attraction, driver cards and detail pages

## Capabilities

### New Capabilities
- `write-review`: Write Review Page with star rating selector, comment input, entity selector, and validation (completed booking required, no duplicate reviews)
- `favorites-page`: Favorites Page with tab filters (Hotels/Attractions/Restaurants), card grid layout, and remove favorite toggle
- `review-favorites-components`: Reusable UI components - Review Card, Favorite Button, and Rating Display

### Modified Capabilities
- `tourist-reviews`: Requirements extended to include review creation at `/reviews/new` route
- `tourist-favorites`: Requirements extended to include tab-filtered card grid UI and toggle-based favorite management

## Impact

- **Frontend pages**: New React components and pages in `frontend/src/`
- **API integration**: POST `/api/v1/reviews`, GET `/api/v1/favorites`, POST `/api/v1/favorites/toggle`
- **Existing components**: Hotel, attraction, and driver cards/details will integrate Rating Display component
- **Styling**: Tailwind CSS for all new UI components
- **Dependencies**: No new external dependencies required
