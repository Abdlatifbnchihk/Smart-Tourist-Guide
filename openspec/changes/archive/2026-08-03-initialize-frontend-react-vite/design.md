## Context

The Smart Tourist Guide project has a complete Laravel REST API backend serving attractions, hotels, restaurants, bookings, reviews, favorites, and itineraries. There is no frontend yet. The team needs a modern SPA to consume the API and provide an interactive tourist experience. The frontend will live in a dedicated `frontend/` directory at the project root.

## Goals / Non-Goals

**Goals:**
- Bootstrap a Vite + React (JavaScript) project with all necessary tooling
- Configure Tailwind CSS via the official `@tailwindcss/vite` plugin
- Set up Axios with a preconfigured base URL and a Vite dev proxy to the Laravel backend
- Initialize React Query for server-state management
- Create a clean folder structure that scales with feature modules (pages, components, hooks, services, context, utils, layouts, routes)
- Provide `.env.example` so developers know required environment variables

**Non-Goals:**
- Implementing any page components or UI beyond the initial scaffold
- Authentication flows or login pages
- State management beyond React Query (no Redux, Zustand, etc.)
- Unit or integration testing setup (can be added later)
- Production build optimization or deployment configuration

## Decisions

**1. Vite over Create React App or Next.js**
Vite offers fast HMR, minimal config, native ESM, and first-class React support. CRA is deprecated. Next.js adds SSR complexity unnecessary for a pure SPA consuming an existing REST API.

**2. JavaScript over TypeScript**
The team's existing Laravel codebase is PHP. Adding TypeScript introduces a transpilation layer and type overhead the team may not be familiar with. JavaScript keeps the learning curve low and the project bootstrapped quickly. TypeScript can be adopted incrementally later.

**3. `@tailwindcss/vite` plugin over PostCSS plugin**
The official Vite plugin is the recommended path for Tailwind v4. It integrates directly into Vite's pipeline without additional PostCSS config, reducing setup complexity.

**4. Axios + React Query over raw fetch**
Axios provides interceptors, automatic JSON parsing, and a cleaner API for request/response transforms. React Query handles caching, deduplication, and background refetching — essential for a data-heavy tourist app with attractions, hotels, and restaurants.

**5. Vite proxy for API calls**
Using Vite's built-in proxy avoids CORS issues during development. All `/api/v1/*` requests are forwarded to `http://localhost:8000`. This is dev-only; production will use a reverse proxy or the same-origin server.

**6. Feature-based folder structure**
Organizing by concern (`pages/`, `components/`, `hooks/`, `services/`, `routes/`, etc.) rather than by type (`api/`, `ui/`, `utils/`) aligns with how Laravel projects are structured and makes navigation intuitive for PHP developers.

## Risks / Trade-offs

- **Tailwind v4 is newer** → Some community plugins may not yet support it. Mitigation: the official Vite plugin is stable and sufficient for initial setup.
- **No TypeScript** → Less compile-time safety, harder to onboard later if the team changes their mind. Mitigation: the project is small and can be migrated with `tsc --init` and file renames.
- **Vite proxy is dev-only** → Production requires a reverse proxy or CORS configuration. Mitigation: document this in `.env.example` and the README.
- **JavaScript-only** → IDE autocompletion and IntelliSense will be less helpful without type annotations. Mitigation: JSDoc comments can provide basic hints.
