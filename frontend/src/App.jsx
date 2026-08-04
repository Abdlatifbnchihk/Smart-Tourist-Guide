import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import HomePage from './pages/HomePage'
import CitiesPage from './pages/CitiesPage'
import RegisterPage from './pages/auth/RegisterPage'
import LoginPage from './pages/auth/LoginPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import ProfilePage from './pages/auth/ProfilePage'
import TokenManagementPage from './pages/auth/TokenManagementPage'
import { ProtectedRoute } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route
            path="/profile"
            element={
              <>
                <Navbar />
                <main className="flex-1">
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                </main>
                <Footer />
              </>
            }
          />
          <Route
            path="/settings/tokens"
            element={
              <>
                <Navbar />
                <main className="flex-1">
                  <ProtectedRoute>
                    <TokenManagementPage />
                  </ProtectedRoute>
                </main>
                <Footer />
              </>
            }
          />
          <Route
            path="/*"
            element={
              <>
                <Navbar />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/cities" element={<CitiesPage />} />
                  </Routes>
                </main>
                <Footer />
              </>
            }
          />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
