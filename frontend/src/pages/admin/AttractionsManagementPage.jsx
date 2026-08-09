import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAttractions, createAttraction, updateAttraction, deleteAttraction } from '../../services/attractionService'
import Skeleton from '../../components/ui/Skeleton'

const emptyForm = { name: '', description: '', address: '', opening_hours: '', city_id: '' }

export default function AttractionsManagementPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const queryClient = useQueryClient()

  const filters = {
    city_id: searchParams.get('city_id') || '',
    // category: searchParams.get('category') || '',
    // min_price: searchParams.get('min_price') || '',
    // max_price: searchParams.get('max_price') || '',
    min_rating: searchParams.get('min_rating') || '',
    search: searchParams.get('search') || '',
  }

  const [localSearch, setLocalSearch] = useState(filters.search)

  const [showModal, setShowModal] = useState(false)
  const [editingAttraction, setEditingAttraction] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [formErrors, setFormErrors] = useState({})

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingAttraction, setDeletingAttraction] = useState(null)

  const { data: response, isLoading, error } = useQuery({
    queryKey: ['attractions', filters],
    queryFn: () => getAttractions(filters),
  })

  const attractions = response || []

  const createMutation = useMutation({
    mutationFn: createAttraction,
    onSuccess: () => {
      queryClient.invalidateQueries(['attractions'])
      setShowModal(false)
      setForm(emptyForm)
    },
    onError: (err) => {
      setFormErrors(err.data?.errors || { submit: err.message || 'Failed to create attraction' })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateAttraction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['attractions'])
      setShowModal(false)
      setEditingAttraction(null)
      setForm(emptyForm)
    },
    onError: (err) => {
      setFormErrors(err.data?.errors || { submit: err.message || 'Failed to update attraction' })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteAttraction,
    onSuccess: () => {
      queryClient.invalidateQueries(['attractions'])
      setShowDeleteModal(false)
      setDeletingAttraction(null)
    },
    onError: (err) => {
      alert(err.message || 'Failed to delete attraction')
    },
  })

  const updateFilter = useCallback((key, value) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (value) {
        next.set(key, value)
      } else {
        next.delete(key)
      }
      return next
    })
  }, [setSearchParams])

  useEffect(() => {
    const timer = setTimeout(() => {
      updateFilter('search', localSearch)
    }, 300)
    return () => clearTimeout(timer)
  }, [localSearch, updateFilter])

  const clearFilters = () => {
    setSearchParams({})
    setLocalSearch('')
  }

  const openCreateModal = () => {
    setEditingAttraction(null)
    setForm(emptyForm)
    setFormErrors({})
    setShowModal(true)
  }

  const openEditModal = (attraction) => {
    setEditingAttraction(attraction)
    setForm({
      name: attraction.name || '',
      description: attraction.description || '',
      address: attraction.address || '',
      opening_hours: attraction.opening_hours || '',
      city_id: attraction.city_id || '',
    })
    setFormErrors({})
    setShowModal(true)
  }

  const openDeleteModal = (attraction) => {
    setDeletingAttraction(attraction)
    setShowDeleteModal(true)
  }

  const validateForm = () => {
    const errors = {}
    if (!form.name.trim()) errors.name = 'Name is required'
    if (!form.city_id) errors.city_id = 'City is required'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) return

    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      address: form.address.trim() || null,
      opening_hours: form.opening_hours.trim() || null,
      city_id: form.city_id,
    }

    if (editingAttraction) {
      updateMutation.mutate({ id: editingAttraction.id, data: payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  const handleDelete = () => {
    if (!deletingAttraction) return
    deleteMutation.mutate(deletingAttraction.id)
  }

  const hasActiveFilters = Object.values(filters).some((v) => v)
  const isSubmitting = createMutation.isPending || updateMutation.isPending

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
          <h2 className="text-2xl font-bold text-slate-800">Attractions Management</h2>
          <p className="text-slate-500 mt-1">Manage all attractions in the platform</p>
        </div>
        <div className="flex gap-3">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors font-medium"
            >
              Clear Filters
            </button>
          )}
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
          >
            Add New Attraction
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error.message || 'Failed to load attractions'}
        </div>
      )}

      <div className="flex gap-6">
        {/* Filter Sidebar */}
        <div className="w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm p-4 space-y-4">
            <h3 className="font-semibold text-slate-800">Filters</h3>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Search</label>
              <input
                type="text"
                placeholder="Search attractions..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">City ID</label>
              <input
                type="text"
                placeholder="Filter by city"
                value={filters.city_id}
                onChange={(e) => updateFilter('city_id', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>

            {/* <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <input
                type="text"
                placeholder="Filter by category"
                value={filters.category}
                onChange={(e) => updateFilter('category', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div> */}

            {/* <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Price Range</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.min_price}
                  onChange={(e) => updateFilter('min_price', e.target.value)}
                  className="w-1/2 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.max_price}
                  onChange={(e) => updateFilter('max_price', e.target.value)}
                  className="w-1/2 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                />
              </div>
            </div> */}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Min Rating</label>
              <input
                type="number"
                placeholder="0-5"
                min="0"
                max="5"
                step="0.5"
                value={filters.min_rating}
                onChange={(e) => updateFilter('min_rating', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Attractions Table */}
        <div className="flex-1 bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-slate-500 border-b border-slate-100 bg-slate-50">
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">City</th>
                <th className="px-6 py-3 font-medium">Rating</th>
                <th className="px-6 py-3 font-medium">Opening Hours</th>
                <th className="px-6 py-3 font-medium">Address</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {attractions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    No attractions found
                  </td>
                </tr>
              ) : (
                attractions.map((attraction, index) => (
                  <tr key={attraction.id} className={`border-b border-slate-50 ${index % 2 === 0 ? '' : 'bg-slate-50/50'}`}>
                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-800">{attraction.name}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{attraction.city?.name || 'N/A'}</td>
                    <td className="px-6 py-4">
                      {attraction.average_rating ? (
                        <span className="inline-flex items-center gap-1">
                          <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-sm font-medium text-slate-600">{attraction.average_rating}</span>
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{attraction.opening_hours || '-'}</td>
                    <td className="px-6 py-4 text-slate-600 text-sm max-w-xs truncate">{attraction.address || '-'}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openEditModal(attraction)}
                        className="text-teal-600 hover:text-teal-700 font-medium text-sm mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(attraction)}
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
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-800">
                {editingAttraction ? 'Edit Attraction' : 'Add New Attraction'}
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
                  placeholder="Enter attraction name"
                />
                {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">City ID *</label>
                <input
                  type="number"
                  value={form.city_id}
                  onChange={(e) => setForm({ ...form, city_id: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    formErrors.city_id ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="Enter city ID"
                />
                {formErrors.city_id && <p className="mt-1 text-sm text-red-600">{formErrors.city_id}</p>}
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
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter address (optional)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Opening Hours</label>
                <input
                  type="text"
                  value={form.opening_hours}
                  onChange={(e) => setForm({ ...form, opening_hours: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g. 9:00 AM - 6:00 PM"
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
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : editingAttraction ? 'Update' : 'Create'}
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
              <h3 className="text-lg font-bold text-slate-800 mb-2">Delete Attraction</h3>
              <p className="text-slate-500 mb-6">
                Are you sure you want to delete <strong>{deletingAttraction?.name}</strong>? This action cannot be undone.
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
                  disabled={deleteMutation.isPending}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
                >
                  {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
