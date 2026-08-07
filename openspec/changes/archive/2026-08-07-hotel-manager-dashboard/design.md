## Context

The Smart Tourist Guide application currently lacks a dedicated interface for hotel managers to manage their properties. Hotel owners need to oversee their hotels, rooms, and bookings through a centralized dashboard. The existing frontend is built with React and Tailwind CSS, with API endpoints already defined for hotel management operations.

Current state:
- API endpoints exist at `/api/v1/hotel-manager/manage-hotel` and `/api/v1/hotel-manager/manage-rooms`
- Bookings API available at `/api/v1/hotel-bookings`
- Frontend uses React with React Router for navigation
- UI components styled with Tailwind CSS

## Goals / Non-Goals

**Goals:**
- Create a complete hotel manager dashboard with 6 pages
- Provide overview statistics for quick insights
- Enable full CRUD operations for hotels and rooms
- Allow booking management with status updates
- Reuse existing UI patterns and components
- Follow established routing conventions

**Non-Goals:**
- Backend API implementation (endpoints already exist)
- User authentication/authorization (assumed handled elsewhere)
- Payment processing integration
- Analytics beyond basic statistics
- Mobile-specific responsive design (desktop-first)

## Decisions

**Decision 1: Route Structure**
- Use `/hotel-manager` as the base path with nested routes
- Chosen over `/owner` or `/manager` for clarity and consistency
- Route hierarchy: `/hotel-manager` (overview) → `/hotel-manager/hotels` (list) → `/hotel-manager/hotels/:id/edit` (edit)

**Decision 2: Component Architecture**
- Create page-level components for each route
- Extract reusable form components for hotel and room creation/editing
- Use shared table components for listings
- Chosen for maintainability and code reuse

**Decision 3: State Management**
- Use React hooks (useState, useEffect) for local component state
- Fetch data on component mount using useEffect
- No global state management needed (data is page-specific)
- Chosen for simplicity given the scope

**Decision 4: Form Handling**
- Controlled components with form state
- Client-side validation before submission
- Success/error feedback via toast notifications
- Chosen for consistency with existing patterns

## Risks / Trade-offs

**Risk 1: API Integration Complexity**
- Multiple endpoints to integrate with
- Mitigation: Create API service layer for centralized data fetching

**Risk 2: Form Validation**
- Complex forms with multiple fields
- Mitigation: Implement field-level validation with clear error messages

**Risk 3: State Synchronization**
- Keeping UI in sync with server state after mutations
- Mitigation: Refetch data after successful mutations

**Risk 4: Soft-delete Operations**
- Restoring deleted items requires special handling
- Mitigation: Clear UI indicators for deleted items with explicit restore action

## Migration Plan

1. Create new page components under `/hotel-manager` route
2. Add route definitions to React Router configuration
3. Implement API service functions for each endpoint
4. Build UI components following existing patterns
5. Test each page independently before integration
6. Deploy as feature-complete module

## Open Questions

1. Should we implement pagination for hotel and room lists?
2. What validation rules should be enforced on hotel/star ratings?
3. Should booking status changes require confirmation dialogs?
4. How should we handle concurrent editing of the same hotel/room?
