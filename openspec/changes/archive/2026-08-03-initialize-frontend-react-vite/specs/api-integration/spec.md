## ADDED Requirements

### Requirement: Axios instance created
The project SHALL create an Axios instance with a base URL from the `VITE_API_URL` environment variable.

#### Scenario: Axios base URL is configured
- **WHEN** the application starts
- **THEN** an Axios instance exists with its `baseURL` set to the value of `VITE_API_URL`

### Requirement: React Query provider installed
The application SHALL wrap the root component in a `QueryClientProvider` from `@tanstack/react-query`.

#### Scenario: QueryClientProvider wraps app
- **WHEN** `main.jsx` renders the application
- **THEN** the `QueryClientProvider` component is an ancestor of the root `<App />`

### Requirement: React Router configured
The application SHALL use `react-router-dom` with `BrowserRouter` wrapping the root component.

#### Scenario: BrowserRouter wraps app
- **WHEN** `main.jsx` renders the application
- **THEN** `BrowserRouter` is an ancestor of the root `<App />`

### Requirement: Services directory initialized
The project SHALL contain a `frontend/src/services/` directory with an `api.js` file that exports the configured Axios instance.

#### Scenario: api.js exports Axios instance
- **WHEN** `services/api.js` is imported by any module
- **THEN** it exports a preconfigured Axios instance ready for API calls

### Requirement: Vite proxy routes API traffic
The Vite dev server SHALL proxy requests matching `/api/*` to `http://localhost:8000`.

#### Scenario: Proxy forwards /api requests
- **WHEN** a fetch to `/api/v1/hotels` is made from the browser during development
- **THEN** the request is forwarded to `http://localhost:8000/api/v1/hotels`
