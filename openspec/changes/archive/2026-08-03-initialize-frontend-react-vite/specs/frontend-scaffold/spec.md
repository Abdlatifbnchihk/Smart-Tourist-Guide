## ADDED Requirements

### Requirement: Vite project initialization
The project SHALL be initialized using `npm create vite@latest` with the React JavaScript template. The project MUST NOT use TypeScript.

#### Scenario: Scaffold Vite project
- **WHEN** `npm create vite@latest frontend -- --template react` is executed
- **THEN** a `frontend/` directory is created with a valid Vite + React JavaScript project

### Requirement: Core dependencies installed
The project SHALL install the following dependencies: `@tanstack/react-query`, `axios`, `react-router-dom`, `tailwindcss`, `@tailwindcss/vite`.

#### Scenario: Dependencies are present in package.json
- **WHEN** `npm install` completes
- **THEN** `package.json` contains all five required dependencies

### Requirement: Vite proxy configuration
The Vite config SHALL proxy all `/api` requests to `http://localhost:8000`.

#### Scenario: API proxy forwards requests
- **WHEN** a request to `http://localhost:5173/api/v1/attractions` is made during development
- **THEN** the request is proxied to `http://localhost:8000/api/v1/attractions`

### Requirement: Environment variable configuration
The project SHALL include a `.env.example` file with `VITE_API_URL=http://localhost:8000/api/v1`.

#### Scenario: .env.example exists
- **WHEN** a developer clones the repository
- **THEN** `.env.example` in `frontend/` documents the required `VITE_API_URL` variable

### Requirement: Folder structure created
The project SHALL contain the following directories under `frontend/src/`: `assets/`, `components/`, `context/`, `hooks/`, `layouts/`, `pages/`, `routes/`, `services/`, `utils/`.

#### Scenario: Directory structure exists
- **WHEN** the project is initialized
- **THEN** all nine directories exist under `frontend/src/`

### Requirement: Main entry files
The project SHALL have `main.jsx` and `App.jsx` as the entry point and root component respectively, plus `index.css`.

#### Scenario: Entry files are present
- **WHEN** the project is scaffolded
- **THEN** `frontend/src/main.jsx`, `frontend/src/App.jsx`, and `frontend/src/index.css` exist
