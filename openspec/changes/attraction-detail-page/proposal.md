## Why

The Smart Tourist Guide platform currently displays attraction cards in the CityDetailPage but links to `/attractions/:slug` which leads to a 404. Users cannot view detailed attraction information, read reviews, or add attractions to favorites from the frontend. The AttractionCard on the HomePage also uses hardcoded data instead of real API data.

## What Changes

- **New Attraction Detail Page**: A dedicated page at `/attractions/:id` displaying full attraction information including name, description, address, opening hours, city reference, average rating, and reviews list.
- **Attraction Listing with Filters**: An admin-facing attraction management page with sidebar filters (city_id, category, min_price, max_price, min_rating, search) integrated into the admin sidebar navigation.
- **Add to Favorites**: A toggle button on the attraction detail page allowing authenticated users to add/remove attractions from their favorites using the existing favorites API.
- **API Integration**: New `attractionService.js` connecting frontend to backend `GET /api/v1/attractions` and `GET /api/v1/attractions/{attraction}` endpoints.

## Capabilities

### New Capabilities
- `attraction-detail`: Frontend page displaying full attraction details with reviews, ratings, city link, and favorites toggle.
- `attraction-listing-admin`: Admin attraction management page with filtering sidebar for listing attractions.

### Modified Capabilities
- `attractions`: Update to support frontend integration with backend API endpoints (no spec-level requirement changes, only implementation).
- `favorite-management`: No changes needed - existing toggle favorite API is sufficient.

## Impact

- **Frontend code**: New pages (`AttractionDetailPage.jsx`, `AttractionsManagementPage.jsx`), new service file (`attractionService.js`), updates to `App.jsx` routing, updates to admin `Sidebar.jsx` navigation.
- **Backend API**: No changes - existing endpoints `GET /api/v1/attractions` and `GET /api/v1/attractions/{attraction}` are sufficient.
- **Dependencies**: No new dependencies required.
- **Admin sidebar**: Add "Attractions" menu item linking to the new management page.
