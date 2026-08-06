import { Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import AdminLayout from './components/admin/AdminLayout'
import HotelManagerLayout from './components/hotel-manager/HotelManagerLayout'
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
import HotelsManagementPage from './pages/admin/HotelsManagementPage'
import AdminRoomsManagementPage from './pages/admin/RoomsManagementPage'
import HotelManagerDashboardPage from './pages/hotel-manager/HotelManagerDashboardPage'
import HotelManagerHotelsPage from './pages/hotel-manager/HotelsManagementPage'
import HotelManagerRoomsPage from './pages/hotel-manager/RoomsManagementPage'
import HotelDetailPage from './pages/hotels/HotelDetailPage'
import RoomSelectionPage from './pages/hotels/RoomSelectionPage'
import { ProtectedRoute, AdminRoute } from './context/AuthContext'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
                      <Route path="hotels" element={<HotelsManagementPage />} />
                      <Route path="hotels/:hotelId/rooms" element={<AdminRoomsManagementPage />} />
                    </Routes>
                  </AdminLayout>
                </AdminRoute>
              }
            />

            {/* Hotel Manager Routes */}
            <Route
              path="/hotel-manager/*"
              element={
                <ProtectedRoute>
                  <HotelManagerLayout>
                    <Routes>
                      <Route index element={<HotelManagerDashboardPage />} />
                      <Route path="hotels" element={<HotelManagerHotelsPage />} />
                      <Route path="hotels/:hotelId/rooms" element={<HotelManagerRoomsPage />} />
                    </Routes>
                  </HotelManagerLayout>
                </ProtectedRoute>
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
              path="/hotels/:id"
              element={
                <>
                  <Navbar />
                  <main className="flex-1">
                    <HotelDetailPage />
                  </main>
                  <Footer />
                </>
              }
            />
            <Route
              path="/hotels/:hotelId/rooms"
              element={
                <>
                  <Navbar />
                  <main className="flex-1">
                    <RoomSelectionPage />
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
    </QueryClientProvider>
  )
}

export default App
