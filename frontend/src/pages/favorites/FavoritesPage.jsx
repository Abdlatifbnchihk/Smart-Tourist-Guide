import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getFavorites, removeFavorite } from '../../services/favoriteService'
import Skeleton from '../../components/ui/Skeleton'

const typeFilters = ['All', 'Hotels', 'Attractions', 'Restaurants']
const typeMap = { Hotels: 'hotel', Attractions: 'attraction', Restaurants: 'restaurant' }

const typeIcons = {
  hotel: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  attraction: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
  restaurant: 'M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0A1.5 1.5 0 003 15.546',
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

  const handleDelete = () => {
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

      {/* Favorites List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {favorites.length === 0 ? (
          <div className="px-6 py-12 text-center text-slate-500">
            No favorites saved yet
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {favorites.map((fav) => {
              const item = fav.hotel || fav.attraction || fav.restaurant
              const itemType = fav.hotel_id ? 'hotel' : fav.attraction_id ? 'attraction' : 'restaurant'

              return (
                <div key={fav.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={typeIcons[itemType]} />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{item?.name || 'Unknown'}</p>
                      <p className="text-sm text-slate-500 capitalize">{itemType}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setDeleteId(fav.id)}
                    className="text-red-600 hover:text-red-700 font-medium text-sm"
                  >
                    Remove
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Remove Favorite</h3>
            <p className="text-slate-600 mb-6">Are you sure you want to remove this from your favorites?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium"
              >
                Keep
              </button>
              <button
                onClick={handleDelete}
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
