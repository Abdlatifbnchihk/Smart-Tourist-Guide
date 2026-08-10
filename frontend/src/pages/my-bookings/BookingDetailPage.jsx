import { useState } from 'react'
import { useParams, Link, useSearchParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMyBookingDetail, cancelMyHotelBooking, cancelMyTransportBooking } from '../../services/bookingService'
import Skeleton from '../../components/ui/Skeleton'

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Confirmed: 'bg-blue-100 text-blue-800',
  InProgress: 'bg-indigo-100 text-indigo-800',
  Completed: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
}

export default function BookingDetailPage() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const bookingType = searchParams.get('type')
  const queryClient = useQueryClient()
  const [showCancelModal, setShowCancelModal] = useState(false)

  const { data: response, isLoading, error } = useQuery({
    queryKey: ['my-booking-detail', id, bookingType],
    queryFn: () => getMyBookingDetail(id, bookingType),
  })

  const booking = response?.data

  const cancelMutation = useMutation({
    mutationFn: () => {
      if (booking?.booking_type === 'Hotel + Driver' || booking?.booking_type === 'Airport Transfer' || bookingType === 'transport') {
        return cancelMyTransportBooking(id)
      }
      return cancelMyHotelBooking(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['my-booking-detail', id])
      queryClient.invalidateQueries(['my-hotel-bookings'])
      queryClient.invalidateQueries(['my-transport-bookings'])
      setShowCancelModal(false)
    },
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Booking not found</h2>
        <p className="text-slate-500 mb-4">The booking you're looking for doesn't exist or you don't have access.</p>
        <Link to="/my-bookings/hotel" className="text-teal-600 hover:text-teal-700 font-medium">
          Back to My Bookings
        </Link>
      </div>
    )
  }

  const canCancel = booking.status === 'Pending' || booking.status === 'Confirmed'

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          to={booking.booking_type === 'Hotel + Driver' || booking.booking_type === 'Airport Transfer' || bookingType === 'transport' ? '/my-bookings/transport' : '/my-bookings/hotel'}
          className="text-slate-400 hover:text-slate-600"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Booking {booking.booking_number}</h2>
          <p className="text-slate-500 mt-1">{booking.booking_type} Booking</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-500">Status</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-1 ${statusColors[booking.status] || 'bg-slate-100 text-slate-800'}`}>
                {booking.status}
              </span>
            </div>
            <div>
              <p className="text-sm text-slate-500">Booking Date</p>
              <p className="font-medium text-slate-800">{new Date(booking.booking_date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Dates</p>
              <p className="font-medium text-slate-800">
                {new Date(booking.start_date).toLocaleDateString()} to {new Date(booking.end_date).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Price</p>
              <p className="text-xl font-bold text-teal-600">${booking.total_price}</p>
            </div>
          </div>

          <div className="space-y-4">
            {booking.booking_type === 'Hotel' ? (
              <>
                <div>
                  <p className="text-sm text-slate-500">Hotel</p>
                  <p className="font-medium text-slate-800">{booking.room?.hotel?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Room</p>
                  <p className="font-medium text-slate-800">{booking.room?.number || 'N/A'} ({booking.room?.type || 'N/A'})</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Address</p>
                  <p className="font-medium text-slate-800">{booking.room?.hotel?.address || 'N/A'}</p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className="text-sm text-slate-500">Driver</p>
                  <p className="font-medium text-slate-800">
                    {booking.driver?.user ? `${booking.driver.user.first_name} ${booking.driver.user.last_name}` : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Booking Type</p>
                  <p className="font-medium text-slate-800">{booking.booking_type}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Distance</p>
                  <p className="font-medium text-slate-800">{booking.distance_km} km</p>
                </div>
              </>
            )}
          </div>
        </div>

        {canCancel && (
          <div className="mt-6 pt-6 border-t border-slate-100">
            <button
              onClick={() => setShowCancelModal(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
            >
              Cancel Booking
            </button>
          </div>
        )}
      </div>

      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Cancel Booking</h3>
            <p className="text-slate-600 mb-6">Are you sure you want to cancel this booking? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium"
              >
                Keep Booking
              </button>
              <button
                onClick={() => cancelMutation.mutate()}
                disabled={cancelMutation.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50"
              >
                {cancelMutation.isPending ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
