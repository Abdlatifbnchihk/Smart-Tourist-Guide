import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getDriverBooking, updateBookingStatus, cancelBooking } from '../../services/driverService'
import Skeleton from '../../components/ui/Skeleton'

const statusActions = {
  Pending: [
    { label: 'Confirm', status: 'confirmed', color: 'bg-green-600 hover:bg-green-700' },
    { label: 'Cancel', status: 'cancelled', color: 'bg-red-600 hover:bg-red-700' },
  ],
  Confirmed: [
    { label: 'Start Trip', status: 'in_progress', color: 'bg-purple-600 hover:bg-purple-700' },
    { label: 'Cancel', status: 'cancelled', color: 'bg-red-600 hover:bg-red-700' },
  ],
  InProgress: [
    { label: 'Complete', status: 'completed', color: 'bg-blue-600 hover:bg-blue-700' },
  ],
}

const statusStyles = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Confirmed: 'bg-green-100 text-green-700',
  InProgress: 'bg-purple-100 text-purple-700',
  Completed: 'bg-blue-100 text-blue-700',
  Cancelled: 'bg-red-100 text-red-700 line-through',
}

export default function BookingDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionLoading, setActionLoading] = useState(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [pendingStatus, setPendingStatus] = useState(null)

  useEffect(() => {
    fetchBooking()
  }, [id])

  const fetchBooking = async () => {
    try {
      const res = await getDriverBooking(id)
      setBooking(res.data || res)
    } catch (err) {
      console.error('Failed to load booking:', err)
      setError('Failed to load booking details.')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusClick = (newStatus) => {
    setPendingStatus(newStatus)
    setShowConfirmModal(true)
  }

  const handleStatusUpdate = async () => {
    if (!pendingStatus) return
    setActionLoading(pendingStatus)

    try {
      if (pendingStatus === 'cancelled') {
        await cancelBooking(booking.id)
      } else {
        await updateBookingStatus(booking.id, pendingStatus)
      }
      const statusMap = { confirmed: 'Confirmed', in_progress: 'InProgress', completed: 'Completed', cancelled: 'Cancelled' }
      setBooking({ ...booking, status: statusMap[pendingStatus] || pendingStatus })
      setShowConfirmModal(false)
      setPendingStatus(null)
    } catch (err) {
      console.error('Status update failed:', err)
      setError(err.response?.data?.message || 'Failed to update booking status.')
    } finally {
      setActionLoading(null)
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-48 rounded-lg" />
        <Skeleton className="h-80 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-red-600 mb-4">{error}</p>
        <Link to="/driver/bookings" className="text-blue-600 hover:text-blue-700 font-medium">
          &larr; Back to Bookings
        </Link>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-600 mb-4">Booking not found.</p>
        <Link to="/driver/bookings" className="text-blue-600 hover:text-blue-700 font-medium">
          &larr; Back to Bookings
        </Link>
      </div>
    )
  }

  const actions = statusActions[booking.status] || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link to="/driver/bookings" className="text-sm text-blue-600 hover:text-blue-700 mb-2 inline-block">
            &larr; Back to Bookings
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">Booking #{booking.booking_number || booking.id}</h1>
          <span className={`inline-block px-3 py-1 rounded text-sm font-medium mt-2 ${statusStyles[booking.status] || 'bg-slate-100 text-slate-700'}`}>
            {booking.status}
          </span>
        </div>
        {actions.length > 0 && (
          <div className="flex gap-3">
            {actions.map((action) => (
              <button
                key={action.status}
                onClick={() => handleStatusClick(action.status)}
                disabled={actionLoading !== null}
                className={`px-4 py-2 text-white rounded-lg transition-colors font-medium disabled:opacity-50 ${action.color}`}
              >
                {actionLoading === action.status ? 'Processing...' : action.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trip Information */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Trip Information</h2>
          <div className="space-y-4">
            <div className="flex justify-between border-b border-slate-100 pb-3">
              <span className="text-slate-500">Pickup Location</span>
              <span className="font-medium text-slate-800">{booking.pickup_location || '-'}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-3">
              <span className="text-slate-500">Dropoff Location</span>
              <span className="font-medium text-slate-800">{booking.dropoff_location || '-'}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-3">
              <span className="text-slate-500">Start Date</span>
              <span className="font-medium text-slate-800">{formatDate(booking.start_date)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Passengers</span>
              <span className="font-medium text-slate-800">{booking.passengers || '-'}</span>
            </div>
          </div>
        </div>

        {/* Guest Information */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Guest Information</h2>
          <div className="space-y-4">
            <div className="flex justify-between border-b border-slate-100 pb-3">
              <span className="text-slate-500">Name</span>
              <span className="font-medium text-slate-800">{booking.user?.first_name} {booking.user?.last_name}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-3">
              <span className="text-slate-500">Email</span>
              <span className="font-medium text-slate-800">{booking.user?.email || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Phone</span>
              <span className="font-medium text-slate-800">{booking.user?.phone || '-'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle & Payment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Vehicle Information</h2>
          <div className="space-y-4">
            <div className="flex justify-between border-b border-slate-100 pb-3">
              <span className="text-slate-500">Vehicle</span>
              <span className="font-medium text-slate-800">
                {booking.vehicle ? `${booking.vehicle.brand} ${booking.vehicle.model}` : '-'}
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-3">
              <span className="text-slate-500">Registration</span>
              <span className="font-medium text-slate-800 font-mono">{booking.vehicle?.registration_number || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Type</span>
              <span className="font-medium text-slate-800 capitalize">{booking.vehicle?.type || '-'}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Payment Details</h2>
          <div className="space-y-4">
            <div className="flex justify-between border-b border-slate-100 pb-3">
              <span className="text-slate-500">Total Price</span>
              <span className="font-bold text-green-600 text-lg">${booking.total_price || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Payment Status</span>
              <span className="font-medium text-slate-800">{booking.payment_status || '-'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {booking.notes && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Notes</h2>
          <p className="text-slate-600">{booking.notes}</p>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-800">Confirm Status Change</h2>
            </div>
            <div className="p-6">
              <p className="text-slate-600">
                Are you sure you want to change the booking status to{' '}
                <span className="font-semibold">{pendingStatus}</span>?
              </p>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => { setShowConfirmModal(false); setPendingStatus(null) }}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                disabled={actionLoading !== null}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
              >
                {actionLoading ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
