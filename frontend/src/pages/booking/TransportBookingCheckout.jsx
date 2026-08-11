import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { getDrivers, createTransportBooking } from '../../services/bookingService'

export default function TransportBookingCheckout() {
  const navigate = useNavigate()

  const [selectedDriver, setSelectedDriver] = useState(null)
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [distance, setDistance] = useState('')
  const [pickupDate, setPickupDate] = useState('')
  const [dropoffDate, setDropoffDate] = useState('')
  const [bookingType, setBookingType] = useState('Hotel + Driver')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(null)

  const { data: driversResponse, isLoading: driversLoading, error: driversError } = useQuery({
    queryKey: ['drivers'],
    queryFn: () => getDrivers(),
  })

  const drivers = Array.isArray(driversResponse) ? driversResponse : driversResponse?.data || []

  const priceEstimate = useMemo(() => {
    if (!selectedVehicle || !distance) return 0
    return (selectedVehicle.price_per_km * parseFloat(distance)).toFixed(2)
  }, [selectedVehicle, distance])

  const mutation = useMutation({
    mutationFn: createTransportBooking,
    onSuccess: (data) => {
      setSuccess(data.data || data)
    },
    onError: (err) => {
      setError(err.message || 'Failed to create booking')
    },
  })

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Booking Confirmed!</h2>
          <p className="text-slate-600 mb-4">Your booking number is:</p>
          <p className="text-xl font-bold text-teal-600 mb-6">{success.booking_number}</p>
          <button
            onClick={() => navigate('/profile')}
            className="w-full py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors"
          >
            View My Bookings
          </button>
        </div>
      </div>
    )
  }

  const today = new Date().toISOString().split('T')[0]

  const handleDriverSelect = (driver) => {
    setSelectedDriver(driver)
    setSelectedVehicle(driver.vehicles?.[0] || null)
  }

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!selectedDriver || !selectedVehicle) {
      setError('Please select a driver and vehicle')
      return
    }
    if (!distance || parseFloat(distance) <= 0) {
      setError('Please enter a valid distance')
      return
    }
    if (!pickupDate || !dropoffDate) {
      setError('Please select pickup and dropoff dates')
      return
    }
    if (new Date(dropoffDate) <= new Date(pickupDate)) {
      setError('Dropoff date must be after pickup date')
      return
    }

    mutation.mutate({
      driver_id: selectedDriver.id,
      vehicle_id: selectedVehicle.vehicle_id,
      distance_km: parseFloat(distance),
      booking_type: bookingType,
      start_date: pickupDate,
      end_date: dropoffDate,
    })
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="text-teal-600 hover:text-teal-700 flex items-center gap-2 mb-6"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <h1 className="text-3xl font-bold text-slate-800 mb-8">Transport Booking Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 mb-4">
                  {error}
                </div>
              )}

              {/* Driver Selection */}
              <div className="mb-6">
                <h2 className="text-lg font-bold text-slate-800 mb-4">Select Driver</h2>
                {driversLoading ? (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  </div>
                ) : driversError ? (
                  <p className="text-red-500 text-center py-8">Error loading drivers: {driversError.message}</p>
                ) : drivers.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">No drivers available</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {drivers.map((driver) => (
                      <div
                        key={driver.id}
                        onClick={() => handleDriverSelect(driver)}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedDriver?.id === driver.id
                            ? 'border-teal-500 bg-teal-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-slate-800">{driver.user ? `${driver.user.first_name} ${driver.user.last_name}` : 'Driver'}</span>
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-sm text-slate-600">{driver.rating || '0.0'}</span>
                          </div>
                        </div>
                        <p className="text-sm text-slate-500">{driver.license_number}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Vehicle Selection */}
              {selectedDriver && selectedDriver.vehicles?.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-slate-800 mb-4">Select Vehicle</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedDriver.vehicles.map((vehicle) => (
                      <div
                        key={vehicle.vehicle_id}
                        onClick={() => handleVehicleSelect(vehicle)}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedVehicle?.vehicle_id === vehicle.vehicle_id
                            ? 'border-teal-500 bg-teal-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-slate-800">{vehicle.brand} {vehicle.model}</span>
                          <span className="text-sm text-slate-500 capitalize">{vehicle.type}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span>{vehicle.seats} seats</span>
                          {vehicle.air_conditioning && <span>AC</span>}
                          <span className="font-medium text-teal-600">${vehicle.price_per_km}/km</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Distance Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Distance (km) *</label>
                <input
                  type="number"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  min="0.1"
                  step="0.1"
                  placeholder="Enter distance in kilometers"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Date Pickers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Pickup Date *</label>
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    min={today}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Dropoff Date *</label>
                  <input
                    type="date"
                    value={dropoffDate}
                    onChange={(e) => setDropoffDate(e.target.value)}
                    min={pickupDate || today}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Booking Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Booking Type *</label>
                <select
                  value={bookingType}
                  onChange={(e) => setBookingType(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Hotel + Driver">Hotel + Driver</option>
                  <option value="Airport Transfer">Airport Transfer</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={mutation.isPending}
                className="w-full py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
              >
                {mutation.isPending ? 'Confirming Booking...' : 'Confirm Booking'}
              </button>
            </form>
          </div>

          {/* Price Estimate */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Price Estimate</h2>

              {selectedVehicle && (
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-slate-600">
                    <span>Vehicle</span>
                    <span className="font-medium text-slate-800">{selectedVehicle.brand} {selectedVehicle.model}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Price per km</span>
                    <span className="font-medium text-slate-800">${selectedVehicle.price_per_km}</span>
                  </div>
                </div>
              )}

              {distance && selectedVehicle && (
                <div className="border-t pt-4">
                  <div className="flex justify-between text-slate-600 mb-2">
                    <span>${selectedVehicle.price_per_km} x {distance} km</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-slate-800">
                    <span>Estimated Total</span>
                    <span className="text-teal-600">${priceEstimate}</span>
                  </div>
                </div>
              )}

              {!selectedVehicle && (
                <p className="text-slate-500 text-sm">Select a driver and vehicle to see price estimate</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
