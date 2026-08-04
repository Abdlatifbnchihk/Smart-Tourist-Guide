import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from '../../components/auth/AuthLayout'
import InputField from '../../components/ui/InputField'
import Button from '../../components/ui/Button'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!email.trim()) {
      setError('Email is required')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email')
      return
    }

    setSubmitted(true)
  }

  return (
    <AuthLayout>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Forgot Password?
        </h2>
        <p className="text-slate-500 mt-1">
          Enter your email and we&apos;ll send you a reset link
        </p>
      </div>

      {submitted ? (
        <div className="text-center">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Check your email</h3>
          <p className="text-slate-500 text-sm mb-6">
            Password reset feature coming soon. We&apos;ll notify you when it&apos;s ready.
          </p>
          <Link
            to="/login"
            className="inline-block text-teal-600 font-medium hover:underline"
          >
            Back to Sign In
          </Link>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              label="Email Address"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (error) setError('')
              }}
              error={error}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
            />

            <Button type="submit">Send Reset Link</Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            <Link to="/login" className="text-teal-600 font-medium hover:underline">
              Back to Sign In
            </Link>
          </p>
        </>
      )}
    </AuthLayout>
  )
}
