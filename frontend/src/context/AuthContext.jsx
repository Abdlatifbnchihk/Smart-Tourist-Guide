import { createContext, useContext, useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { getToken, setToken, removeToken } from '../services/apiClient'
import * as authService from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setTokenState] = useState(getToken())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      loadUser()
    } else {
      setLoading(false)
    }
  }, [])

  async function loadUser() {
    try {
      const data = await authService.getMe()
      setUser(data.user || data)
    } catch {
      setUser(null)
      setTokenState(null)
      removeToken()
    } finally {
      setLoading(false)
    }
  }

  async function login(email, password) {
    const data = await authService.login(email, password)
    const newToken = data.token
    setToken(newToken)
    setTokenState(newToken)
    await loadUser()
    return data
  }

  async function register(registrationData) {
    const data = await authService.register(registrationData)
    const newToken = data.token
    setToken(newToken)
    setTokenState(newToken)
    await loadUser()
    return data
  }

  async function logout() {
    try {
      await authService.logout()
    } finally {
      setUser(null)
      setTokenState(null)
      removeToken()
    }
  }

  async function updateUser() {
    await loadUser()
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

export function AdminRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.role !== 'administrator') {
    return <Navigate to="/" replace />
  }

  return children
}

export function TouristRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.role !== 'tourist') {
    return <Navigate to="/" replace />
  }

  return children
}
