import { useState, useEffect } from 'react'
import apiClient from '../../services/apiClient'
import Skeleton from '../../components/ui/Skeleton'

const emptyForm = { name: '', city_id: '', cuisine: '', description: '', address: '', phone: '', price_range: 2 }

export default function RestaurantsManagementPage() {
  const [restaurants, setRestaurants] = useState([])
  const [cities, setCities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const [showModal, setShowModal] = useState(false)
  const [editingRestaurant, setEditingRestaurant] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [formErrors, setFormErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const [showViewModal, setShowViewModal] = useState(false)
  const [viewingRestaurant, setViewingRestaurant] = useState(null)

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingRestaurant, setDeletingRestaurant] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchRestaurants()
    fetchCities()
  }, [])

  const fetchRestaurants = async () => {
    try {
      const res = await apiClient.get('/admin/restaurants')
      setRestaurants(res.data.data || res.data || [])
    } catch (err) {
      setError('Failed to load restaurants.')
    } finally {
      setLoading(false)
    }
  }

  const fetchCities = async () => {
    try {
      const res = await apiClient.get('/cities')
      setCities(res.data.data || res.data || [])
    } catch (err) {
      console.error('Failed to load cities:', err)
    }
  }

  const filteredRestaurants = restaurants.filter((r) =>
    r.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.cuisine?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.address?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const openCreateModal = () => {
    setEditingRestaurant(null)
    setForm(emptyForm)
    setFormErrors({})
    setShowModal(true)
  }

  const openEditModal = (restaurant) => {
    setEditingRestaurant(restaurant)
    setForm({
      name: restaurant.name || '',
      city_id: restaurant.city_id || '',
      cuisine: restaurant.cuisine || '',
      description: restaurant.description || '',
      address: restaurant.address || '',
      phone: restaurant.phone || '',
      price_range: restaurant.price_range || 2,
    })
    setFormErrors({})
    setShowModal(true)
  }

  const openViewModal = (restaurant) => {
    setViewingRestaurant(restaurant)
    setShowViewModal(true)
  }

  const openDeleteModal = (restaurant) => {
    setDeletingRestaurant(restaurant)
    setShowDeleteModal(true)
  }

  const validateForm = () => {
    const errors = {}
    if (!form.name.trim()) errors.name = 'Name is required'
    if (!form.city_id) errors.city_id = 'City is required'
    if (!form.cuisine.trim()) errors.cuisine = 'Cuisine is required'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setSubmitting(true)
    try {
      const payload = { ...form, city_id: parseInt(form.city_id), price_range: parseInt(form.price_range) }

      if (editingRestaurant) {
        await apiClient.put(`/admin/restaurants/${editingRestaurant.restaurant_id || editingRestaurant.id}`, payload)
      } else {
        await apiClient.post('/admin/restaurants', payload)
      }
      setShowModal(false)
      fetchRestaurants()
    } catch (err) {
      const msgs = err.response?.data?.errors
      if (msgs) {
        const first = Object.values(msgs)[0]
        setFormErrors({ submit: Array.isArray(first) ? first[0] : first })
      } else {
        setFormErrors({ submit: err.message || 'Failed to save restaurant' })
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingRestaurant) return
    setDeleting(true)
    try {
      await apiClient.delete(`/admin/restaurants/${deletingRestaurant.restaurant_id || deletingRestaurant.id}`)
      setShowDeleteModal(false)
      setDeletingRestaurant(null)
      fetchRestaurants()
    } catch (err) {
      setError(err.message || 'Failed to delete restaurant')
    } finally {
      setDeleting(false)
    }
  }

  const getCityName = (cityId) => {
    const city = cities.find((c) => c.id === cityId)
    return city?.name || '-'
  }

  const priceRangeLabels = { 1: '$', 2: '$$', 3: '$$$', 4: '$$$$' }

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
          <h2 className="text-2xl font-bold text-slate-800">Restaurants Management</h2>
          <p className="text-slate-500 mt-1">Manage all restaurants</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
        >
          + Add Restaurant
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <input
          type="text"
          placeholder="Search restaurants by name, cuisine, or address..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
          <button onClick={() => setError(null)} className="ml-2 underline">Dismiss</button>
        </div>
      )}

      {/* Restaurants Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-slate-500 border-b border-slate-100 bg-slate-50">
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Cuisine</th>
              <th className="px-6 py-3 font-medium">City</th>
              <th className="px-6 py-3 font-medium">Address</th>
              <th className="px-6 py-3 font-medium">Price</th>
              <th className="px-6 py-3 font-medium">Phone</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRestaurants.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-slate-500">
                  No restaurants found
                </td>
              </tr>
            ) : (
              filteredRestaurants.map((restaurant, index) => (
                <tr key={restaurant.restaurant_id || restaurant.id} className={`border-b border-slate-50 ${index % 2 === 0 ? '' : 'bg-slate-50/50'}`}>
                  <td className="px-6 py-4">
                    <span className="font-medium text-slate-800">{restaurant.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs font-medium">
                      {restaurant.cuisine}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-sm">{getCityName(restaurant.city_id)}</td>
                  <td className="px-6 py-4 text-slate-600 text-sm max-w-[200px] truncate">{restaurant.address || '-'}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-800">{priceRangeLabels[restaurant.price_range] || '$$'}</td>
                  <td className="px-6 py-4 text-slate-600 text-sm">{restaurant.phone || '-'}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => openViewModal(restaurant)}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm mr-3"
                    >
                      View
                    </button>
                    <button
                      onClick={() => openEditModal(restaurant)}
                      className="text-teal-600 hover:text-teal-700 font-medium text-sm mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(restaurant)}
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
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-800">
                {editingRestaurant ? 'Edit Restaurant' : 'Add New Restaurant'}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {formErrors.submit && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  {formErrors.submit}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                      formErrors.name ? 'border-red-500' : 'border-slate-300'
                    }`}
                    placeholder="Restaurant name"
                  />
                  {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">City *</label>
                  <select
                    value={form.city_id}
                    onChange={(e) => setForm({ ...form, city_id: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                      formErrors.city_id ? 'border-red-500' : 'border-slate-300'
                    }`}
                  >
                    <option value="">Select city</option>
                    {cities.map((city) => (
                      <option key={city.city_id || city.id} value={city.city_id || city.id}>{city.name}</option>
                    ))}
                  </select>
                  {formErrors.city_id && <p className="mt-1 text-sm text-red-600">{formErrors.city_id}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Cuisine *</label>
                  <input
                    type="text"
                    value={form.cuisine}
                    onChange={(e) => setForm({ ...form, cuisine: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                      formErrors.cuisine ? 'border-red-500' : 'border-slate-300'
                    }`}
                    placeholder="e.g., Italian, Moroccan"
                  />
                  {formErrors.cuisine && <p className="mt-1 text-sm text-red-600">{formErrors.cuisine}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Price Range</label>
                  <select
                    value={form.price_range}
                    onChange={(e) => setForm({ ...form, price_range: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value={1}>$ (Budget)</option>
                    <option value={2}>$$ (Moderate)</option>
                    <option value={3}>$$$ (Upscale)</option>
                    <option value={4}>$$$$ (Fine Dining)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Street address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="+212 600 000 000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Restaurant description..."
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
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingRestaurant ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && viewingRestaurant && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">Restaurant Details</h3>
              <button onClick={() => setShowViewModal(false)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide">Name</label>
                  <p className="text-slate-800 font-medium">{viewingRestaurant.name}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide">Cuisine</label>
                  <p className="text-slate-800">{viewingRestaurant.cuisine}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide">City</label>
                  <p className="text-slate-800">{getCityName(viewingRestaurant.city_id)}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide">Price Range</label>
                  <p className="text-slate-800">{priceRangeLabels[viewingRestaurant.price_range] || '$$'}</p>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide">Address</label>
                <p className="text-slate-800">{viewingRestaurant.address || '-'}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide">Phone</label>
                <p className="text-slate-800">{viewingRestaurant.phone || '-'}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide">Description</label>
                <p className="text-slate-800">{viewingRestaurant.description || '-'}</p>
              </div>
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
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
              <h3 className="text-lg font-bold text-slate-800 mb-2">Delete Restaurant</h3>
              <p className="text-slate-500 mb-6">
                Are you sure you want to delete <strong>{deletingRestaurant?.name}</strong>? This action cannot be undone.
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
