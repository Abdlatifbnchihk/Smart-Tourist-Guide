import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDriver } from '../../context/DriverContext'
import { getDriverBookings } from '../../services/driverService'
import Skeleton from '../../components/ui/Skeleton'

const statusFilters = ['All', 'Pending', 'Confirmed', 'InProgress', 'Completed', 'Cancelled']

export default function BookingsManagementPage() {
  const { driver } = useDriver()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statusFilter, setStatusFilter] = useState('All')

  useEffect(() => {
    fetchBookings()
  }, [statusFilter])

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const res = await getDriverBookings(statusFilter)
      setBookings(Array.isArray(res) ? res : res.data || [])
    } catch (err) {
      console.error('Failed to load bookings:', err)
      setError('Failed to load bookings.')
    } finally {
      setLoading(false)
    }
  }

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
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-48 rounded-lg" />
        <Skeleton className="h-12 rounded-lg" />
        <Skeleton className="h-96 rounded-xl" />
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Bookings</h1>
          <p className="text-slate-500">View and manage your transport bookings</p>
        </div>
      </div>

      {/* Status Filter */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-slate-600">Filter:</span>
          {statusFilters.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-slate-500 border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-4 font-medium">Booking #</th>
                <th className="px-6 py-4 font-medium">Guest</th>
                <th className="px-6 py-4 font-medium">Pickup</th>
                <th className="px-6 py-4 font-medium">Dropoff</th>
                <th className="px-6 py-4 font-medium">Start Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length > 0 ? (
                bookings.map((booking, index) => (
                  <tr key={booking.id} className={`border-b border-slate-50 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} hover:bg-blue-50/30 transition-colors`}>
                    <td className="px-6 py-4 text-sm font-medium text-blue-600">
                      <Link to={`/driver/bookings/${booking.id}`} className="hover:underline">
                        #{booking.booking_number || booking.id}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-800">{booking.user?.first_name} {booking.user?.last_name}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{booking.pickup_location || '-'}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{booking.dropoff_location || '-'}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{formatDate(booking.start_date)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getStatusBadge(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/driver/bookings/${booking.id}`}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <p className="font-medium">No bookings found</p>
                      <p className="text-sm">No bookings match the current filter.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
