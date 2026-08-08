import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { getDriverProfile } from '../services/driverService'

const DriverContext = createContext(null)

export function DriverProvider({ children }) {
  const { user } = useAuth()
  const [driver, setDriver] = useState(null)
  const [driverId, setDriverId] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user && user.role === 'driver') {
      fetchDriverProfile()
    } else {
      setLoading(false)
    }
  }, [user])

  async function fetchDriverProfile() {
    try {
      const res = await getDriverProfile(user.id)
      const drivers = res.data || []
      if (drivers.length > 0) {
        const driverData = drivers[0]
        setDriver(driverData)
        setDriverId(driverData.id)
      }
    } catch (err) {
      console.error('Failed to load driver profile:', err)
    } finally {
      setLoading(false)
    }
  }

  function updateDriverData(data) {
    setDriver(data)
  }

  return (
    <DriverContext.Provider value={{ driver, driverId, loading, updateDriverData, fetchDriverProfile }}>
      {children}
    </DriverContext.Provider>
  )
}

export function useDriver() {
  const context = useContext(DriverContext)
  if (!context) {
    throw new Error('useDriver must be used within a DriverProvider')
  }
  return context
}
