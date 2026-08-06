import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import apiClient from '../../services/apiClient'
import Skeleton from '../../components/ui/Skeleton'

const emptyForm = { number: '', type: 'single', capacity: 1, price_per_night: '', available: true }

export default function RoomsManagementPage() {
  const { hotelId } = useParams()
  const [hotel, setHotel] = useState(null)
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const [showModal, setShowModal] = useState(false)
  const [editingRoom, setEditingRoom] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [formErrors, setFormErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingRoom, setDeletingRoom] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (hotelId) {
      fetchHotel()
      fetchRooms()
    }
  }, [hotelId])

  const fetchHotel = async () => {
    try {
      const res = await apiClient.get(`/hotel-manager/manage-hotel/${hotelId}`)
      setHotel(res.data.data || res.data)
    } catch (err) {
      console.error('Failed to load hotel:', err)
    }
  }

  const fetchRooms = async () => {
    try {
      const res = await apiClient.get(`/hotels/${hotelId}/rooms`)
      setRooms(res.data.data || [])
    } catch (err) {
      setError('Failed to load rooms.')
    } finally {
      setLoading(false)
    }
  }

  const filteredRooms = rooms.filter((room) =>
    room.number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.type?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const openCreateModal = () => {
    setEditingRoom(null)
    setForm(emptyForm)
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
      available: room.available !== false,
    })
    setFormErrors({})
    setShowModal(true)
  }

  const openDeleteModal = (room) => {
    setDeletingRoom(room)
    setShowDeleteModal(true)
  }

  const validateForm = () => {
    const errors = {}
    if (!form.number.trim()) errors.number = 'Room number is required'
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
        price_per_night: parseFloat(form.price_per_night),
        capacity: parseInt(form.capacity),
      }

      if (editingRoom) {
        await apiClient.put(`/rooms/${editingRoom.room_id || editingRoom.id}`, payload)
      } else {
        await apiClient.post(`/hotels/${hotelId}/rooms`, payload)
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
      await apiClient.delete(`/rooms/${deletingRoom.room_id || deletingRoom.id}`)
      setShowDeleteModal(false)
      setDeletingRoom(null)
      fetchRooms()
    } catch (err) {
      setError(err.message || 'Failed to delete room')
    } finally {
      setDeleting(false)
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
          <h2 className="text-2xl font-bold text-slate-800">Rooms Management</h2>
          <p className="text-slate-500 mt-1">
            {hotel ? `Managing rooms for ${hotel.name}` : 'Manage rooms'}
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
        >
          Add New Room
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <input
          type="text"
          placeholder="Search rooms..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
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
                <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                  No rooms found
                </td>
              </tr>
            ) : (
              filteredRooms.map((room, index) => (
                <tr key={room.room_id || room.id} className={`border-b border-slate-50 ${index % 2 === 0 ? '' : 'bg-slate-50/50'}`}>
                  <td className="px-6 py-4">
                    <span className="font-medium text-slate-800">{room.number}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="capitalize text-slate-600">{room.type}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{room.capacity} guests</td>
                  <td className="px-6 py-4 font-medium text-slate-800">${room.price_per_night}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-0.5 rounded text-sm font-medium ${
                      room.available
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {room.available ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
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
                  </td>
                </tr>
              ))
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
                Are you sure you want to delete room <strong>{deletingRoom?.number}</strong>? This action cannot be undone.
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
    </div>
  )
}
