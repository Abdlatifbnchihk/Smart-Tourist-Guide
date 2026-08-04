import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import * as authService from '../../services/authService'
import InputField from '../../components/ui/InputField'
import Button from '../../components/ui/Button'

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [success, setSuccess] = useState('')
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [profileData, setProfileData] = useState(null)

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  })

  const [driverForm, setDriverForm] = useState({
    license_number: '',
    years_of_experience: '',
    languages: '',
    available: true,
  })

  useEffect(() => {
    loadProfile()
  }, [])

  async function loadProfile() {
    try {
      const data = await authService.getProfile()
      setProfileData(data.data || data)
    } catch {
      // fallback to auth user
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => {
    const userData = profileData || user
    if (userData) {
      setForm({
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        email: userData.email || '',
        phone: userData.phone || '',
      })
      if (userData.driver) {
        setDriverForm({
          license_number: userData.driver.license_number || '',
          years_of_experience: userData.driver.years_of_experience || '',
          languages: userData.driver.languages || '',
          available: userData.driver.available ?? true,
        })
      }
    }
  }, [profileData, user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleDriverChange = (e) => {
    const { name, value, type, checked } = e.target
    setDriverForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    setSuccess('')

    setLoading(true)
    try {
      await authService.updateProfile(form)
      await updateUser()
      setSuccess('Profile updated successfully!')
    } catch (err) {
      if (err.data?.errors) {
        const apiErrors = {}
        Object.entries(err.data.errors).forEach(([key, messages]) => {
          apiErrors[key] = messages[0]
        })
        setErrors(apiErrors)
      } else {
        setServerError(err.message || 'Failed to update profile.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDriverSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    setSuccess('')

    setLoading(true)
    try {
      await authService.updateDriverProfile(driverForm)
      await updateUser()
      setSuccess('Driver profile updated successfully!')
    } catch (err) {
      if (err.data?.errors) {
        const apiErrors = {}
        Object.entries(err.data.errors).forEach(([key, messages]) => {
          apiErrors[key] = messages[0]
        })
        setErrors(apiErrors)
      } else {
        setServerError(err.message || 'Failed to update driver profile.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
        My Profile
      </h1>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-teal-600">
              {(profileData?.first_name || user?.first_name)?.[0]}{(profileData?.last_name || user?.last_name)?.[0]}
            </span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-800">{profileData?.first_name || user?.first_name} {profileData?.last_name || user?.last_name}</h2>
            <p className="text-slate-500 text-sm">{profileData?.email || user?.email}</p>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="px-4 py-2 bg-slate-100 rounded-lg">
            <span className="text-xs text-slate-500 block">Role</span>
            <span className="text-sm font-medium text-slate-800">{(profileData?.role || user?.role || '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
          </div>
          <div className="px-4 py-2 bg-slate-100 rounded-lg">
            <span className="text-xs text-slate-500 block">Status</span>
            <span className="text-sm font-medium text-slate-800">{profileData?.status || user?.status}</span>
          </div>
        </div>

        {serverError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
            {serverError}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-700">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <InputField
                label="First Name"
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                error={errors.first_name}
              />
            </div>
            <div className="flex-1">
              <InputField
                label="Last Name"
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                error={errors.last_name}
              />
            </div>
          </div>

          <InputField
            label="Email Address"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
          />

          <InputField
            label="Phone Number"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            error={errors.phone}
          />

          <div className="flex justify-end">
            <Button type="submit" loading={loading} className="w-auto px-6">
              Save Changes
            </Button>
          </div>
        </form>
      </div>

      {(profileData?.role || user?.role) === 'driver' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Driver Profile</h3>
          <form onSubmit={handleDriverSubmit} className="space-y-4">
            <InputField
              label="License Number"
              name="license_number"
              value={driverForm.license_number}
              onChange={handleDriverChange}
            />
            <InputField
              label="Years of Experience"
              name="years_of_experience"
              type="number"
              value={driverForm.years_of_experience}
              onChange={handleDriverChange}
            />
            <InputField
              label="Languages"
              name="languages"
              placeholder="e.g. Arabic, French, English"
              value={driverForm.languages}
              onChange={handleDriverChange}
            />
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="available"
                checked={driverForm.available}
                onChange={handleDriverChange}
                className="h-4 w-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
              />
              <label className="text-sm text-slate-700">Available for bookings</label>
            </div>
            <div className="flex justify-end">
              <Button type="submit" loading={loading} className="w-auto px-6">
                Save Driver Profile
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
