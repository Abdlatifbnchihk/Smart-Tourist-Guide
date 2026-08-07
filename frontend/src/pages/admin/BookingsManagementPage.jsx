import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getAllHotelBookings,
  getAllTransportBookings,
  updateHotelBookingStatus,
  cancelHotelBooking,
  updateTransportBookingStatus,
  cancelTransportBooking,
  deleteHotelBooking,
  deleteTransportBooking,
} from '../../services/bookingService'
import Skeleton from '../../components/ui/Skeleton'

export default function BookingsManagementPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const queryClient = useQueryClient()

  const [activeTab, setActiveTab] = useState('hotel')
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '')
  const [localSearch, setLocalSearch] = useState(searchParams.get('search') || '')

  const [selectedBooking, setSelectedBooking] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingBooking, setDeletingBooking] = useState(null)

  const filters = {
    status: statusFilter,
    search: localSearch,
  }

  const { data: hotelBookingsResponse, isLoading: hotelLoading, error: hotelError } = useQuery({
    queryKey: ['admin-hotel-bookings', filters],
    queryFn: () => getAllHotelBookings(filters),
    enabled: activeTab === 'hotel',
  })

  const { data: transportBookingsResponse, isLoading: transportLoading, error: transportError } = useQuery({
    queryKey: ['admin-transport-bookings', filters],
    queryFn: () => getAllTransportBookings(filters),
    enabled: activeTab === 'transport',
  })

  const currentError = activeTab === 'hotel' ? hotelError : transportError

  // Laravel paginated response: { data: { data: [...bookings], meta: {...} } }
  const hotelBookings = hotelBookingsResponse?.data?.data || hotelBookingsResponse?.data || []
  const transportBookings = transportBookingsResponse?.data?.data || transportBookingsResponse?.data || []

  const isLoading = activeTab === 'hotel' ? hotelLoading : transportLoading
  const bookings = activeTab === 'hotel' ? hotelBookings : transportBookings

  // Status update mutations
  const updateHotelStatusMutation = useMutation({
    mutationFn: ({ id, status }) => updateHotelBookingStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-hotel-bookings'])
      setShowDetailModal(false)
      setSelectedBooking(null)
    },
  })

  const cancelHotelMutation = useMutation({
    mutationFn: cancelHotelBooking,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-hotel-bookings'])
      setShowDetailModal(false)
      setSelectedBooking(null)
    },
  })

  const updateTransportStatusMutation = useMutation({
    mutationFn: ({ id, status }) => updateTransportBookingStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-transport-bookings'])
      setShowDetailModal(false)
      setSelectedBooking(null)
    },
  })

  const cancelTransportMutation = useMutation({
    mutationFn: cancelTransportBooking,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-transport-bookings'])
      setShowDetailModal(false)
      setSelectedBooking(null)
    },
  })

  // Delete mutations
  const deleteHotelMutation = useMutation({
    mutationFn: deleteHotelBooking,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-hotel-bookings'])
      setShowDeleteModal(false)
      setDeletingBooking(null)
    },
  })

  const deleteTransportMutation = useMutation({
    mutationFn: deleteTransportBooking,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-transport-bookings'])
      setShowDeleteModal(false)
      setDeletingBooking(null)
    },
  })

  const handleSearchChange = useCallback((value) => {
    setLocalSearch(value)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        if (localSearch) {
          next.set('search', localSearch)
        } else {
          next.delete('search')
        }
        return next
      })
    }, 300)
    return () => clearTimeout(timer)
  }, [localSearch, setSearchParams])

  const handleStatusFilter = (status) => {
    setStatusFilter(status)
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (status) {
        next.set('status', status)
      } else {
        next.delete('status')
      }
      return next
    })
  }

  const getStatusBadge = (status) => {
    const styles = {
      Pending: 'bg-yellow-100 text-yellow-700',
      Confirmed: 'bg-blue-100 text-blue-700',
      InProgress: 'bg-purple-100 text-purple-700',
      Completed: 'bg-green-100 text-green-700',
      Cancelled: 'bg-red-100 text-red-700',
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-slate-100 text-slate-700'}`}>
        {status}
      </span>
    )
  }

  const openDetailModal = (booking) => {
    setSelectedBooking(booking)
    setShowDetailModal(true)
  }

  const openDeleteModal = (booking) => {
    setDeletingBooking(booking)
    setShowDeleteModal(true)
  }

  const handleStatusUpdate = (booking, newStatus, type) => {
    const status = newStatus.toLowerCase()
    if (type === 'hotel') {
      updateHotelStatusMutation.mutate({ id: booking.id, status })
    } else {
      updateTransportStatusMutation.mutate({ id: booking.id, status })
    }
  }

  const handleCancel = (booking, type) => {
    if (type === 'hotel') {
      cancelHotelMutation.mutate(booking.id)
    } else {
      cancelTransportMutation.mutate(booking.id)
    }
  }

  const handleDelete = () => {
    if (!deletingBooking) return
    if (activeTab === 'hotel') {
      deleteHotelMutation.mutate(deletingBooking.id)
    } else {
      deleteTransportMutation.mutate(deletingBooking.id)
    }
  }

  const getNextStatuses = (currentStatus, type) => {
    if (type === 'hotel') {
      const transitions = {
        Pending: ['Confirmed', 'Cancelled'],
        Confirmed: ['Completed', 'Cancelled'],
        Completed: [],
        Cancelled: [],
      }
      return transitions[currentStatus] || []
    } else {
      const transitions = {
        Pending: ['Confirmed', 'Cancelled'],
        Confirmed: ['InProgress', 'Cancelled'],
        InProgress: ['Completed'],
        Completed: [],
        Cancelled: [],
      }
      return transitions[currentStatus] || []
    }
  }

  if (isLoading) {
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
          <h2 className="text-2xl font-bold text-slate-800">Bookings Management</h2>
          <p className="text-slate-500 mt-1">Manage all hotel and transport bookings</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('hotel')}
          className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'hotel'
              ? 'text-teal-600 border-teal-600'
              : 'text-slate-500 border-transparent hover:text-slate-700'
          }`}
        >
          Hotel Bookings
        </button>
        <button
          onClick={() => setActiveTab('transport')}
          className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'transport'
              ? 'text-teal-600 border-teal-600'
              : 'text-slate-500 border-transparent hover:text-slate-700'
          }`}
        >
          Transport Bookings
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search bookings..."
              value={localSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div className="flex gap-2">
            {['', 'Pending', 'Confirmed', 'InProgress', 'Completed', 'Cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => handleStatusFilter(status)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status || 'All'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        {currentError && (
          <div className="px-6 py-4 bg-red-50 border-b border-red-100 text-red-700 text-sm">
            Error loading bookings: {currentError.message || JSON.stringify(currentError)}
          </div>
        )}
        {activeTab === 'hotel' ? (
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-slate-500 border-b border-slate-100 bg-slate-50">
                <th className="px-6 py-3 font-medium">Booking #</th>
                <th className="px-6 py-3 font-medium">Tourist</th>
                <th className="px-6 py-3 font-medium">Hotel</th>
                <th className="px-6 py-3 font-medium">Room</th>
                <th className="px-6 py-3 font-medium">Dates</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Amount</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {hotelBookings.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-slate-500">
                    No hotel bookings found
                  </td>
                </tr>
              ) : (
                hotelBookings.map((booking, index) => (
                  <tr key={booking.id} className={`border-b border-slate-50 ${index % 2 === 0 ? '' : 'bg-slate-50/50'}`}>
                    <td className="px-6 py-4 font-medium text-slate-800">{booking.booking_number}</td>
                    <td className="px-6 py-4 text-slate-600">{booking.user ? `${booking.user.first_name} ${booking.user.last_name}` : 'N/A'}</td>
                    <td className="px-6 py-4 text-slate-600">{booking.room?.hotel?.name || 'N/A'}</td>
                    <td className="px-6 py-4 text-slate-600">{booking.room?.number || 'N/A'}</td>
                    <td className="px-6 py-4 text-slate-600 text-sm">
                      {new Date(booking.start_date).toLocaleDateString()} to {new Date(booking.end_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(booking.status)}</td>
                    <td className="px-6 py-4 text-right font-medium text-slate-800">${booking.total_price}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openDetailModal(booking)}
                        className="text-teal-600 hover:text-teal-700 font-medium text-sm mr-3"
                      >
                        View
                      </button>
                      <button
                        onClick={() => openDeleteModal(booking)}
                        className="text-red-600 hover:text-red-700 font-medium text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-slate-500 border-b border-slate-100 bg-slate-50">
                <th className="px-6 py-3 font-medium">Booking #</th>
                <th className="px-6 py-3 font-medium">Tourist</th>
                <th className="px-6 py-3 font-medium">Driver</th>
                <th className="px-6 py-3 font-medium">Type</th>
                <th className="px-6 py-3 font-medium">Distance</th>
                <th className="px-6 py-3 font-medium">Dates</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Amount</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transportBookings.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-6 py-12 text-center text-slate-500">
                    No transport bookings found
                  </td>
                </tr>
              ) : (
                transportBookings.map((booking, index) => (
                  <tr key={booking.id} className={`border-b border-slate-50 ${index % 2 === 0 ? '' : 'bg-slate-50/50'}`}>
                    <td className="px-6 py-4 font-medium text-slate-800">{booking.booking_number}</td>
                    <td className="px-6 py-4 text-slate-600">{booking.user ? `${booking.user.first_name} ${booking.user.last_name}` : 'N/A'}</td>
                    <td className="px-6 py-4 text-slate-600">{booking.driver?.user ? `${booking.driver.user.first_name} ${booking.driver.user.last_name}` : 'N/A'}</td>
                    <td className="px-6 py-4 text-slate-600">{booking.booking_type}</td>
                    <td className="px-6 py-4 text-slate-600">{booking.distance_km} km</td>
                    <td className="px-6 py-4 text-slate-600 text-sm">
                      {new Date(booking.start_date).toLocaleDateString()} to {new Date(booking.end_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(booking.status)}</td>
                    <td className="px-6 py-4 text-right font-medium text-slate-800">${booking.total_price}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openDetailModal(booking)}
                        className="text-teal-600 hover:text-teal-700 font-medium text-sm mr-3"
                      >
                        View
                      </button>
                      <button
                        onClick={() => openDeleteModal(booking)}
                        className="text-red-600 hover:text-red-700 font-medium text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Booking Details</h3>
              <button onClick={() => setShowDetailModal(false)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-slate-600">Booking Number</span>
                <span className="font-medium text-slate-800">{selectedBooking.booking_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Status</span>
                {getStatusBadge(selectedBooking.status)}
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Tourist</span>
                <span className="font-medium text-slate-800">{selectedBooking.user?.name || 'N/A'}</span>
              </div>
              {activeTab === 'hotel' ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Hotel</span>
                    <span className="font-medium text-slate-800">{selectedBooking.room?.hotel?.name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Room</span>
                    <span className="font-medium text-slate-800">{selectedBooking.room?.number || 'N/A'}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Driver</span>
                    <span className="font-medium text-slate-800">{selectedBooking.driver?.user ? `${selectedBooking.driver.user.first_name} ${selectedBooking.driver.user.last_name}` : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Booking Type</span>
                    <span className="font-medium text-slate-800">{selectedBooking.booking_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Distance</span>
                    <span className="font-medium text-slate-800">{selectedBooking.distance_km} km</span>
                  </div>
                </>
              )}
              <div className="flex justify-between">
                <span className="text-slate-600">Dates</span>
                <span className="font-medium text-slate-800">{new Date(selectedBooking.start_date).toLocaleDateString()} to {new Date(selectedBooking.end_date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Total Price</span>
                <span className="font-bold text-teal-600">${selectedBooking.total_price}</span>
              </div>

              {/* Status Update Buttons */}
              <div className="border-t pt-4 mt-4">
                <p className="text-sm font-medium text-slate-700 mb-3">Update Status:</p>
                <div className="flex flex-wrap gap-2">
                  {getNextStatuses(selectedBooking.status, activeTab).map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusUpdate(selectedBooking, status, activeTab)}
                      disabled={updateHotelStatusMutation.isPending || updateTransportStatusMutation.isPending}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        status === 'Cancelled'
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : status === 'Completed'
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      } disabled:opacity-50`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Delete Booking</h3>
              <p className="text-slate-500 mb-6">
                Are you sure you want to delete booking <strong>{deletingBooking.booking_number}</strong>? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteHotelMutation.isPending || deleteTransportMutation.isPending}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
                >
                  {deleteHotelMutation.isPending || deleteTransportMutation.isPending ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
