import { useState, useEffect } from 'react'
import apiClient, { extractData } from '../../services/apiClient'
import Skeleton from '../../components/ui/Skeleton'

export default function BookingsManagementPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [updatingId, setUpdatingId] = useState(null)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancellingBooking, setCancellingBooking] = useState(null)

  useEffect(() => {
    fetchBookings()
  }, [statusFilter])

  const fetchBookings = async () => {
    setLoading(true)
    try {
      // GET /api/v1/hotel-bookings - returns bookings for manager's hotels
      const params = statusFilter !== 'all' ? `?status=${statusFilter}` : ''
      const res = await apiClient.get(`/hotel-bookings${params}`)
      setBookings(extractData(res))
    } catch (err) {
      setError('Failed to load bookings.')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (bookingId, newStatus) => {
    setUpdatingId(bookingId)
    try {
      // PATCH /api/v1/hotel-bookings/{booking}/status - can only confirm or complete
      await apiClient.patch(`/hotel-bookings/${bookingId}/status`, { status: newStatus })
      fetchBookings()
    } catch (err) {
      setError('Failed to update booking status.')
    } finally {
      setUpdatingId(null)
    }
  }

  const openCancelModal = (booking) => {
    setCancellingBooking(booking)
    setShowCancelModal(true)
  }

  const handleCancel = async () => {
    if (!cancellingBooking) return
    setUpdatingId(cancellingBooking.id)
    try {
      // PATCH /api/v1/hotel-bookings/{booking}/cancel
      await apiClient.patch(`/hotel-bookings/${cancellingBooking.id}/cancel`)
      setShowCancelModal(false)
      setCancellingBooking(null)
      fetchBookings()
    } catch (err) {
      setError('Failed to cancel booking.')
    } finally {
      setUpdatingId(null)
    }
  }

  const getStatusBadge = (status) => {
    const styles = {
      Pending: 'bg-yellow-100 text-yellow-700',
      Confirmed: 'bg-green-100 text-green-700',
      Completed: 'bg-blue-100 text-blue-700',
      Cancelled: 'bg-red-100 text-red-700 line-through',
    }
    return styles[status] || 'bg-slate-100 text-slate-700'
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (loading && bookings.length === 0) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 rounded-xl" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Bookings</h2>
          <p className="text-slate-500 mt-1">Manage your hotel bookings</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
          <button onClick={() => setError(null)} className="ml-2 underline">Dismiss</button>
        </div>
      )}

      {/* Status Filter */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-slate-700">Filter by status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">All Bookings</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-slate-500 border-b border-slate-100 bg-slate-50">
              <th className="px-6 py-3 font-medium">Guest</th>
              <th className="px-6 py-3 font-medium">Hotel</th>
              <th className="px-6 py-3 font-medium">Room</th>
              <th className="px-6 py-3 font-medium">Check-in</th>
              <th className="px-6 py-3 font-medium">Check-out</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-slate-500">
                  No bookings found
                </td>
              </tr>
            ) : (
              bookings.map((booking, index) => (
                <tr key={booking.id} className={`border-b border-slate-50 ${index % 2 === 0 ? '' : 'bg-slate-50/50'}`}>
                  <td className="px-6 py-4">
                    <span className="font-medium text-slate-800">{booking.user?.first_name || 'N/A'}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{booking.room?.hotel?.name || '-'}</td>
                  <td className="px-6 py-4 text-slate-600">{booking.room?.number || '-'}</td>
                  <td className="px-6 py-4 text-slate-600">{formatDate(booking.start_date)}</td>
                  <td className="px-6 py-4 text-slate-600">{formatDate(booking.end_date)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-0.5 rounded text-sm font-medium ${getStatusBadge(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {booking.status === 'Pending' && (
                      <button
                        onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                        disabled={updatingId === booking.id}
                        className="text-green-600 hover:text-green-700 font-medium text-sm mr-3 disabled:opacity-50"
                      >
                        Confirm
                      </button>
                    )}
                    {booking.status === 'Confirmed' && (
                      <button
                        onClick={() => handleStatusUpdate(booking.id, 'completed')}
                        disabled={updatingId === booking.id}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm mr-3 disabled:opacity-50"
                      >
                        Complete
                      </button>
                    )}
                    {booking.status !== 'Cancelled' && booking.status !== 'Completed' && (
                      <button
                        onClick={() => openCancelModal(booking)}
                        disabled={updatingId === booking.id}
                        className="text-red-600 hover:text-red-700 font-medium text-sm disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Cancel Booking</h3>
              <p className="text-slate-500 mb-6">
                Are you sure you want to cancel this booking for <strong>{cancellingBooking?.user?.first_name}</strong>?
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors font-medium"
                >
                  No, keep it
                </button>
                <button
                  onClick={handleCancel}
                  disabled={updatingId === cancellingBooking?.id}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
                >
                  {updatingId === cancellingBooking?.id ? 'Cancelling...' : 'Yes, cancel'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
