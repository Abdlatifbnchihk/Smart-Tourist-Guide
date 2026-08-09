import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import RatingDisplay from '../reviews/RatingDisplay'
import { toggleFavorite } from '../../services/favoriteService'
import { getToken } from '../../services/apiClient'

export default function HotelCard({ hotel }) {
  const queryClient = useQueryClient()
  const [isFav, setIsFav] = useState(hotel.is_favorite || false)

  const favoriteMutation = useMutation({
    mutationFn: () => toggleFavorite('hotel', hotel.id),
    onSuccess: (data) => {
      setIsFav(data.is_favorite ?? !isFav)
      queryClient.invalidateQueries({ queryKey: ['hotels'] })
    },
  })

  const handleFavorite = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!getToken()) {
      window.location.href = '/login'
      return
    }
    favoriteMutation.mutate()
  }

  return (
    <Link
      to={`/hotels/${hotel.id}`}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-teal-100 to-teal-200">
        <img
          src={hotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={handleFavorite}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm ${
            isFav
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-white/90 text-slate-400 hover:text-red-500 hover:bg-white'
          }`}
        >
          <svg className="w-5 h-5" fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-slate-800 mb-1">{hotel.name}</h3>
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-4 h-4 ${i < (hotel.stars || 0) ? 'text-amber-400' : 'text-slate-200'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <p className="text-sm text-slate-500 mb-2">{hotel.address}</p>
        {hotel.average_rating ? (
          <div className="flex items-center gap-2 mb-3">
            <RatingDisplay rating={hotel.average_rating} size="sm" />
            <span className="text-xs text-slate-400">({hotel.reviews_count || 0})</span>
          </div>
        ) : (
          <p className="text-xs text-slate-400 mb-3">No reviews yet</p>
        )}
        <div className="flex items-center justify-end">
          <span className="text-xs font-medium text-teal-600 hover:text-teal-700 flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Review
          </span>
        </div>
      </div>
    </Link>
  )
}
