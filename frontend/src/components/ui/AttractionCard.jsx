import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import RatingDisplay from '../reviews/RatingDisplay'
import { toggleFavorite } from '../../services/favoriteService'
import { getToken } from '../../services/apiClient'

export default function AttractionCard({ attraction }) {
  const queryClient = useQueryClient()
  const [isFav, setIsFav] = useState(attraction.is_favorite || false)

  const favoriteMutation = useMutation({
    mutationFn: () => toggleFavorite('attraction', attraction.id),
    onSuccess: (data) => {
      setIsFav(data.is_favorite ?? !isFav)
      queryClient.invalidateQueries({ queryKey: ['attractions'] })
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
      to={`/attractions/${attraction.id}`}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
    >
      <div className="relative aspect-[3/2] overflow-hidden">
        <img
          src={attraction.image || 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=400'}
          alt={attraction.name}
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
      <div className="p-4">
        <h4 className="text-lg font-bold text-slate-800 mb-1">{attraction.name}</h4>
        <p className="text-sm text-slate-500 mb-2">{attraction.city?.name || attraction.city_name}</p>
        {attraction.average_rating ? (
          <div className="flex items-center gap-2 mb-3">
            <RatingDisplay rating={attraction.average_rating} size="sm" />
            <span className="text-xs text-slate-400">({attraction.reviews_count || 0})</span>
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
