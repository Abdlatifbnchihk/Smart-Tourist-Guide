import { useState, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { createHotelBooking } from '../../services/bookingService'

export default function HotelBookingCheckout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { room, hotel } = location.state || {}

  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(1)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(null)

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const diff = (end - start) / (1000 * 60 * 60 * 24)
    return diff > 0 ? diff : 0
  }, [checkIn, checkOut])

  const totalPrice = useMemo(() => {
    return room ? (room.price_per_night * nights).toFixed(2) : 0
  }, [room, nights])

  const mutation = useMutation({
    mutationFn: createHotelBooking,
    onSuccess: (data) => {
      setSuccess(data.data || data)
    },
    onError: (err) => {
      setError(err.message || 'Failed to create booking')
    },
  })

  if (!room || !hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">No room selected</h2>
          <p className="text-slate-600 mb-4">Please select a room first.</p>
          <button
            onClick={() => navigate('/cities')}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            Browse Hotels
          </button>
        </div>
      </div>
    )
  }

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
  const minCheckOut = checkIn ? new Date(new Date(checkIn).getTime() + 86400000).toISOString().split('T')[0] : ''

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!checkIn || !checkOut) {
      setError('Please select check-in and check-out dates')
      return
    }
    if (nights <= 0) {
      setError('Check-out date must be after check-in date')
      return
    }

    mutation.mutate({
      room_id: room.room_id || room.id,
      start_date: checkIn,
      end_date: checkOut,
    })
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="text-teal-600 hover:text-teal-700 flex items-center gap-2 mb-6"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <h1 className="text-3xl font-bold text-slate-800 mb-8">Hotel Booking Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Room Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Room Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-slate-600">
                  <span>Hotel</span>
                  <span className="font-medium text-slate-800">{hotel.name}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Room Type</span>
                  <span className="font-medium text-slate-800 capitalize">{room.type}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Room Number</span>
                  <span className="font-medium text-slate-800">{room.number}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Capacity</span>
                  <span className="font-medium text-slate-800">{room.capacity} guests</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Price per Night</span>
                  <span className="font-medium text-slate-800">${room.price_per_night}</span>
                </div>
              </div>

              {nights > 0 && (
                <div className="border-t mt-4 pt-4">
                  <div className="flex justify-between text-slate-600 mb-2">
                    <span>${room.price_per_night} x {nights} nights</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-slate-800">
                    <span>Total</span>
                    <span className="text-teal-600">${totalPrice}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-6">Booking Details</h2>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 mb-4">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Check-in Date *</label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    min={today}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Check-out Date *</label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    min={minCheckOut}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Number of Guests</label>
                <input
                  type="number"
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                  min={1}
                  max={room.capacity}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <p className="mt-1 text-sm text-slate-500">Max {room.capacity} guests</p>
              </div>

              {nights > 0 && (
                <div className="bg-slate-50 rounded-lg p-4 mb-6">
                  <div className="flex justify-between text-slate-600 mb-2">
                    <span>Check-in</span>
                    <span>{new Date(checkIn).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 mb-2">
                    <span>Check-out</span>
                    <span>{new Date(checkOut).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 mb-2">
                    <span>Duration</span>
                    <span>{nights} nights</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between text-lg font-bold text-slate-800">
                      <span>Total Price</span>
                      <span className="text-teal-600">${totalPrice}</span>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={mutation.isPending || nights <= 0}
                className="w-full py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {mutation.isPending ? 'Confirming Booking...' : 'Confirm Booking'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
