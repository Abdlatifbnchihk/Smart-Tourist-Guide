## Why

The Smart Tourist Guide backend (Laravel REST API) is complete and requires a modern frontend to serve tourists with attractions, hotels, restaurants, bookings, and itinerary features. The project needs a React-based SPA initialized with industry-standard tooling to enable rapid, maintainable frontend development.

## What Changes

- Initialize a Vite-powered React project in `frontend/` using the JavaScript template
- Install and configure core dependencies: @tanstack/react-query, axios, react-router-dom, tailwindcss, @tailwindcss/vite
- Configure Vite proxy to forward API requests to the Laravel backend at `http://localhost:8000`
- Set up Tailwind CSS via the official Vite plugin
- Create a scalable folder structure (components, hooks, layouts, pages, routes, services, utils, context)
- Add `.env.example` with the backend API URL

## Capabilities

### New Capabilities

- `frontend-scaffold`: Core React + Vite project setup with dependencies, configuration, and folder structure
- `tailwind-styling`: Tailwind CSS integration and base styling configuration
- `api-integration`: Axios instance, React Query setup, and Vite proxy for backend communication

### Modified Capabilities

_(none — no existing specs are modified by this change)_

## Impact

- **New code**: Entire `frontend/` directory with React boilerplate, config files, and project structure
- **Dependencies**: Adds React, Vite, Tailwind CSS, React Query, Axios, React Router to the project
- **Infrastructure**: Local dev server with HMR on port 5173 (Vite default), API proxy to `localhost:8000`
- **No backend changes**: This is frontend-only; the Laravel API remains untouched
