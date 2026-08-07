import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMyTransportBookings, cancelMyTransportBooking } from '../../services/bookingService'
import Skeleton from '../../components/ui/Skeleton'

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Confirmed: 'bg-blue-100 text-blue-800',
  InProgress: 'bg-indigo-100 text-indigo-800',
  Completed: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
}

export default function MyTransportBookingsPage() {
  const queryClient = useQueryClient()
  const [cancelId, setCancelId] = useState(null)

  const { data: response, isLoading } = useQuery({
    queryKey: ['my-transport-bookings'],
    queryFn: getMyTransportBookings,
  })

  const bookings = response?.data?.data || response?.data || []

  const cancelMutation = useMutation({
    mutationFn: cancelMyTransportBooking,
    onSuccess: () => {
      queryClient.invalidateQueries(['my-transport-bookings'])
      setCancelId(null)
    },
  })

  const handleCancel = () => {
    if (cancelId) {
      cancelMutation.mutate(cancelId)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">My Transport Bookings</h2>
        <p className="text-slate-500 mt-1">View and manage your transport reservations</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        {bookings.length === 0 ? (
          <div className="px-6 py-12 text-center text-slate-500">
            No transport bookings found
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-slate-500 border-b border-slate-100 bg-slate-50">
                <th className="px-6 py-3 font-medium">Booking #</th>
                <th className="px-6 py-3 font-medium">Driver</th>
                <th className="px-6 py-3 font-medium">Type</th>
                <th className="px-6 py-3 font-medium">Dates</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Amount</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => (
                <tr key={booking.id} className={`border-b border-slate-50 ${index % 2 === 0 ? '' : 'bg-slate-50/50'}`}>
                  <td className="px-6 py-4 font-medium text-slate-800">{booking.booking_number}</td>
                  <td className="px-6 py-4 text-slate-600">
                    {booking.driver?.user ? `${booking.driver.user.first_name} ${booking.driver.user.last_name}` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{booking.booking_type}</td>
                  <td className="px-6 py-4 text-slate-600 text-sm">
                    {new Date(booking.start_date).toLocaleDateString()} to {new Date(booking.end_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[booking.status] || 'bg-slate-100 text-slate-800'}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-slate-800">${booking.total_price}</td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to={`/my-bookings/${booking.id}`}
                      className="text-teal-600 hover:text-teal-700 font-medium text-sm mr-3"
                    >
                      View
                    </Link>
                    {(booking.status === 'Pending' || booking.status === 'Confirmed') && (
                      <button
                        onClick={() => setCancelId(booking.id)}
                        className="text-red-600 hover:text-red-700 font-medium text-sm"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {cancelId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Cancel Booking</h3>
            <p className="text-slate-600 mb-6">Are you sure you want to cancel this booking? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setCancelId(null)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium"
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancel}
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
