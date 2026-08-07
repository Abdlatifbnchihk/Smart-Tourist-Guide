import { useState, useEffect } from 'react'
import apiClient from '../../services/apiClient'
import Skeleton from '../../components/ui/Skeleton'

export default function AllRoomsPage() {
  const [rooms, setRooms] = useState([])
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedHotel, setSelectedHotel] = useState('all')
  const [showDeleted, setShowDeleted] = useState(false)

  const [showModal, setShowModal] = useState(false)
  const [editingRoom, setEditingRoom] = useState(null)
  const [form, setForm] = useState({ number: '', type: 'single', capacity: 1, price_per_night: '', quantity_available: 1, hotel_id: '', available: true })
  const [formErrors, setFormErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingRoom, setDeletingRoom] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const [showRestoreModal, setShowRestoreModal] = useState(false)
  const [restoringRoom, setRestoringRoom] = useState(null)
  const [restoring, setRestoring] = useState(false)

  useEffect(() => {
    fetchRooms()
    fetchHotels()
  }, [])

  const fetchRooms = async () => {
    try {
      // GET /api/v1/hotel-manager/manage-rooms - returns all rooms for manager's hotels
      const res = await apiClient.get('/hotel-manager/manage-rooms')
      setRooms(res.data.data || [])
    } catch (err) {
      setError('Failed to load rooms.')
    } finally {
      setLoading(false)
    }
  }

  const fetchHotels = async () => {
    try {
      // GET /api/v1/hotel-manager/manage-hotel - returns manager's hotels
      const res = await apiClient.get('/hotel-manager/manage-hotel')
      setHotels(res.data.data || [])
    } catch (err) {
      console.error('Failed to load hotels:', err)
    }
  }

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = room.number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.type?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesHotel = selectedHotel === 'all' || room.hotel_id == selectedHotel
    const matchesDeleted = showDeleted ? true : !room.deleted_at
    return matchesSearch && matchesHotel && matchesDeleted
  })

  const getHotelName = (hotelId) => {
    const hotel = hotels.find(h => h.id === hotelId || h.hotel_id === hotelId)
    return hotel?.name || 'N/A'
  }

  const openCreateModal = () => {
    setEditingRoom(null)
    setForm({ number: '', type: 'single', capacity: 1, price_per_night: '', quantity_available: 1, hotel_id: hotels[0]?.id || '', available: true })
    setFormErrors({})
    setShowModal(true)
  }

  const openEditModal = (room) => {
    setEditingRoom(room)
    setForm({
      number: room.number,
      type: room.type || 'single',
      capacity: room.capacity || 1,
      price_per_night: room.price_per_night || '',
      quantity_available: room.quantity_available || 1,
      hotel_id: room.hotel_id || '',
      available: room.available !== false,
    })
    setFormErrors({})
    setShowModal(true)
  }

  const openDeleteModal = (room) => {
    setDeletingRoom(room)
    setShowDeleteModal(true)
  }

  const openRestoreModal = (room) => {
    setRestoringRoom(room)
    setShowRestoreModal(true)
  }

  const validateForm = () => {
    const errors = {}
    if (!form.number.trim()) errors.number = 'Room number is required'
    if (!form.hotel_id) errors.hotel_id = 'Hotel is required'
    if (!form.price_per_night) errors.price_per_night = 'Price is required'
    if (form.capacity < 1) errors.capacity = 'Capacity must be at least 1'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setSubmitting(true)
    try {
      const payload = {
        ...form,
        hotel_id: parseInt(form.hotel_id),
        price_per_night: parseFloat(form.price_per_night),
        capacity: parseInt(form.capacity),
        quantity_available: parseInt(form.quantity_available),
      }

      if (editingRoom) {
        // PUT /api/v1/hotel-manager/manage-rooms/{room}
        await apiClient.put(`/hotel-manager/manage-rooms/${editingRoom.room_id || editingRoom.id}`, payload)
      } else {
        // POST /api/v1/hotel-manager/manage-rooms
        await apiClient.post('/hotel-manager/manage-rooms', payload)
      }
      setShowModal(false)
      fetchRooms()
    } catch (err) {
      setFormErrors({ submit: err.message || 'Failed to save room' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingRoom) return

    setDeleting(true)
    try {
      // DELETE /api/v1/hotel-manager/manage-rooms/{room} - soft delete
      await apiClient.delete(`/hotel-manager/manage-rooms/${deletingRoom.room_id || deletingRoom.id}`)
      setShowDeleteModal(false)
      setDeletingRoom(null)
      fetchRooms()
    } catch (err) {
      setError(err.message || 'Failed to delete room')
    } finally {
      setDeleting(false)
    }
  }

  const handleRestore = async () => {
    if (!restoringRoom) return

    setRestoring(true)
    try {
      // POST /api/v1/hotel-manager/manage-rooms/{room}/restore
      await apiClient.post(`/hotel-manager/manage-rooms/${restoringRoom.room_id || restoringRoom.id}/restore`)
      setShowRestoreModal(false)
      setRestoringRoom(null)
      fetchRooms()
    } catch (err) {
      setError(err.message || 'Failed to restore room')
    } finally {
      setRestoring(false)
    }
  }

  if (loading) {
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
          <h2 className="text-2xl font-bold text-slate-800">My Rooms</h2>
          <p className="text-slate-500 mt-1">Manage all rooms across your hotels</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
        >
          Add New Room
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-wrap items-center gap-4">
          <input
            type="text"
            placeholder="Search rooms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 min-w-[200px] px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <select
            value={selectedHotel}
            onChange={(e) => setSelectedHotel(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">All Hotels</option>
            {hotels.map((hotel) => (
              <option key={hotel.id || hotel.hotel_id} value={hotel.id || hotel.hotel_id}>
                {hotel.name}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              checked={showDeleted}
              onChange={(e) => setShowDeleted(e.target.checked)}
              className="w-4 h-4 text-amber-600 border-slate-300 rounded focus:ring-amber-500"
            />
            Show deleted
          </label>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
          <button onClick={() => setError(null)} className="ml-2 underline">Dismiss</button>
        </div>
      )}

      {/* Rooms Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-slate-500 border-b border-slate-100 bg-slate-50">
              <th className="px-6 py-3 font-medium">Room #</th>
              <th className="px-6 py-3 font-medium">Hotel</th>
              <th className="px-6 py-3 font-medium">Type</th>
              <th className="px-6 py-3 font-medium">Capacity</th>
              <th className="px-6 py-3 font-medium">Price/Night</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRooms.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-slate-500">
                  No rooms found
                </td>
              </tr>
            ) : (
              filteredRooms.map((room, index) => {
                const isDeleted = room.deleted_at
                return (
                  <tr
                    key={room.room_id || room.id}
                    className={`border-b border-slate-50 ${isDeleted ? 'bg-slate-100 opacity-60' : index % 2 === 0 ? '' : 'bg-slate-50/50'}`}
                  >
                    <td className="px-6 py-4">
                      <span className={`font-medium ${isDeleted ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                        {room.number}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{getHotelName(room.hotel_id)}</td>
                    <td className="px-6 py-4">
                      <span className={`capitalize ${isDeleted ? 'text-slate-500' : 'text-slate-600'}`}>{room.type}</span>
                    </td>
                    <td className={`px-6 py-4 ${isDeleted ? 'text-slate-500' : 'text-slate-600'}`}>{room.capacity} guests</td>
                    <td className={`px-6 py-4 font-medium ${isDeleted ? 'text-slate-500' : 'text-slate-800'}`}>${room.price_per_night}</td>
                    <td className="px-6 py-4">
                      {isDeleted ? (
                        <span className="inline-block px-2 py-0.5 rounded text-sm font-medium bg-red-100 text-red-700">
                          Deleted
                        </span>
                      ) : (
                        <span className={`inline-block px-2 py-0.5 rounded text-sm font-medium ${
                          room.available
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {room.available ? 'Available' : 'Unavailable'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {isDeleted ? (
                        <button
                          onClick={() => openRestoreModal(room)}
                          className="text-green-600 hover:text-green-700 font-medium text-sm"
                        >
                          Restore
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => openEditModal(room)}
                            className="text-amber-600 hover:text-amber-700 font-medium text-sm mr-3"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => openDeleteModal(room)}
                            className="text-red-600 hover:text-red-700 font-medium text-sm"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-800">
                {editingRoom ? 'Edit Room' : 'Add New Room'}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {formErrors.submit && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  {formErrors.submit}
                </div>
              )}
              {!editingRoom && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Hotel *</label>
                  <select
                    value={form.hotel_id}
                    onChange={(e) => setForm({ ...form, hotel_id: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                      formErrors.hotel_id ? 'border-red-500' : 'border-slate-300'
                    }`}
                  >
                    <option value="">Select a hotel</option>
                    {hotels.map((hotel) => (
                      <option key={hotel.id || hotel.hotel_id} value={hotel.id || hotel.hotel_id}>
                        {hotel.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.hotel_id && <p className="mt-1 text-sm text-red-600">{formErrors.hotel_id}</p>}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Room Number *</label>
                <input
                  type="text"
                  value={form.number}
                  onChange={(e) => setForm({ ...form, number: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                    formErrors.number ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="e.g., 101"
                />
                {formErrors.number && <p className="mt-1 text-sm text-red-600">{formErrors.number}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="single">Single</option>
                    <option value="double">Double</option>
                    <option value="suite">Suite</option>
                    <option value="family">Family</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Capacity</label>
                  <input
                    type="number"
                    min="1"
                    value={form.capacity}
                    onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                      formErrors.capacity ? 'border-red-500' : 'border-slate-300'
                    }`}
                  />
                  {formErrors.capacity && <p className="mt-1 text-sm text-red-600">{formErrors.capacity}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Price per Night ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price_per_night}
                  onChange={(e) => setForm({ ...form, price_per_night: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                    formErrors.price_per_night ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="0.00"
                />
                {formErrors.price_per_night && <p className="mt-1 text-sm text-red-600">{formErrors.price_per_night}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Quantity Available</label>
                <input
                  type="number"
                  min="0"
                  value={form.quantity_available}
                  onChange={(e) => setForm({ ...form, quantity_available: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="available"
                  checked={form.available}
                  onChange={(e) => setForm({ ...form, available: e.target.checked })}
                  className="w-4 h-4 text-amber-600 border-slate-300 rounded focus:ring-amber-500"
                />
                <label htmlFor="available" className="text-sm font-medium text-slate-700">Available for booking</label>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingRoom ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Delete Room</h3>
              <p className="text-slate-500 mb-6">
                Are you sure you want to delete room <strong>{deletingRoom?.number}</strong>? You can restore it later.
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
                  disabled={deleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
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
              <h3 className="text-lg font-bold text-slate-800 mb-2">Restore Room</h3>
              <p className="text-slate-500 mb-6">
                Are you sure you want to restore room <strong>{restoringRoom?.number}</strong>?
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
                  disabled={restoring}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
                >
                  {restoring ? 'Restoring...' : 'Restore'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
