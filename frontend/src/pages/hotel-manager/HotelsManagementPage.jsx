import { useState, useEffect } from 'react'
import apiClient from '../../services/apiClient'
import Skeleton from '../../components/ui/Skeleton'

const emptyForm = { name: '', address: '', phone: '', email: '', description: '', stars: 3, city_id: '' }

export default function HotelsManagementPage() {
  const [hotels, setHotels] = useState([])
  const [cities, setCities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const [showModal, setShowModal] = useState(false)
  const [editingHotel, setEditingHotel] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [formErrors, setFormErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingHotel, setDeletingHotel] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchHotels()
    fetchCities()
  }, [])

  const fetchHotels = async () => {
    try {
      // GET /api/v1/hotel-manager/manage-hotel - returns paginated hotels
      const res = await apiClient.get('/hotel-manager/manage-hotel')
      setHotels(res.data.data || [])
    } catch (err) {
      setError('Failed to load hotels.')
    } finally {
      setLoading(false)
    }
  }

  const fetchCities = async () => {
    try {
      // GET /api/v1/cities - returns all cities
      const res = await apiClient.get('/cities')
      setCities(res.data.data || [])
    } catch (err) {
      console.error('Failed to load cities:', err)
    }
  }

  const filteredHotels = hotels.filter((hotel) =>
    hotel.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hotel.address?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const openCreateModal = () => {
    setEditingHotel(null)
    setForm(emptyForm)
    setFormErrors({})
    setShowModal(true)
  }

  const openEditModal = (hotel) => {
    setEditingHotel(hotel)
    setForm({
      name: hotel.name,
      address: hotel.address,
      phone: hotel.phone || '',
      email: hotel.email || '',
      description: hotel.description || '',
      stars: hotel.stars || 3,
      city_id: hotel.city_id || '',
    })
    setFormErrors({})
    setShowModal(true)
  }

  const openDeleteModal = (hotel) => {
    setDeletingHotel(hotel)
    setShowDeleteModal(true)
  }

  const validateForm = () => {
    const errors = {}
    if (!form.name.trim()) errors.name = 'Name is required'
    if (!form.address.trim()) errors.address = 'Address is required'
    if (!form.city_id) errors.city_id = 'City is required'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setSubmitting(true)
    try {
      if (editingHotel) {
        // PUT /api/v1/hotel-manager/manage-hotel/{hotel}
        await apiClient.put(`/hotel-manager/manage-hotel/${editingHotel.hotel_id || editingHotel.id}`, form)
      } else {
        // POST /api/v1/hotel-manager/manage-hotel
        await apiClient.post('/hotel-manager/manage-hotel', form)
      }
      setShowModal(false)
      fetchHotels()
    } catch (err) {
      setFormErrors({ submit: err.message || 'Failed to save hotel' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingHotel) return

    setDeleting(true)
    try {
      // DELETE /api/v1/hotel-manager/manage-hotel/{hotel}
      await apiClient.delete(`/hotel-manager/manage-hotel/${deletingHotel.hotel_id || deletingHotel.id}`)
      setShowDeleteModal(false)
      setDeletingHotel(null)
      fetchHotels()
    } catch (err) {
      setError(err.message || 'Failed to delete hotel')
    } finally {
      setDeleting(false)
    }
  }

  const getCityName = (cityId) => {
    const city = cities.find(c => c.city_id === cityId || c.id === cityId)
    return city?.name || 'N/A'
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
          <h2 className="text-2xl font-bold text-slate-800">My Hotels</h2>
          <p className="text-slate-500 mt-1">Manage your hotels</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
        >
          Add New Hotel
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <input
          type="text"
          placeholder="Search hotels..."
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

      {/* Hotels Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-slate-500 border-b border-slate-100 bg-slate-50">
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">City</th>
              <th className="px-6 py-3 font-medium">Stars</th>
              <th className="px-6 py-3 font-medium">Phone</th>
              <th className="px-6 py-3 font-medium">Rooms</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredHotels.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                  No hotels found
                </td>
              </tr>
            ) : (
              filteredHotels.map((hotel, index) => (
                <tr key={hotel.hotel_id || hotel.id} className={`border-b border-slate-50 ${index % 2 === 0 ? '' : 'bg-slate-50/50'}`}>
                  <td className="px-6 py-4">
                    <span className="font-medium text-slate-800">{hotel.name}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{getCityName(hotel.city_id)}</td>
                  <td className="px-6 py-4">
                    <span className="text-amber-500">{'★'.repeat(hotel.stars || 0)}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{hotel.phone || '-'}</td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-sm font-medium">
                      {hotel.rooms_count || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <a
                      href={`/hotel-manager/hotels/${hotel.hotel_id || hotel.id}/rooms`}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm mr-3"
                    >
                      Rooms
                    </a>
                    <button
                      onClick={() => openEditModal(hotel)}
                      className="text-amber-600 hover:text-amber-700 font-medium text-sm mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(hotel)}
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
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-200 sticky top-0 bg-white">
              <h3 className="text-lg font-bold text-slate-800">
                {editingHotel ? 'Edit Hotel' : 'Add New Hotel'}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {formErrors.submit && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  {formErrors.submit}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                    formErrors.name ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="Enter hotel name"
                />
                {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">City *</label>
                <select
                  value={form.city_id}
                  onChange={(e) => setForm({ ...form, city_id: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                    formErrors.city_id ? 'border-red-500' : 'border-slate-300'
                  }`}
                >
                  <option value="">Select a city</option>
                  {cities.map((city) => (
                    <option key={city.city_id || city.id} value={city.city_id || city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
                {formErrors.city_id && <p className="mt-1 text-sm text-red-600">{formErrors.city_id}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Address *</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                    formErrors.address ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="Enter address"
                />
                {formErrors.address && <p className="mt-1 text-sm text-red-600">{formErrors.address}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Email address"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Stars</label>
                <select
                  value={form.stars}
                  onChange={(e) => setForm({ ...form, stars: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value={1}>1 Star</option>
                  <option value={2}>2 Stars</option>
                  <option value={3}>3 Stars</option>
                  <option value={4}>4 Stars</option>
                  <option value={5}>5 Stars</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Enter description (optional)"
                />
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
                  {submitting ? 'Saving...' : editingHotel ? 'Update' : 'Create'}
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
              <h3 className="text-lg font-bold text-slate-800 mb-2">Delete Hotel</h3>
              <p className="text-slate-500 mb-6">
                Are you sure you want to delete <strong>{deletingHotel?.name}</strong>? This action cannot be undone.
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
