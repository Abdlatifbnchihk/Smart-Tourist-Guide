## 1. Setup and Service Layer

- [x] 1.1 Create `attractionService.js` in `frontend/src/services/` with `getAttraction(id)` and `getAttractions(filters)` functions using apiClient
- [x] 1.2 Add `toggleFavorite(type, id)` function to attractionService or reuse from hotelService if compatible

## 2. Attraction Detail Page

- [x] 2.1 Create `AttractionDetailPage.jsx` in `frontend/src/pages/` with route parameter `:id`
- [x] 2.2 Add attraction detail page to `App.jsx` routes at `/attractions/:id` wrapped in ProtectedRoute
- [x] 2.3 Implement attraction data fetching using React Query with `getAttraction(id)` call
- [x] 2.4 Display attraction info: name, description, address, opening hours
- [x] 2.5 Display city reference with link to `/cities/:city_id`
- [x] 2.6 Display average rating with star visualization component
- [x] 2.7 Create reviews section displaying list of reviews with user name, rating stars, and review text
- [x] 2.8 Handle empty reviews state with "No reviews yet" message
- [x] 2.9 Implement "Add to Favorites" / "Remove from Favorites" toggle button
- [x] 2.10 Handle unauthenticated user clicking favorites button (redirect to login)
- [x] 2.11 Add loading skeleton and error handling states

## 3. Admin Attraction Management Page

- [x] 3.1 Create `AttractionsManagementPage.jsx` in `frontend/src/pages/admin/`
- [x] 3.2 Add admin attraction route to `App.jsx` under `/admin/attractions` with AdminRoute
- [x] 3.3 Add "Attractions" menu item to admin `Sidebar.jsx` navigation
- [x] 3.4 Create filter sidebar component with inputs for city_id, category, min_price, max_price, min_rating, search
- [x] 3.5 Implement filter state management using URL search params
- [x] 3.6 Fetch attractions list using `getAttractions(filters)` with React Query
- [x] 3.7 Display attraction list in table/grid format with name, city, average_rating, opening_hours
- [x] 3.8 Connect filter changes to API calls with debounced search

## 4. Component Updates

- [x] 4.1 Update `AttractionCard.jsx` to accept and display real API data props instead of hardcoded values
- [x] 4.2 Update `CityDetailPage.jsx` attraction grid cards to link to `/attractions/:id` instead of `/attractions/:slug`
