## 1. Component Setup

- [x] 1.1 Create `frontend/src/components/reviews/` directory structure
- [x] 1.2 Create `frontend/src/components/favorites/` directory structure
- [x] 1.3 Create `frontend/src/pages/reviews/` directory structure
- [x] 1.4 Create `frontend/src/pages/favorites/` directory structure

## 2. Reusable Components - Rating Display

- [x] 2.1 Create `RatingDisplay` component with star rendering logic
- [x] 2.2 Implement half-star support for average ratings
- [x] 2.3 Add configurable size prop (sm, md, lg)
- [x] 2.4 Style with Tailwind CSS for consistent appearance

## 3. Reusable Components - Favorite Button

- [x] 3.1 Create `FavoriteButton` component with heart icon toggle
- [x] 3.2 Implement filled/outline heart states
- [x] 3.3 Add API integration with `POST /api/v1/favorites/toggle`
- [x] 3.4 Implement optimistic UI updates with error rollback
- [x] 3.5 Add confirmation dialog before toggle

## 4. Reusable Components - Review Card

- [x] 4.1 Create `ReviewCard` component with star rating, user name, date, comment display
- [x] 4.2 Add conditional Edit/Delete buttons based on ownership
- [x] 4.3 Integrate `RatingDisplay` component
- [x] 4.4 Style with Tailwind CSS for card layout

## 5. Write Review Page

- [x] 5.1 Create `WriteReviewPage` component at `/reviews/new`
- [x] 5.2 Implement star rating selector with click handlers
- [x] 5.3 Create comment textarea with character limit
- [x] 5.4 Build entity type dropdown (hotel/driver/attraction)
- [x] 5.5 Fetch user's completed bookings for entity selector
- [x] 5.6 Implement form validation (required fields, booking check, duplicate check)
- [x] 5.7 Add API integration with `POST /api/v1/reviews`
- [x] 5.8 Add success/error feedback and navigation

## 6. Favorites Page

- [x] 6.1 Create `FavoritesPage` component at `/favorites`
- [x] 6.2 Implement tab filter component (All, Hotels, Attractions, Restaurants)
- [x] 6.3 Build card grid layout for favorited items
- [x] 6.4 Create hotel, attraction, and restaurant card variants
- [x] 6.5 Integrate `FavoriteButton` component on each card
- [x] 6.6 Integrate `RatingDisplay` component on each card
- [x] 6.7 Add API integration with `GET /api/v1/favorites`
- [x] 6.8 Implement empty state handling

## 7. Route Configuration

- [x] 7.1 Add `/reviews/new` route to React Router
- [x] 7.2 Add `/favorites` route to React Router
- [x] 7.3 Add navigation links in header/sidebar

## 8. Integration with Existing Pages

- [x] 8.1 Update hotel cards to use `RatingDisplay` component
- [x] 8.2 Update attraction cards to use `RatingDisplay` component
- [x] 8.3 Update driver cards to use `RatingDisplay` component
- [x] 8.4 Update hotel detail page to use `RatingDisplay` component
- [x] 8.5 Update attraction detail page to use `RatingDisplay` component

## 9. Testing

- [x] 9.1 Test Write Review Page form validation
- [x] 9.2 Test star rating selector interaction
- [x] 9.3 Test Favorites Page tab filtering
- [x] 9.4 Test Favorite Button toggle functionality
- [x] 9.5 Test Review Card ownership-based button display
- [x] 9.6 Test Rating Display in different contexts
