import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import AdminLayout from './components/admin/AdminLayout'
import HomePage from './pages/HomePage'
import CitiesPage from './pages/CitiesPage'
import CityDetailPage from './pages/CityDetailPage'
import RegisterPage from './pages/auth/RegisterPage'
import LoginPage from './pages/auth/LoginPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import ProfilePage from './pages/auth/ProfilePage'
import TokenManagementPage from './pages/auth/TokenManagementPage'
import DashboardPage from './pages/admin/DashboardPage'
import CitiesManagementPage from './pages/admin/CitiesManagementPage'
import { ProtectedRoute, AdminRoute } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <AdminRoute>
                <AdminLayout>
                  <Routes>
                    <Route index element={<DashboardPage />} />
                    <Route path="cities" element={<CitiesManagementPage />} />
                  </Routes>
                </AdminLayout>
              </AdminRoute>
            }
          />

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
                    <Route path="/cities/:id" element={<CityDetailPage />} />
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
