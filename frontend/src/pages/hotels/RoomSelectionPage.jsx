import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getRooms } from '../../services/hotelService'

export default function RoomSelectionPage() {
  const { hotelId } = useParams()
  const navigate = useNavigate()

  const [filters, setFilters] = useState({
    room_type: '',
    availability: '',
    min_price: '',
    max_price: '',
  })

  const { data: rooms, isLoading, error } = useQuery({
    queryKey: ['rooms', hotelId, filters],
    queryFn: () => getRooms(hotelId, filters),
  })

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleSelectRoom = (room) => {
    if (!room.available) return
    navigate(`/checkout?hotelId=${hotelId}&roomId=${room.id}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Error loading rooms</h2>
          <p className="text-slate-600">{error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6">
          <button
            onClick={() => navigate(`/hotels/${hotelId}`)}
            className="text-teal-600 hover:text-teal-700 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Hotel
          </button>
        </div>

        <h1 className="text-3xl font-bold text-slate-800 mb-8">Select a Room</h1>

        <div className="bg-white rounded-xl p-6 mb-8 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Filter Rooms</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Room Type</label>
              <select
                value={filters.room_type}
                onChange={(e) => handleFilterChange('room_type', e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="single">Single</option>
                <option value="double">Double</option>
                <option value="suite">Suite</option>
                <option value="family">Family</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Availability</label>
              <select
                value={filters.availability}
                onChange={(e) => handleFilterChange('availability', e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="">All</option>
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Min Price</label>
              <input
                type="number"
                value={filters.min_price}
                onChange={(e) => handleFilterChange('min_price', e.target.value)}
                placeholder="$0"
                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Max Price</label>
              <input
                type="number"
                value={filters.max_price}
                onChange={(e) => handleFilterChange('max_price', e.target.value)}
                placeholder="$999"
                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms?.map((room) => (
            <div
              key={room.id}
              className={`bg-white rounded-xl shadow-sm overflow-hidden transition-all ${
                room.available
                  ? 'hover:shadow-md cursor-pointer'
                  : 'opacity-60 cursor-not-allowed'
              }`}
              onClick={() => handleSelectRoom(room)}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-bold text-slate-800">Room {room.number}</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      room.available
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {room.available ? 'Available' : 'Unavailable'}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-slate-600">
                    <span>Type</span>
                    <span className="font-medium capitalize">{room.type}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Capacity</span>
                    <span className="font-medium">{room.capacity} guests</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-teal-600">${room.price_per_night}</span>
                    <span className="text-slate-500">/ night</span>
                  </div>
                </div>

                {room.available && (
                  <button
                    className="w-full mt-4 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    Select Room
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {rooms?.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-slate-800 mb-2">No rooms found</h3>
            <p className="text-slate-600">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
