## Context

The Smart Tourist Guide frontend has been scaffolded with React + Vite + Tailwind CSS (STG-48). An API client with interceptors and type definitions is in place (STG-49). The backend API is running at `localhost:8000` with endpoints for cities, hotels, attractions, etc. We need to build the first user-facing pages to establish the platform's visual identity and core navigation.

## Goals / Non-Goals

**Goals:**
- Create a visually compelling landing page that showcases Morocco's tourism offerings
- Implement responsive design (desktop-first, mobile-compatible)
- Build a functional cities listing page with search/filter
- Establish reusable component patterns for cards, sections, and layouts
- Integrate with existing API client for data fetching

**Non-Goals:**
- User authentication UI (login/signup pages - separate task)
- Hotel booking flow (separate task)
- AI itinerary generation UI (separate task)
- Backend API changes (using existing endpoints)
- State management beyond local component state

## Decisions

### 1. Component Architecture

**Decision**: Use page-level components with shared UI components.

**Structure**:
```
pages/
  HomePage.jsx          # Landing page
  CitiesPage.jsx        # Cities listing
components/
  layout/
    Navbar.jsx          # Navigation bar
    Footer.jsx          # Footer
  ui/
    CityCard.jsx        # City card component
    AttractionCard.jsx  # Attraction card for scroll section
    FeatureCard.jsx     # "Why Choose Us" card
    SearchBar.jsx       # Reusable search input
```

**Rationale**: Keeps pages focused on composition while shared components handle presentation. Aligns with existing project structure.

### 2. Data Fetching

**Decision**: Use the existing `apiClient` with `useEffect` and local state.

**Alternatives considered**:
- React Query: Not yet installed (separate task)
- SWR: Additional dependency

**Rationale**: Simple fetch-on-mount pattern works for these pages. Can migrate to React Query later without changing component structure.

### 3. Styling Approach

**Decision**: Tailwind CSS utility classes with consistent design tokens.

**Color palette**:
- Primary: Teal (#0D9488) - navbar, buttons, active states
- Accent: Amber (#F59E0B) - star ratings, highlights
- Background: White (#FFFFFF), Slate-50 (#F8FAFC)
- Text: Slate-800 (#1E293B) headings, Slate-600 (#64748B) body
- Footer: Slate-900 (#0F172A)

**Typography**:
- Headings: Poppins (bold)
- Body: Inter (regular)

**Rationale**: Tailwind enables rapid prototyping with consistent design. Custom colors match the provided design spec.

### 4. Image Handling

**Decision**: Use placeholder images initially, with Unsplash URLs for demo.

**Rationale**: Backend doesn't have image upload yet. Unsplash provides high-quality Morocco-themed images for development.

### 5. Search Implementation

**Decision**: Client-side filtering for cities listing.

**Rationale**: City list is small enough (<50 cities). Avoids unnecessary API calls for filtering. Can add server-side search later if needed.

## Risks / Trade-offs

- [No React Query] → Manual loading/error states; can migrate later
- [Placeholder images] → Won't match final design; acceptable for MVP
- [Client-side search] → Limited to loaded data; fine for small datasets
- [No state management] → Each page manages own state; sufficient for current scope