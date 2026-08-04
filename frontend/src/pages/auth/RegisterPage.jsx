import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/auth/AuthLayout'
import InputField from '../../components/ui/InputField'
import PasswordField from '../../components/ui/PasswordField'
import Button from '../../components/ui/Button'
import { useAuth } from '../../context/AuthContext'

const cities = [
  { id: 1, name: 'Marrakech' },
  { id: 2, name: 'Fez' },
  { id: 3, name: 'Chefchaouen' },
  { id: 4, name: 'Tangier' },
  { id: 5, name: 'Agadir' },
  { id: 6, name: 'Casablanca' },
]

const roles = ['Tourist', 'Driver', 'Hotel Manager']

// Rejister endpoint
// const baseURL = 'http://127.0.0.1:8000/api/v1';

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [activeRole, setActiveRole] = useState('Tourist')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    terms: false,
    city_id: '',
    license_number: '',
    hotel_name: '',
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!form.first_name.trim()) newErrors.first_name = 'First name is required'
    if (!form.last_name.trim()) newErrors.last_name = 'Last name is required'

    if (!form.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!form.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    }

    if (!form.password) {
      newErrors.password = 'Password is required'
    } else if (form.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (form.password !== form.password_confirmation) {
      newErrors.password_confirmation = 'Passwords do not match'
    }

    if (!form.terms) {
      newErrors.terms = 'You must accept the terms'
    }

    if (activeRole === 'Driver') {
      if (!form.city_id) newErrors.city_id = 'City is required'
      if (!form.license_number.trim()) newErrors.license_number = 'License number is required'
    }

    if (activeRole === 'Hotel Manager') {
      if (!form.hotel_name.trim()) newErrors.hotel_name = 'Hotel name is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')

    if (!validate()) return

    setLoading(true)
    try {
      const roleMap = {
        'Tourist': 'tourist',
        'Driver': 'driver',
        'Hotel Manager': 'hotel_manager',
      }

      const payload = {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        password_confirmation: form.password_confirmation,
        role: roleMap[activeRole],
      }

      if (activeRole === 'Driver') {
        payload.city_id = form.city_id
        payload.license_number = form.license_number
      }

      if (activeRole === 'Hotel Manager') {
        payload.hotel_name = form.hotel_name
      }

      await register(payload)
      navigate('/')
    } catch (err) {
      console.error('Registration error:', err)
      if (err.data?.errors) {
        const apiErrors = {}
        Object.entries(err.data.errors).forEach(([key, messages]) => {
          apiErrors[key] = messages[0]
        })
        setErrors(apiErrors)
      } else if (err.data?.message) {
        setServerError(err.data.message)
      } else {
        setServerError(err.message || 'Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800" style={{ fontFamily: 'Poppins, sans-serif' }}>
          {activeRole === 'Tourist' && 'Create Tourist Account'}
          {activeRole === 'Driver' && 'Create Driver Account'}
          {activeRole === 'Hotel Manager' && 'Create Hotel Manager Account'}
        </h2>
        <p className="text-slate-500 mt-1">
          {activeRole === 'Tourist' && 'Start your Moroccan adventure today'}
          {activeRole === 'Driver' && 'Start offering transport services'}
          {activeRole === 'Hotel Manager' && 'Manage your hotel properties'}
        </p>
      </div>

      <div className="flex gap-2 mb-6">
        {roles.map((role) => (
          <button
            key={role}
            type="button"
            onClick={() => {
              setActiveRole(role)
              setErrors({})
              setServerError('')
            }}
            className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
              activeRole === role
                ? 'bg-teal-600 text-white'
                : 'border border-slate-300 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {role}
          </button>
        ))}
      </div>

      {serverError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <InputField
              label="First Name"
              name="first_name"
              placeholder="First Name"
              value={form.first_name}
              onChange={handleChange}
              error={errors.first_name}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
            />
          </div>
          <div className="flex-1">
            <InputField
              label="Last Name"
              name="last_name"
              placeholder="Last Name"
              value={form.last_name}
              onChange={handleChange}
              error={errors.last_name}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
            />
          </div>
        </div>

        <InputField
          label="Email Address"
          name="email"
          type="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
        />

        <InputField
          label="Phone Number"
          name="phone"
          type="tel"
          placeholder="+212 XXXXXXXXX"
          value={form.phone}
          onChange={handleChange}
          error={errors.phone}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          }
        />

        <PasswordField
          label="Password"
          name="password"
          placeholder="Create a password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
        />

        <PasswordField
          label="Confirm Password"
          name="password_confirmation"
          placeholder="Confirm your password"
          value={form.password_confirmation}
          onChange={handleChange}
          error={errors.password_confirmation}
        />

        {activeRole === 'Driver' && (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">City</label>
              <select
                name="city_id"
                value={form.city_id}
                onChange={handleChange}
                className={`w-full px-3 py-2.5 border rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors ${
                  errors.city_id ? 'border-red-500' : 'border-slate-300'
                }`}
              >
                <option value="">Select your city</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>{city.name}</option>
                ))}
              </select>
              {errors.city_id && <p className="mt-1 text-sm text-red-600">{errors.city_id}</p>}
            </div>

            <InputField
              label="License Number"
              name="license_number"
              placeholder="Enter your license number"
              value={form.license_number}
              onChange={handleChange}
              error={errors.license_number}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              }
            />
          </>
        )}

        {activeRole === 'Hotel Manager' && (
          <InputField
            label="Hotel Name"
            name="hotel_name"
            placeholder="Enter your hotel name"
            value={form.hotel_name}
            onChange={handleChange}
            error={errors.hotel_name}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
          />
        )}

        <div className="flex items-start">
          <input
            type="checkbox"
            name="terms"
            checked={form.terms}
            onChange={handleChange}
            className="mt-1 h-4 w-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
          />
          <label className="ml-2 text-sm text-slate-600">
            I agree to the{' '}
            <span className="text-teal-600 hover:underline cursor-pointer">Terms of Service</span>
            {' '}and{' '}
            <span className="text-teal-600 hover:underline cursor-pointer">Privacy Policy</span>
          </label>
        </div>
        {errors.terms && <p className="text-sm text-red-600">{errors.terms}</p>}

        <Button type="submit" loading={loading}>
          Create Account
        </Button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-slate-400">or</span>
          </div>
        </div>

        <button
          type="button"
          className="mt-4 w-full flex items-center justify-center px-4 py-2.5 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>
      </div>

      <p className="mt-6 text-center text-sm text-slate-600">
        Already have an account?{' '}
        <Link to="/login" className="text-teal-600 font-medium hover:underline">
          Sign In
        </Link>
      </p>
    </AuthLayout>
  )
}
