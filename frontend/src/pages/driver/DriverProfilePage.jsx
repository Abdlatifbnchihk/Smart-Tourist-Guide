import { useState, useEffect } from 'react'
import { useDriver } from '../../context/DriverContext'
import { updateDriverProfile } from '../../services/driverService'
import Skeleton from '../../components/ui/Skeleton'

export default function DriverProfilePage() {
  const { driver, updateDriverData } = useDriver()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    license_number: '',
    years_of_experience: '',
    languages: '',
    available: true,
  })

  useEffect(() => {
    if (driver) {
      setFormData({
        license_number: driver.license_number || '',
        years_of_experience: driver.years_of_experience || '',
        languages: Array.isArray(driver.languages) ? driver.languages.join(', ') : (driver.languages || ''),
        available: driver.available ?? true,
      })
      setLoading(false)
    }
  }, [driver])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess('')

    try {
      const payload = {
        ...formData,
        years_of_experience: parseInt(formData.years_of_experience) || 0,
      }

      const res = await updateDriverProfile(driver.id, payload)
      const updatedDriver = res.data || res
      updateDriverData(updatedDriver)
      setSuccess('Profile updated successfully!')
    } catch (err) {
      console.error('Profile update failed:', err)
      setError(err.response?.data?.message || 'Failed to update profile.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-48 rounded-lg" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Edit Profile</h1>
        <p className="text-slate-500">Update your driver profile information</p>
      </div>

      {/* Profile Form */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              {success}
            </div>
          )}

          {/* Driver Info (Read-only) */}
          <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-sm text-slate-500 mb-1">Driver ID</p>
            <p className="font-medium text-slate-800">#{driver?.id}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">License Number *</label>
            <input
              type="text"
              value={formData.license_number}
              onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Years of Experience *</label>
            <input
              type="number"
              min="0"
              value={formData.years_of_experience}
              onChange={(e) => setFormData({ ...formData, years_of_experience: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Languages</label>
            <input
              type="text"
              value={formData.languages}
              onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
              placeholder="e.g. English, Spanish, French"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-slate-500 mt-1">Separate languages with commas</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Available for Bookings</label>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, available: !formData.available })}
              className={`px-4 py-2 rounded-lg font-medium transition-colors border ${
                formData.available
                  ? 'border-green-300 bg-green-50 text-green-700'
                  : 'border-slate-300 bg-slate-50 text-slate-600'
              }`}
            >
              {formData.available ? 'Available' : 'Unavailable'}
            </button>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
