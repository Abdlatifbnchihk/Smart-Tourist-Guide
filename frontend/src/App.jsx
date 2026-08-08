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
import AttractionsManagementPage from './pages/admin/AttractionsManagementPage'
import BookingsManagementPage from './pages/admin/BookingsManagementPage'
import UsersManagementPage from './pages/admin/UsersManagementPage'
import HotelManagerDashboardPage from './pages/hotel-manager/HotelManagerDashboardPage'
import HotelManagerHotelsPage from './pages/hotel-manager/HotelsManagementPage'
import HotelManagerRoomsPage from './pages/hotel-manager/RoomsManagementPage'
import HotelManagerAllRoomsPage from './pages/hotel-manager/AllRoomsPage'
import HotelManagerBookingsPage from './pages/hotel-manager/BookingsManagementPage'
import HotelManagerDeletedPage from './pages/hotel-manager/DeletedItemsPage'
import HotelDetailPage from './pages/hotels/HotelDetailPage'
import RoomSelectionPage from './pages/hotels/RoomSelectionPage'
import AttractionDetailPage from './pages/attractions/AttractionDetailPage'
import HotelBookingCheckout from './pages/booking/HotelBookingCheckout'
import TransportBookingCheckout from './pages/booking/TransportBookingCheckout'
import MyHotelBookingsPage from './pages/my-bookings/MyHotelBookingsPage'
import MyTransportBookingsPage from './pages/my-bookings/MyTransportBookingsPage'
import BookingDetailPage from './pages/my-bookings/BookingDetailPage'
import FavoritesPage from './pages/favorites/FavoritesPage'
import MyReviewsPage from './pages/my-reviews/MyReviewsPage'
import { ProtectedRoute, AdminRoute } from './context/AuthContext'
import DriverLayout from './components/driver/DriverLayout'
import { DriverProvider } from './context/DriverContext'
import DriverDashboardPage from './pages/driver/DriverDashboardPage'
import DriverVehiclesPage from './pages/driver/VehiclesManagementPage'
import DriverBookingsPage from './pages/driver/BookingsManagementPage'
import DriverBookingDetailPage from './pages/driver/BookingDetailPage'
import DriverProfilePage from './pages/driver/DriverProfilePage'

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
                      <Route path="attractions" element={<AttractionsManagementPage />} />
                      <Route path="bookings" element={<BookingsManagementPage />} />
                      <Route path="users" element={<UsersManagementPage />} />
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
                      <Route path="rooms" element={<HotelManagerAllRoomsPage />} />
                      <Route path="bookings" element={<HotelManagerBookingsPage />} />
                      <Route path="deleted" element={<HotelManagerDeletedPage />} />
                    </Routes>
                  </HotelManagerLayout>
                </ProtectedRoute>
              }
            />

            {/* Driver Routes */}
            <Route
              path="/driver/*"
              element={
                <ProtectedRoute>
                  <DriverProvider>
                    <DriverLayout>
                      <Routes>
                        <Route index element={<DriverDashboardPage />} />
                        <Route path="vehicles" element={<DriverVehiclesPage />} />
                        <Route path="bookings" element={<DriverBookingsPage />} />
                        <Route path="bookings/:id" element={<DriverBookingDetailPage />} />
                        <Route path="profile" element={<DriverProfilePage />} />
                      </Routes>
                    </DriverLayout>
                  </DriverProvider>
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
              path="/attractions/:id"
              element={
                <>
                  <Navbar />
                  <main className="flex-1">
                    <ProtectedRoute>
                      <AttractionDetailPage />
                    </ProtectedRoute>
                  </main>
                  <Footer />
                </>
              }
            />
            <Route
              path="/booking/hotel"
              element={
                <>
                  <Navbar />
                  <main className="flex-1">
                    <ProtectedRoute>
                      <HotelBookingCheckout />
                    </ProtectedRoute>
                  </main>
                  <Footer />
                </>
              }
            />
            <Route
              path="/booking/transport"
              element={
                <>
                  <Navbar />
                  <main className="flex-1">
                    <ProtectedRoute>
                      <TransportBookingCheckout />
                    </ProtectedRoute>
                  </main>
                  <Footer />
                </>
              }
            />
            <Route
              path="/my-bookings/hotel"
              element={
                <>
                  <Navbar />
                  <main className="flex-1">
                    <ProtectedRoute>
                      <MyHotelBookingsPage />
                    </ProtectedRoute>
                  </main>
                  <Footer />
                </>
              }
            />
            <Route
              path="/my-bookings/transport"
              element={
                <>
                  <Navbar />
                  <main className="flex-1">
                    <ProtectedRoute>
                      <MyTransportBookingsPage />
                    </ProtectedRoute>
                  </main>
                  <Footer />
                </>
              }
            />
            <Route
              path="/my-bookings/:id"
              element={
                <>
                  <Navbar />
                  <main className="flex-1">
                    <ProtectedRoute>
                      <BookingDetailPage />
                    </ProtectedRoute>
                  </main>
                  <Footer />
                </>
              }
            />
            <Route
              path="/favorites"
              element={
                <>
                  <Navbar />
                  <main className="flex-1">
                    <ProtectedRoute>
                      <FavoritesPage />
                    </ProtectedRoute>
                  </main>
                  <Footer />
                </>
              }
            />
            <Route
              path="/my-reviews"
              element={
                <>
                  <Navbar />
                  <main className="flex-1">
                    <ProtectedRoute>
                      <MyReviewsPage />
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
    </QueryClientProvider>
  )
}

export default App
