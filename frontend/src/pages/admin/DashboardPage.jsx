import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import apiClient from '../../services/apiClient'
import { getAllHotelBookings, getAllTransportBookings } from '../../services/bookingService'
import Skeleton from '../../components/ui/Skeleton'

const statusColors = {
  Pending: 'bg-amber-100 text-amber-700',
  Confirmed: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
  InProgress: 'bg-blue-100 text-blue-700',
  Completed: 'bg-green-100 text-green-700',
}

const roleColors = {
  tourist: 'bg-blue-100 text-blue-700',
  driver: 'bg-purple-100 text-purple-700',
  hotel_manager: 'bg-amber-100 text-amber-700',
  administrator: 'bg-teal-100 text-teal-700',
}

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const { data: hotelBookingsResponse } = useQuery({
    queryKey: ['admin-hotel-bookings'],
    queryFn: () => getAllHotelBookings(),
  })

  const { data: transportBookingsResponse } = useQuery({
    queryKey: ['admin-transport-bookings'],
    queryFn: () => getAllTransportBookings(),
  })

  // Laravel paginated response: { data: { data: [...bookings], meta: {...} } }
  const hotelBookings = hotelBookingsResponse?.data?.data || hotelBookingsResponse?.data || []
  const transportBookings = transportBookingsResponse?.data?.data || transportBookingsResponse?.data || []
  const allBookings = [...hotelBookings, ...transportBookings]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await apiClient.get('/admin/stats')
        setStats(res.data.data)
      } catch (err) {
        console.error('Stats error:', err)
        setError(err.message || 'Failed to load dashboard stats.')
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-80 rounded-xl lg:col-span-2" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
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

  const totalBookings = hotelBookings.length + transportBookings.length
  const pendingBookings = allBookings.filter(b => b.status === 'Pending').length

  const statCards = [
    { label: 'Total Users', value: stats?.total_users || 0, icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', color: 'text-teal-600', bg: 'bg-teal-100' },
    { label: 'Total Cities', value: stats?.total_cities || 0, icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z', color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Total Hotels', value: stats?.total_hotels || 0, icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', color: 'text-amber-600', bg: 'bg-amber-100' },
    { label: 'Total Bookings', value: totalBookings, icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Pending Bookings', value: pendingBookings, icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-amber-600', bg: 'bg-amber-100' },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">Recent Bookings</h2>
            <a href="/admin/bookings" className="text-sm text-teal-600 hover:text-teal-700 font-medium">
              View All
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-slate-500 border-b border-slate-100">
                  <th className="px-6 py-3 font-medium">Booking #</th>
                  <th className="px-6 py-3 font-medium">Tourist</th>
                  <th className="px-6 py-3 font-medium">Type</th>
                  <th className="px-6 py-3 font-medium">Dates</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {allBookings.length > 0 ? (
                  allBookings.map((booking, index) => (
                    <tr key={booking.id} className={`border-b border-slate-50 ${index % 2 === 0 ? 'bg-slate-50/50' : ''}`}>
                      <td className="px-6 py-4 text-sm font-medium text-slate-800">{booking.booking_number}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{booking.user?.name || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${
                          booking.booking_type === 'Hotel' || booking.room ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                        }`}>
                          {booking.room ? 'Hotel' : booking.booking_type || 'Transport'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {booking.start_date} - {booking.end_date}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-full ${statusColors[booking.status] || 'bg-slate-100 text-slate-700'}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-800">${booking.total_price}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-slate-500">No bookings yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">Recent Users</h2>
            <a href="/admin/users" className="text-sm text-teal-600 hover:text-teal-700 font-medium">
              Manage Users
            </a>
          </div>
          <div className="p-4">
            {stats?.recent_users?.length > 0 ? (
              <ul className="space-y-3">
                {stats.recent_users.map((user) => (
                  <li key={user.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-teal-600">
                        {user.first_name?.[0]}{user.last_name?.[0]}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${roleColors[user.role] || 'bg-slate-100 text-slate-700'}`}>
                      {user.role?.replace('_', ' ')}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-slate-500 py-8">No users yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Booking Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-sm font-medium text-slate-500 mb-2">Hotel Bookings</h3>
          <p className="text-3xl font-bold text-slate-800">{hotelBookings.length}</p>
          <div className="mt-2 flex gap-2">
            <span className="text-xs text-amber-600">{hotelBookings.filter(b => b.status === 'Pending').length} pending</span>
            <span className="text-xs text-green-600">{hotelBookings.filter(b => b.status === 'Confirmed').length} confirmed</span>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-sm font-medium text-slate-500 mb-2">Transport Bookings</h3>
          <p className="text-3xl font-bold text-slate-800">{transportBookings.length}</p>
          <div className="mt-2 flex gap-2">
            <span className="text-xs text-amber-600">{transportBookings.filter(b => b.status === 'Pending').length} pending</span>
            <span className="text-xs text-green-600">{transportBookings.filter(b => b.status === 'Confirmed').length} confirmed</span>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-sm font-medium text-slate-500 mb-2">Booking Revenue</h3>
          <p className="text-3xl font-bold text-slate-800">
            ${allBookings.reduce((sum, b) => sum + parseFloat(b.total_price || 0), 0).toFixed(2)}
          </p>
          <div className="mt-2">
            <span className="text-xs text-green-600">{allBookings.filter(b => b.status === 'Completed').length} completed</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <a href="/admin/bookings" className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium text-sm">
            Manage Bookings
          </a>
          <a href="/admin/cities" className="px-4 py-2 border-2 border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 transition-colors font-medium text-sm">
            Add New City
          </a>
          <a href="/admin/hotels" className="px-4 py-2 border-2 border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 transition-colors font-medium text-sm">
            Add New Hotel
          </a>
          <a href="/admin/attractions" className="px-4 py-2 border-2 border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 transition-colors font-medium text-sm">
            Manage Attractions
          </a>
        </div>
      </div>
    </div>
  )
}
