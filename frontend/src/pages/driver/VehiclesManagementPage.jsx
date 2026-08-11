import { useState, useEffect } from 'react'
import { useDriver } from '../../context/DriverContext'
import { getDriverVehicles, createVehicle, updateVehicle, deleteVehicle } from '../../services/driverService'
import Skeleton from '../../components/ui/Skeleton'
import { Link } from 'react-router-dom'

const vehicleTypes = ['sedan', 'suv', 'van', 'bus', 'motorcycle']
const seatOptions = [2, 4, 5, 6, 7, 8, 14, 20, 30]

const emptyVehicle = {
  brand: '',
  model: '',
  type: 'sedan',
  seats: 5,
  registration_number: '',
  air_conditioning: true,
  price_per_km: '',
}

export default function VehiclesManagementPage() {
  const { driver, loading: driverLoading } = useDriver()
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [showModal, setShowModal] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState(null)
  const [formData, setFormData] = useState({ ...emptyVehicle })
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [submitSuccess, setSubmitSuccess] = useState('')

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingVehicle, setDeletingVehicle] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (driver?.id) {
      fetchVehicles()
    } else if (!driverLoading) {
      setLoading(false)
    }
  }, [driver, driverLoading])

  const fetchVehicles = async () => {
    try {
      const res = await getDriverVehicles(driver.id)
      setVehicles(res.data || [])
    } catch (err) {
      console.error('Failed to load vehicles:', err)
      setError('Failed to load vehicles.')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenCreate = () => {
    setEditingVehicle(null)
    setFormData({ ...emptyVehicle })
    setSubmitError(null)
    setShowModal(true)
  }

  const handleOpenEdit = (vehicle) => {
    setEditingVehicle(vehicle)
    setFormData({
      brand: vehicle.brand,
      model: vehicle.model,
      type: vehicle.type,
      seats: vehicle.seats,
      registration_number: vehicle.registration_number,
      air_conditioning: vehicle.air_conditioning,
      price_per_km: vehicle.price_per_km,
    })
    setSubmitError(null)
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError(null)

    try {
      if (editingVehicle) {
        await updateVehicle(editingVehicle.vehicle_id, formData)
        setSubmitSuccess('Vehicle updated successfully!')
      } else {
        if (!driver?.id) {
          setSubmitError('Driver profile not loaded. Please try again.')
          return
        }
        await createVehicle(driver.id, formData)
        setSubmitSuccess('Vehicle created successfully!')
      }
      await fetchVehicles()
      setTimeout(() => {
        setShowModal(false)
        setSubmitSuccess('')
      }, 1500)
    } catch (err) {
      console.error('Submit error:', err)
      setSubmitError(err.response?.data?.message || 'Failed to save vehicle.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteClick = (vehicle) => {
    setDeletingVehicle(vehicle)
    setShowDeleteModal(true)
  }

  const handleDelete = async () => {
    if (!deletingVehicle) return
    setDeleting(true)

    try {
      await deleteVehicle(deletingVehicle.vehicle_id)
      setVehicles(vehicles.filter(v => v.vehicle_id !== deletingVehicle.vehicle_id))
      setShowDeleteModal(false)
      setDeletingVehicle(null)
    } catch (err) {
      console.error('Delete error:', err)
      setError(err.response?.data?.message || 'Failed to delete vehicle.')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-48 rounded-lg" />
        <Skeleton className="h-12 rounded-lg" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Vehicles</h1>
          <p className="text-slate-500">Manage your registered vehicles</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Vehicle
        </button>
      </div>

      {/* Vehicles Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-slate-500 border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-4 font-medium">Vehicle</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Seats</th>
                <th className="px-6 py-4 font-medium">Registration</th>
                <th className="px-6 py-4 font-medium">AC</th>
                <th className="px-6 py-4 font-medium">Price/km</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.length > 0 ? (
                vehicles.map((vehicle, index) => (
                  <tr key={vehicle.vehicle_id} className={`border-b border-slate-50 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} hover:bg-blue-50/30 transition-colors`}>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-800">{vehicle.brand} {vehicle.model}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 capitalize">{vehicle.type}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{vehicle.seats}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 font-mono">{vehicle.registration_number}</td>
                    <td className="px-6 py-4">
                      {vehicle.air_conditioning ? (
                        <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">Yes</span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">No</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-800">${vehicle.price_per_km}/km</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(vehicle)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(vehicle)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8m-8 4h8M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
                      </svg>
                      <p className="font-medium">No vehicles found</p>
                      <p className="text-sm">Add your first vehicle to get started.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">
                {editingVehicle ? 'Edit Vehicle' : 'Add Vehicle'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {submitError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {submitError}
                </div>
              )}
              {submitSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                  {submitSuccess}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Brand *</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Model *</label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {vehicleTypes.map((type) => (
                      <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Seats *</label>
                  <select
                    value={formData.seats}
                    onChange={(e) => setFormData({ ...formData, seats: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {seatOptions.map((num) => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Registration Number *</label>
                <input
                  type="text"
                  value={formData.registration_number}
                  onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Price per km ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price_per_km}
                    onChange={(e) => setFormData({ ...formData, price_per_km: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Air Conditioning</label>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, air_conditioning: !formData.air_conditioning })}
                    className={`w-full px-3 py-2 border rounded-lg font-medium transition-colors ${
                      formData.air_conditioning
                        ? 'border-green-300 bg-green-50 text-green-700'
                        : 'border-slate-300 bg-slate-50 text-slate-600'
                    }`}
                  >
                    {formData.air_conditioning ? 'Yes' : 'No'}
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
                >
                  {submitting ? 'Saving...' : editingVehicle ? 'Update Vehicle' : 'Create Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingVehicle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-800">Delete Vehicle</h2>
            </div>
            <div className="p-6">
              <p className="text-slate-600">
                Are you sure you want to delete <span className="font-semibold">{deletingVehicle.brand} {deletingVehicle.model}</span>?
                This action cannot be undone.
              </p>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => { setShowDeleteModal(false); setDeletingVehicle(null) }}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors font-medium"
              >
                {deleting ? 'Deleting...' : 'Delete Vehicle'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
