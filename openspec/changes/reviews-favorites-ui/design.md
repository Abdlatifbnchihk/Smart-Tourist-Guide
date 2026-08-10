## Context

The Smart Tourist Guide frontend is a React + Tailwind CSS application. Backend APIs for reviews (`POST /api/v1/reviews`, `GET /api/v1/reviews`) and favorites (`GET /api/v1/favorites`, `POST /api/v1/favorites/toggle`) already exist. The frontend currently has pages for viewing existing reviews and favorites but lacks:
- A page to create new reviews
- A dedicated favorites page with tab filtering
- Reusable UI components for reviews and favorites display

Existing frontend structure uses React Router for routing and Tailwind CSS for styling.

## Goals / Non-Goals

**Goals:**
- Create a Write Review Page with star rating, comment input, and entity selector
- Create a Favorites Page with tab-filtered card grid
- Build reusable Review Card, Favorite Button, and Rating Display components
- Validate review creation (completed booking required, no duplicate reviews)
- Integrate Rating Display into existing hotel, attraction, and driver cards

**Non-Goals:**
- Backend API changes (APIs already exist)
- User authentication changes
- Mobile-specific optimizations (responsive design via Tailwind is sufficient)
- Review moderation or admin features

## Decisions

### 1. Star Rating Implementation
**Decision**: Use a custom star rating component with click handlers
**Rationale**: No external library needed for simple 1-5 star selection. Keeps bundle size minimal and allows full customization with Tailwind.
**Alternative considered**: react-rating library - rejected due to unnecessary dependency

### 2. Entity Selection for Reviews
**Decision**: Dropdown selector with hotel/driver/attraction options
**Rationale**: Simpler than radio buttons, scales better if more entity types are added. Pre-fetches user's bookings to populate valid options.
**Alternative considered**: Radio buttons - rejected for poor scalability

### 3. Favorites Page Layout
**Decision**: Tab-based filtering with card grid
**Rationale**: Matches user expectations from similar apps. Tabs provide clear categorization without complex filtering UI.
**Alternative considered**: Sidebar filters - rejected as overkill for 3 categories

### 4. Component Architecture
**Decision**: Create components in `frontend/src/components/reviews/` and `frontend/src/components/favorites/`
**Rationale**: Logical grouping by feature domain. Follows existing project structure patterns.
**Alternative considered**: Flat component structure - rejected for poor maintainability

### 5. Favorite Toggle Mechanism
**Decision**: Optimistic UI updates with POST `/api/v1/favorites/toggle`
**Rationale**: Provides instant feedback. If API fails, revert state and show error toast.
**Alternative considered**: Wait for API response before UI update - rejected for poor UX

## Risks / Trade-offs

- **[Risk]** User may not have completed bookings → **Mitigation**: Show helpful message when no valid entities available for review
- **[Risk]** API failures during favorite toggle → **Mitigation**: Optimistic updates with rollback and error toast
- **[Risk]** Large number of favorites may cause performance issues → **Mitigation**: Implement pagination or virtual scrolling if needed
- **[Trade-off]** Custom star rating vs library → Gained control, lost battle-tested accessibility features (will implement ARIA labels manually)

## Migration Plan

1. Create new components and pages
2. Add routes to React Router configuration
3. Integrate Rating Display into existing hotel/attraction/driver cards
4. Test review creation and favorite management flows
5. Deploy frontend changes (no backend changes required)

## Open Questions

- Should review creation require selecting a specific booking, or just entity type?
- What is the maximum length for review comments?
- Should favorites page show item details (price, location) or just name and type?
