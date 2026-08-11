import { useState, useEffect } from 'react'
import { useDriver } from '../../context/DriverContext'
import { getDriverVehicles, getDriverBookings } from '../../services/driverService'
import Skeleton from '../../components/ui/Skeleton'

export default function DriverDashboardPage() {
  const { driver, loading: driverLoading, fetchDriverProfile } = useDriver()
  const [vehicles, setVehicles] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (driver?.id) {
      fetchDriverProfile()
      fetchData()
    } else if (!driverLoading) {
      setLoading(false)
    }
  }, [driver?.id])

  const fetchData = async () => {
    try {
      const [vehiclesRes, bookingsRes] = await Promise.all([
        getDriverVehicles(driver.id),
        getDriverBookings(),
      ])
      setVehicles(vehiclesRes.data || [])
      setBookings(Array.isArray(bookingsRes) ? bookingsRes : bookingsRes.data || [])
    } catch (err) {
      console.error('Dashboard error:', err)
      setError('Failed to load dashboard data.')
    } finally {
      setLoading(false)
    }
  }

  const pendingBookings = bookings.filter(b => b.status === 'Pending').length
  const confirmedBookings = bookings.filter(b => b.status === 'Confirmed').length
  const inProgressBookings = bookings.filter(b => b.status === 'InProgress').length
  const completedBookings = bookings.filter(b => b.status === 'Completed').length

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-80 rounded-xl" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  const statCards = [
    { label: 'My Vehicles', value: vehicles.length, icon: 'M8 7h8m-8 4h8M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z', color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Total Bookings', value: bookings.length, icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', color: 'text-slate-600', bg: 'bg-slate-100' },
    { label: 'Pending', value: pendingBookings, icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { label: 'In Progress', value: inProgressBookings, icon: 'M13 10V3L4 14h7v7l9-11h-7z', color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Completed', value: completedBookings, icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Rating', value: driver?.rating || '0.0', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z', color: 'text-amber-600', bg: 'bg-amber-100' },
  ]

  const getStatusBadge = (status) => {
    const styles = {
      Pending: 'bg-yellow-100 text-yellow-700',
      Confirmed: 'bg-green-100 text-green-700',
      InProgress: 'bg-purple-100 text-purple-700',
      Completed: 'bg-blue-100 text-blue-700',
      Cancelled: 'bg-red-100 text-red-700 line-through',
    }
    return styles[status] || 'bg-slate-100 text-slate-700'
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="space-y-6">
      {/* Verification Status */}
      {driver && !driver.is_verified && driver.is_verified !== 1 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3">
          <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="text-sm text-yellow-800">Your account is pending verification. You can still use the dashboard.</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${card.bg} rounded-lg flex items-center justify-center`}>
                <svg className={`w-6 h-6 ${card.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
                </svg>
              </div>
            </div>
            <p className="text-sm text-slate-500 mb-1">{card.label}</p>
            <p className="text-3xl font-bold text-slate-800">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">Recent Bookings</h2>
            <a href="/driver/bookings" className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-slate-500 border-b border-slate-100">
                  <th className="px-6 py-3 font-medium">Guest</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length > 0 ? (
                  bookings.slice(0, 5).map((booking, index) => (
                    <tr key={booking.id} className={`border-b border-slate-50 ${index % 2 === 0 ? 'bg-slate-50/50' : ''}`}>
                      <td className="px-6 py-4 text-sm font-medium text-slate-800">{booking.user?.first_name || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-sm font-medium ${getStatusBadge(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{formatDate(booking.start_date)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-8 text-center text-slate-500">No bookings yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* My Vehicles */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">My Vehicles</h2>
            <a href="/driver/vehicles" className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-slate-500 border-b border-slate-100">
                  <th className="px-6 py-3 font-medium">Vehicle</th>
                  <th className="px-6 py-3 font-medium">Type</th>
                  <th className="px-6 py-3 font-medium">Seats</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.length > 0 ? (
                  vehicles.slice(0, 5).map((vehicle, index) => (
                    <tr key={vehicle.vehicle_id} className={`border-b border-slate-50 ${index % 2 === 0 ? 'bg-slate-50/50' : ''}`}>
                      <td className="px-6 py-4 text-sm font-medium text-slate-800">{vehicle.brand} {vehicle.model}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 capitalize">{vehicle.type}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{vehicle.seats}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-8 text-center text-slate-500">No vehicles yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <a href="/driver/vehicles" className="px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium text-sm">
            Manage Vehicles
          </a>
          <a href="/driver/bookings" className="px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium text-sm">
            View Bookings
          </a>
          <a href="/driver/profile" className="px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium text-sm">
            Edit Profile
          </a>
        </div>
      </div>
    </div>
  )
}
