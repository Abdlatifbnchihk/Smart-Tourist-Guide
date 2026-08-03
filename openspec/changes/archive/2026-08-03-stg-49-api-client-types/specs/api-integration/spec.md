## MODIFIED Requirements

### Requirement: Axios instance created
The project SHALL create an Axios instance with a base URL from the `VITE_API_URL` environment variable. The instance SHALL include request and response interceptors.

#### Scenario: Axios base URL is configured
- **WHEN** the application starts
- **THEN** an Axios instance exists with its `baseURL` set to the value of `VITE_API_URL`

#### Scenario: Request interceptor is attached
- **WHEN** the Axios instance is created
- **THEN** a request interceptor is registered that attaches the Authorization header

#### Scenario: Response interceptor is attached
- **WHEN** the Axios instance is created
- **THEN** a response interceptor is registered that handles 401 errors

### Requirement: Services directory initialized
The project SHALL contain a `frontend/src/services/` directory with an `apiClient.js` file that exports the configured Axios instance with interceptors.

#### Scenario: apiClient.js exports Axios instance
- **WHEN** `services/apiClient.js` is imported by any module
- **THEN** it exports a preconfigured Axios instance with auth interceptors ready for API calls
