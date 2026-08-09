import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../context/AuthContext'
import { getAttraction, toggleFavoriteAttraction } from '../../services/attractionService'
import RatingDisplay from '../../components/reviews/RatingDisplay'

export default function AttractionDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: attraction, isLoading, error } = useQuery({
    queryKey: ['attraction', id],
    queryFn: () => getAttraction(id),
  })

  const favoriteMutation = useMutation({
    mutationFn: () => toggleFavoriteAttraction(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['attraction', id])
      queryClient.invalidateQueries(['favorites'])
    },
  })

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
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Error loading attraction</h2>
          <p className="text-slate-600">{error.message}</p>
        </div>
      </div>
    )
  }

  if (!attraction) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Attraction not found</h2>
        </div>
      </div>
    )
  }

  const averageRating = attraction.average_rating || (attraction.reviews?.length
    ? (attraction.reviews.reduce((sum, r) => sum + r.rating, 0) / attraction.reviews.length).toFixed(1)
    : null)

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="relative h-96">
            <img
              src={attraction.image || 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800'}
              alt={attraction.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{attraction.name}</h1>
              <div className="flex items-center gap-4 text-white/90">
                {averageRating && (
                  <span className="flex items-center gap-2">
                    <RatingDisplay rating={Math.round(averageRating)} size="sm" showValue={false} />
                    <span className="bg-white/20 px-2 py-0.5 rounded">{averageRating}</span>
                    <span>({attraction.reviews?.length || 0} reviews)</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <h2 className="text-xl font-bold text-slate-800 mb-4">About this attraction</h2>
                <p className="text-slate-600 mb-6">{attraction.description}</p>

                <div className="space-y-3 mb-6">
                  {attraction.address && (
                    <div className="flex items-center gap-3 text-slate-600">
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{attraction.address}</span>
                    </div>
                  )}
                  {attraction.opening_hours && (
                    <div className="flex items-center gap-3 text-slate-600">
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{attraction.opening_hours}</span>
                    </div>
                  )}
                  {attraction.city && (
                    <div className="flex items-center gap-3 text-slate-600">
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <Link to={`/cities/${attraction.city.city_id || attraction.city_id}`} className="text-teal-600 hover:underline">
                        {attraction.city.name}
                      </Link>
                    </div>
                  )}
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Reviews</h3>
                  {attraction.reviews?.length > 0 ? (
                    <div className="space-y-4">
                      {attraction.reviews.map((review) => (
                        <div key={review.id} className="bg-slate-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-slate-800">{review.user_name}</span>
                            <RatingDisplay rating={review.rating} size="sm" showValue={false} />
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
                  <button
                    onClick={handleFavoriteToggle}
                    className={`w-full py-3 border font-semibold rounded-lg transition-colors ${
                      attraction.is_favorite
                        ? 'border-red-500 text-red-500 hover:bg-red-50'
                        : 'border-slate-300 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {attraction.is_favorite ? 'Remove from Favorites' : 'Add to Favorites'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
