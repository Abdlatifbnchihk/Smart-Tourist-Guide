import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getFavorites, removeFavorite } from '../../services/favoriteService'
import RatingDisplay from '../../components/reviews/RatingDisplay'
import FavoriteButton from '../../components/favorites/FavoriteButton'
import Skeleton from '../../components/ui/Skeleton'

const typeFilters = ['All', 'Hotels', 'Attractions', 'Restaurants']
const typeMap = { Hotels: 'hotel', Attractions: 'attraction', Restaurants: 'restaurant' }

const typeIcons = {
  hotel: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  attraction: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
  restaurant: 'M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0A1.5 1.5 0 003 15.546',
}

function FavoriteCard({ favorite, onRemove }) {
  const item = favorite.hotel || favorite.attraction || favorite.restaurant
  const itemType = favorite.hotel_id ? 'hotel' : favorite.attraction_id ? 'attraction' : 'restaurant'

  if (!item) return null

  const getLinkPath = () => {
    if (itemType === 'hotel') return `/hotels/${item.id}`
    if (itemType === 'attraction') return `/attractions/${item.id}`
    return '#'
  }

  const getImageUrl = () => {
    if (item.image) return item.image
    if (itemType === 'hotel') return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'
    if (itemType === 'attraction') return 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400'
    return 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400'
  }

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
      <Link to={getLinkPath()} className="block">
        <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-teal-100 to-teal-200">
          <img
            src={getImageUrl()}
            alt={item?.name || 'Favorite'}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Link
              to={getLinkPath()}
              className="font-semibold text-slate-800 hover:text-teal-600 transition-colors line-clamp-1"
            >
              {item?.name || 'Unknown'}
            </Link>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full capitalize">
                {itemType}
              </span>
              {item?.address && (
                <span className="text-xs text-slate-400 truncate">{item.address}</span>
              )}
            </div>
          </div>
          <FavoriteButton
            type={itemType}
            id={item?.id}
            isFavorited={true}
            onToggle={() => onRemove(favorite.id)}
          />
        </div>
        {item?.average_rating && (
          <div className="mt-3">
            <RatingDisplay rating={item.average_rating} size="sm" />
          </div>
        )}
      </div>
    </div>
  )
}

export default function FavoritesPage() {
  const queryClient = useQueryClient()
  const [activeFilter, setActiveFilter] = useState('All')
  const [deleteId, setDeleteId] = useState(null)

  const typeFilter = typeMap[activeFilter] || ''

  const { data: response, isLoading } = useQuery({
    queryKey: ['favorites', typeFilter],
    queryFn: () => getFavorites(typeFilter),
  })

  const favorites = response?.data?.data || response?.data || []

  const deleteMutation = useMutation({
    mutationFn: removeFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries(['favorites'])
      setDeleteId(null)
    },
  })

  const handleRemove = (id) => {
    setDeleteId(id)
  }

  const handleConfirmRemove = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">My Favorites</h2>
        <p className="text-slate-500 mt-1">Places you've saved for later</p>
      </div>

      {/* Type Filters */}
      <div className="flex gap-2">
        {typeFilters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === filter
                ? 'bg-teal-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Favorites Grid */}
      {favorites.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm px-6 py-12 text-center">
          <svg
            className="w-16 h-16 text-slate-300 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <p className="text-slate-500 text-lg">No favorites saved yet</p>
          <p className="text-slate-400 text-sm mt-1">
            Start exploring and save your favorite places!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((fav) => (
            <FavoriteCard key={fav.id} favorite={fav} onRemove={handleRemove} />
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Remove Favorite</h3>
            <p className="text-slate-600 mb-6">
              Are you sure you want to remove this from your favorites?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium"
              >
                Keep
              </button>
              <button
                onClick={handleConfirmRemove}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50"
              >
                {deleteMutation.isPending ? 'Removing...' : 'Yes, Remove'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
