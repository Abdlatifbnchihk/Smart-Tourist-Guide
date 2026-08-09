import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '../../services/apiClient'
import Skeleton from '../../components/ui/Skeleton'

export default function DeletedItemsPage() {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState('hotels')
  const [showRestoreModal, setShowRestoreModal] = useState(false)
  const [showForceModal, setShowForceModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  const { data: hotelsResponse, isLoading: hotelsLoading } = useQuery({
    queryKey: ['admin-trashed-hotels'],
    queryFn: async () => {
      const res = await apiClient.get('/admin/trashed/hotels')
      return res.data
    },
    enabled: activeTab === 'hotels',
  })

  const { data: roomsResponse, isLoading: roomsLoading } = useQuery({
    queryKey: ['admin-trashed-rooms'],
    queryFn: async () => {
      const res = await apiClient.get('/admin/trashed/rooms')
      return res.data
    },
    enabled: activeTab === 'rooms',
  })

  const restoreHotelMutation = useMutation({
    mutationFn: async (id) => {
      const res = await apiClient.post(`/admin/trashed/hotels/${id}/restore`)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-trashed-hotels'])
      setShowRestoreModal(false)
      setSelectedItem(null)
    },
  })

  const forceDeleteHotelMutation = useMutation({
    mutationFn: async (id) => {
      const res = await apiClient.delete(`/admin/trashed/hotels/${id}/force`)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-trashed-hotels'])
      setShowForceModal(false)
      setSelectedItem(null)
    },
  })

  const restoreRoomMutation = useMutation({
    mutationFn: async (id) => {
      const res = await apiClient.post(`/admin/trashed/rooms/${id}/restore`)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-trashed-rooms'])
      setShowRestoreModal(false)
      setSelectedItem(null)
    },
  })

  const forceDeleteRoomMutation = useMutation({
    mutationFn: async (id) => {
      const res = await apiClient.delete(`/admin/trashed/rooms/${id}/force`)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-trashed-rooms'])
      setShowForceModal(false)
      setSelectedItem(null)
    },
  })

  const hotels = hotelsResponse?.data || []
  const rooms = roomsResponse?.data || []
  const isLoading = activeTab === 'hotels' ? hotelsLoading : roomsLoading

  const handleRestore = () => {
    if (!selectedItem) return
    if (activeTab === 'hotels') {
      restoreHotelMutation.mutate(selectedItem.id)
    } else {
      restoreRoomMutation.mutate(selectedItem.room_id || selectedItem.id)
    }
  }

  const handleForceDelete = () => {
    if (!selectedItem) return
    if (activeTab === 'hotels') {
      forceDeleteHotelMutation.mutate(selectedItem.id)
    } else {
      forceDeleteRoomMutation.mutate(selectedItem.room_id || selectedItem.id)
    }
  }

  const isMutating = restoreHotelMutation.isPending || forceDeleteHotelMutation.isPending ||
    restoreRoomMutation.isPending || forceDeleteRoomMutation.isPending

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
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Deleted Items</h2>
        <p className="text-slate-500 mt-1">Manage soft-deleted hotels and rooms</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-lg p-1 w-fit">
        <button
          onClick={() => setActiveTab('hotels')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'hotels'
              ? 'bg-white text-slate-800 shadow-sm'
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          Hotels ({hotels.length})
        </button>
        <button
          onClick={() => setActiveTab('rooms')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'rooms'
              ? 'bg-white text-slate-800 shadow-sm'
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          Rooms ({rooms.length})
        </button>
      </div>

      {/* Hotels Table */}
      {activeTab === 'hotels' && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-slate-500 border-b border-slate-100 bg-slate-50">
                <th className="px-6 py-3 font-medium">Hotel</th>
                <th className="px-6 py-3 font-medium">City</th>
                <th className="px-6 py-3 font-medium">Stars</th>
                <th className="px-6 py-3 font-medium">Rooms</th>
                <th className="px-6 py-3 font-medium">Deleted</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {hotels.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    No deleted hotels
                  </td>
                </tr>
              ) : (
                hotels.map((hotel, index) => (
                  <tr key={hotel.id} className={`border-b border-slate-50 ${index % 2 === 0 ? '' : 'bg-slate-50/50'}`}>
                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-800">{hotel.name}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm">{hotel.city?.name || '-'}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-3.5 h-3.5 ${star <= (hotel.stars || 0) ? 'text-yellow-400' : 'text-slate-200'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm">{hotel.rooms_count ?? 0}</td>
                    <td className="px-6 py-4 text-slate-500 text-sm">
                      {hotel.deleted_at ? new Date(hotel.deleted_at).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => { setSelectedItem(hotel); setShowRestoreModal(true) }}
                        className="text-green-600 hover:text-green-700 font-medium text-sm mr-3"
                      >
                        Restore
                      </button>
                      <button
                        onClick={() => { setSelectedItem(hotel); setShowForceModal(true) }}
                        className="text-red-600 hover:text-red-700 font-medium text-sm"
                      >
                        Delete Forever
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Rooms Table */}
      {activeTab === 'rooms' && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-slate-500 border-b border-slate-100 bg-slate-50">
                <th className="px-6 py-3 font-medium">Room #</th>
                <th className="px-6 py-3 font-medium">Hotel</th>
                <th className="px-6 py-3 font-medium">Type</th>
                <th className="px-6 py-3 font-medium">Capacity</th>
                <th className="px-6 py-3 font-medium">Price/Night</th>
                <th className="px-6 py-3 font-medium">Deleted</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-500">
                    No deleted rooms
                  </td>
                </tr>
              ) : (
                rooms.map((room, index) => (
                  <tr key={room.room_id || room.id} className={`border-b border-slate-50 ${index % 2 === 0 ? '' : 'bg-slate-50/50'}`}>
                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-800">{room.number}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm">{room.hotel?.name || '-'}</td>
                    <td className="px-6 py-4 text-slate-600 text-sm capitalize">{room.type}</td>
                    <td className="px-6 py-4 text-slate-600 text-sm">{room.capacity} guests</td>
                    <td className="px-6 py-4 font-medium text-slate-800 text-sm">${room.price_per_night}</td>
                    <td className="px-6 py-4 text-slate-500 text-sm">
                      {room.deleted_at ? new Date(room.deleted_at).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => { setSelectedItem(room); setShowRestoreModal(true) }}
                        className="text-green-600 hover:text-green-700 font-medium text-sm mr-3"
                      >
                        Restore
                      </button>
                      <button
                        onClick={() => { setSelectedItem(room); setShowForceModal(true) }}
                        className="text-red-600 hover:text-red-700 font-medium text-sm"
                      >
                        Delete Forever
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Restore Confirmation Modal */}
      {showRestoreModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Restore {activeTab === 'hotels' ? 'Hotel' : 'Room'}</h3>
              <p className="text-slate-500 mb-6">
                Are you sure you want to restore <strong>{selectedItem?.name || selectedItem?.number}</strong>?
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowRestoreModal(false)}
                  className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRestore}
                  disabled={isMutating}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
                >
                  {isMutating ? 'Restoring...' : 'Restore'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Force Delete Confirmation Modal */}
      {showForceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Permanently Delete</h3>
              <p className="text-slate-500 mb-6">
                This will permanently delete <strong>{selectedItem?.name || selectedItem?.number}</strong>. This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowForceModal(false)}
                  className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleForceDelete}
                  disabled={isMutating}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
                >
                  {isMutating ? 'Deleting...' : 'Delete Forever'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
