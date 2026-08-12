import { useState, useEffect } from 'react'
import apiClient, { extractData } from '../../services/apiClient'
import Skeleton from '../../components/ui/Skeleton'

const emptyForm = { name: '', region: '', description: '' }

export default function CitiesManagementPage() {
  const [cities, setCities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const [showModal, setShowModal] = useState(false)
  const [editingCity, setEditingCity] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [formErrors, setFormErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingCity, setDeletingCity] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchCities()
  }, [])

  const fetchCities = async () => {
    try {
      const res = await apiClient.get('/cities')
      setCities(extractData(res))
    } catch (err) {
      setError('Failed to load cities.')
    } finally {
      setLoading(false)
    }
  }

  const filteredCities = cities.filter((city) =>
    city.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.region?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const openCreateModal = () => {
    setEditingCity(null)
    setForm(emptyForm)
    setFormErrors({})
    setShowModal(true)
  }

  const openEditModal = (city) => {
    setEditingCity(city)
    setForm({ name: city.name, region: city.region, description: city.description || '' })
    setFormErrors({})
    setShowModal(true)
  }

  const openDeleteModal = (city) => {
    setDeletingCity(city)
    setShowDeleteModal(true)
  }

  const validateForm = () => {
    const errors = {}
    if (!form.name.trim()) errors.name = 'Name is required'
    if (!form.region.trim()) errors.region = 'Region is required'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setSubmitting(true)
    try {
      if (editingCity) {
        await apiClient.put(`/cities/${editingCity.city_id}`, form)
      } else {
        await apiClient.post('/cities', form)
      }
      setShowModal(false)
      fetchCities()
    } catch (err) {
      setFormErrors({ submit: err.message || 'Failed to save city' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingCity) return

    setDeleting(true)
    try {
      await apiClient.delete(`/cities/${deletingCity.city_id}`)
      setShowDeleteModal(false)
      setDeletingCity(null)
      fetchCities()
    } catch (err) {
      setError(err.message || 'Failed to delete city')
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
          <h2 className="text-2xl font-bold text-slate-800">Cities Management</h2>
          <p className="text-slate-500 mt-1">Manage all cities in the platform</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
        >
          Add New City
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <input
          type="text"
          placeholder="Search cities..."
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

      {/* Cities Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-slate-500 border-b border-slate-100 bg-slate-50">
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Region</th>
              <th className="px-6 py-3 font-medium">Hotels</th>
              <th className="px-6 py-3 font-medium">Attractions</th>
              <th className="px-6 py-3 font-medium">Restaurants</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCities.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                  No cities found
                </td>
              </tr>
            ) : (
              filteredCities.map((city, index) => (
                <tr key={city.city_id} className={`border-b border-slate-50 ${index % 2 === 0 ? '' : 'bg-slate-50/50'}`}>
                  <td className="px-6 py-4">
                    <span className="font-medium text-slate-800">{city.name}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{city.region}</td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-sm font-medium">
                      {city.hotels_count || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-sm font-medium">
                      {city.attractions_count || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-sm font-medium">
                      {city.restaurants_count || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => openEditModal(city)}
                      className="text-teal-600 hover:text-teal-700 font-medium text-sm mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(city)}
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
                {editingCity ? 'Edit City' : 'Add New City'}
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
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    formErrors.name ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="Enter city name"
                />
                {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Region *</label>
                <input
                  type="text"
                  value={form.region}
                  onChange={(e) => setForm({ ...form, region: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    formErrors.region ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="Enter region name"
                />
                {formErrors.region && <p className="mt-1 text-sm text-red-600">{formErrors.region}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingCity ? 'Update' : 'Create'}
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
              <h3 className="text-lg font-bold text-slate-800 mb-2">Delete City</h3>
              <p className="text-slate-500 mb-6">
                Are you sure you want to delete <strong>{deletingCity?.name}</strong>? This action cannot be undone.
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
