import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../context/AuthContext'
import { getHotel, addFavorite, removeFavorite } from '../../services/hotelService'

export default function HotelDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: hotel, isLoading, error } = useQuery({
    queryKey: ['hotel', id],
    queryFn: () => getHotel(id),
  })

  const favoriteMutation = useMutation({
    mutationFn: () => hotel.is_favorite ? removeFavorite(id) : addFavorite(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['hotel', id])
    },
  })

  const handleBookNow = () => {
    navigate(`/hotels/${id}/rooms`)
  }

  const handleFavoriteToggle = () => {
    if (!user) {
      navigate('/login')
      return
    }
    favoriteMutation.mutate()
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
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Error loading hotel</h2>
          <p className="text-slate-600">{error.message}</p>
        </div>
      </div>
    )
  }

  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Hotel not found</h2>
        </div>
      </div>
    )
  }

  const averageRating = hotel.reviews?.length
    ? (hotel.reviews.reduce((sum, r) => sum + r.rating, 0) / hotel.reviews.length).toFixed(1)
    : null

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="relative h-96">
            <img
              src={hotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'}
              alt={hotel.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{hotel.name}</h1>
              <div className="flex items-center gap-4 text-white/90">
                <span className="flex items-center gap-1">
                  {'★'.repeat(hotel.stars)}
                </span>
                {averageRating && (
                  <span className="flex items-center gap-1">
                    <span className="bg-white/20 px-2 py-0.5 rounded">{averageRating}</span>
                    <span>({hotel.reviews.length} reviews)</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <h2 className="text-xl font-bold text-slate-800 mb-4">About this hotel</h2>
                <p className="text-slate-600 mb-6">{hotel.description}</p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-slate-600">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{hotel.address}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{hotel.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>{hotel.email}</span>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Reviews</h3>
                  {hotel.reviews?.length > 0 ? (
                    <div className="space-y-4">
                      {hotel.reviews.map((review) => (
                        <div key={review.id} className="bg-slate-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-slate-800">{review.user_name}</span>
                            <span className="text-yellow-500">{'★'.repeat(review.rating)}</span>
                          </div>
                          <p className="text-slate-600">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500">No reviews yet</p>
                  )}
                </div>
              </div>

              <div className="md:col-span-1">
                <div className="bg-slate-50 rounded-xl p-6 sticky top-8">
                  <div className="text-center mb-6">
                    <span className="text-3xl font-bold text-teal-600">${hotel.price_per_night}</span>
                    <span className="text-slate-500"> / night</span>
                  </div>

                  <button
                    onClick={handleBookNow}
                    className="w-full py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors mb-3"
                  >
                    Book Now
                  </button>

                  <button
                    onClick={handleFavoriteToggle}
                    className={`w-full py-3 border font-semibold rounded-lg transition-colors ${
                      hotel.is_favorite
                        ? 'border-red-500 text-red-500 hover:bg-red-50'
                        : 'border-slate-300 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {hotel.is_favorite ? 'Remove from Favorites' : 'Add to Favorites'}
                  </button>

                  {hotel.rooms_summary && (
                    <div className="mt-6 pt-6 border-t">
                      <h4 className="font-medium text-slate-800 mb-3">Room Types</h4>
                      <div className="space-y-2 text-sm text-slate-600">
                        {hotel.rooms_summary.map((room, index) => (
                          <div key={index} className="flex justify-between">
                            <span>{room.type}</span>
                            <span>{room.count} available</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
