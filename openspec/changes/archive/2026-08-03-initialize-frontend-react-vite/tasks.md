## 1. Project Scaffolding

- [x] 1.1 Run `npm create vite@latest frontend -- --template react` to scaffold the Vite + React project
- [x] 1.2 Verify `frontend/` directory is created with valid `package.json`, `vite.config.js`, and source files
- [x] 1.3 Remove any TypeScript config files (`tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`) and `.ts`/`.tsx` files if present

## 2. Dependencies Installation

- [x] 2.1 Install dependencies: `npm install @tanstack/react-query axios react-router-dom`
- [x] 2.2 Install Tailwind dependencies: `npm install tailwindcss @tailwindcss/vite`
- [x] 2.3 Verify all five dependencies appear in `package.json`

## 3. Vite Configuration

- [x] 3.1 Import `@tailwindcss/vite` in `vite.config.js` and add it to the `plugins` array
- [x] 3.2 Add a `server.proxy` entry in `vite.config.js` to forward `/api` requests to `http://localhost:8000`

## 4. Tailwind CSS Setup

- [x] 4.1 Replace contents of `frontend/src/index.css` with `@import "tailwindcss";`
- [x] 4.2 Remove default Vite CSS files (`App.css`, any leftover boilerplate styles)

## 5. Environment Variables

- [x] 5.1 Create `frontend/.env.example` with `VITE_API_URL=http://localhost:8000/api/v1`

## 6. Folder Structure

- [x] 6.1 Create directories under `frontend/src/`: `assets/`, `components/`, `context/`, `hooks/`, `layouts/`, `pages/`, `routes/`, `services/`, `utils/`
- [x] 6.2 Add a `.gitkeep` file in each empty directory to ensure they are tracked by git

## 7. Entry Files and Providers

- [x] 7.1 Create `frontend/src/services/api.js` exporting a preconfigured Axios instance with `baseURL` from `import.meta.env.VITE_API_URL`
- [x] 7.2 Update `frontend/src/main.jsx` to wrap the app in `BrowserRouter` and `QueryClientProvider`
- [x] 7.3 Update `frontend/src/App.jsx` to be a minimal functional component

## 8. Verification

- [x] 8.1 Run `npm run dev` and verify the dev server starts on port 5173
- [x] 8.2 Confirm Tailwind CSS is functional by adding a utility class to a component and verifying the style applies
- [x] 8.3 Confirm the Vite proxy is configured by checking `vite.config.js`
- [x] 8.4 Confirm `.env.example` exists and contains the correct API URL
- [x] 8.5 Confirm all nine directories exist under `frontend/src/`
