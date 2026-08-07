import { useState, useEffect } from 'react'
import apiClient from '../../services/apiClient'
import Skeleton from '../../components/ui/Skeleton'

export default function HotelManagerDashboardPage() {
  const [stats, setStats] = useState(null)
  const [bookings, setBookings] = useState([])
  const [bookingStats, setBookingStats] = useState({ pending: 0, confirmed: 0, completed: 0, total: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchStats()
    fetchRecentBookings()
  }, [])

  const fetchStats = async () => {
    try {
      // GET /api/v1/hotel-manager/manage-hotel - returns paginated hotels
      const res = await apiClient.get('/hotel-manager/manage-hotel')
      const hotels = res.data.data || []

      const totalRooms = hotels.reduce((sum, hotel) => sum + (hotel.rooms_count || 0), 0)
      const avgRating = hotels.length > 0
        ? (hotels.reduce((sum, hotel) => sum + (hotel.average_rating || 0), 0) / hotels.length).toFixed(1)
        : '0.0'

      setStats({
        total_hotels: hotels.length,
        total_rooms: totalRooms,
        avg_rating: avgRating,
        hotels,
      })
    } catch (err) {
      console.error('Stats error:', err)
      setError(err.message || 'Failed to load dashboard stats.')
    } finally {
      setLoading(false)
    }
  }

  const fetchRecentBookings = async () => {
    try {
      // GET /api/v1/hotel-bookings - returns bookings for manager's hotels
      const res = await apiClient.get('/hotel-bookings')
      const allBookings = res.data.data || []

      const pending = allBookings.filter(b => b.status === 'Pending').length
      const confirmed = allBookings.filter(b => b.status === 'Confirmed').length
      const completed = allBookings.filter(b => b.status === 'Completed').length

      setBookings(allBookings.slice(0, 5))
      setBookingStats({ pending, confirmed, completed, total: allBookings.length })
    } catch (err) {
      console.error('Bookings error:', err)
    }
  }

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
    { label: 'My Hotels', value: stats?.total_hotels || 0, icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', color: 'text-amber-600', bg: 'bg-amber-100' },
    { label: 'Total Rooms', value: stats?.total_rooms || 0, icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z', color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Avg Rating', value: stats?.avg_rating || '0.0', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z', color: 'text-amber-600', bg: 'bg-amber-100' },
    { label: 'Pending Bookings', value: bookingStats.pending, icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { label: 'Confirmed', value: bookingStats.confirmed, icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Completed', value: bookingStats.completed, icon: 'M5 13l4 4L19 7', color: 'text-blue-600', bg: 'bg-blue-100' },
  ]

  const getStatusBadge = (status) => {
    const styles = {
      Pending: 'bg-yellow-100 text-yellow-700',
      Confirmed: 'bg-green-100 text-green-700',
      Completed: 'bg-blue-100 text-blue-700',
      Cancelled: 'bg-red-100 text-red-700',
    }
    return styles[status] || 'bg-slate-100 text-slate-700'
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
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
        {/* My Hotels */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">My Hotels</h2>
            <a href="/hotel-manager/hotels" className="text-sm text-amber-600 hover:text-amber-700 font-medium">
              View All
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-slate-500 border-b border-slate-100">
                  <th className="px-6 py-3 font-medium">Hotel Name</th>
                  <th className="px-6 py-3 font-medium">Stars</th>
                  <th className="px-6 py-3 font-medium">Rooms</th>
                </tr>
              </thead>
              <tbody>
                {stats?.hotels?.length > 0 ? (
                  stats.hotels.slice(0, 5).map((hotel, index) => (
                    <tr key={hotel.id || hotel.hotel_id} className={`border-b border-slate-50 ${index % 2 === 0 ? 'bg-slate-50/50' : ''}`}>
                      <td className="px-6 py-4 text-sm font-medium text-slate-800">{hotel.name}</td>
                      <td className="px-6 py-4">
                        <span className="text-amber-500">{'★'.repeat(hotel.stars || 0)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-sm font-medium">
                          {hotel.rooms_count || 0}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-8 text-center text-slate-500">No hotels yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">Recent Bookings</h2>
            <a href="/hotel-manager/bookings" className="text-sm text-amber-600 hover:text-amber-700 font-medium">
              View All
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-slate-500 border-b border-slate-100">
                  <th className="px-6 py-3 font-medium">Guest</th>
                  <th className="px-6 py-3 font-medium">Hotel</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length > 0 ? (
                  bookings.map((booking, index) => (
                    <tr key={booking.id} className={`border-b border-slate-50 ${index % 2 === 0 ? 'bg-slate-50/50' : ''}`}>
                      <td className="px-6 py-4 text-sm font-medium text-slate-800">{booking.user?.first_name || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{booking.room?.hotel?.name || '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-sm font-medium ${getStatusBadge(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
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
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <a href="/hotel-manager/hotels" className="px-4 py-2 border-2 border-amber-600 text-amber-600 rounded-lg hover:bg-amber-50 transition-colors font-medium text-sm">
            Manage Hotels
          </a>
          <a href="/hotel-manager/bookings" className="px-4 py-2 border-2 border-amber-600 text-amber-600 rounded-lg hover:bg-amber-50 transition-colors font-medium text-sm">
            View Bookings
          </a>
        </div>
      </div>
    </div>
  )
}
