import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../context/AuthContext'
import { getFavorites } from '../services/favoriteService'
import { getMyHotelBookings, getMyTransportBookings } from '../services/bookingService'
import { getMyReviews } from '../services/reviewService'
import RatingDisplay from '../components/reviews/RatingDisplay'

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Confirmed: 'bg-blue-100 text-blue-800',
  InProgress: 'bg-indigo-100 text-indigo-800',
  Completed: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
}

export default function TouristDashboardPage() {
  const { user } = useAuth()

  const { data: favoritesRes, isLoading: favLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => getFavorites(),
  })

  const { data: hotelBookingsRes, isLoading: hotelLoading } = useQuery({
    queryKey: ['my-hotel-bookings'],
    queryFn: getMyHotelBookings,
  })

  const { data: transportBookingsRes, isLoading: transportLoading } = useQuery({
    queryKey: ['my-transport-bookings'],
    queryFn: getMyTransportBookings,
  })

  const { data: reviewsRes, isLoading: reviewsLoading } = useQuery({
    queryKey: ['my-reviews'],
    queryFn: getMyReviews,
  })

  const favorites = favoritesRes?.data?.data || favoritesRes?.data || []
  const hotelBookings = hotelBookingsRes?.data?.data || hotelBookingsRes?.data || []
  const transportBookings = transportBookingsRes?.data?.data || transportBookingsRes?.data || []
  const reviews = reviewsRes?.data?.data || reviewsRes?.data || []

  const allBookings = [...hotelBookings, ...transportBookings].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  )

  const stats = [
    {
      label: 'Favorites',
      count: favorites.length,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      color: 'bg-red-100 text-red-600',
      link: '/favorites',
    },
    {
      label: 'Hotel Bookings',
      count: hotelBookings.length,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: 'bg-blue-100 text-blue-600',
      link: '/my-bookings/hotel',
    },
    {
      label: 'Transport Bookings',
      count: transportBookings.length,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      color: 'bg-indigo-100 text-indigo-600',
      link: '/my-bookings/transport',
    },
    {
      label: 'Reviews',
      count: reviews.length,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      color: 'bg-amber-100 text-amber-600',
      link: '/my-reviews',
    },
  ]

  const loading = favLoading || hotelLoading || transportLoading || reviewsLoading

  return (
    <div className="pt-20 pb-12 px-4 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-teal-600">
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Welcome back, {user?.first_name}!
              </h1>
              <p className="text-slate-500">{user?.email}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Link
              key={stat.label}
              to={stat.link}
              className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow"
            >
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
                {stat.icon}
              </div>
              <p className="text-2xl font-bold text-slate-800">
                {loading ? '-' : stat.count}
              </p>
              <p className="text-sm text-slate-500">{stat.label}</p>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-800">Recent Favorites</h2>
              <Link to="/favorites" className="text-sm text-teal-600 hover:text-teal-700 font-medium">
                View All
              </Link>
            </div>
            {favorites.length === 0 ? (
              <p className="text-slate-400 text-center py-8">No favorites yet</p>
            ) : (
              <div className="space-y-3">
                {favorites.slice(0, 5).map((fav) => {
                  const item = fav.hotel || fav.attraction || fav.restaurant
                  const type = fav.hotel_id ? 'hotel' : fav.attraction_id ? 'attraction' : 'restaurant'
                  if (!item) return null
                  return (
                    <div key={fav.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50">
                      <div className="w-10 h-10 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100'}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{item.name}</p>
                        <p className="text-xs text-slate-400 capitalize">{type}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-800">Recent Bookings</h2>
              <Link to="/my-bookings/hotel" className="text-sm text-teal-600 hover:text-teal-700 font-medium">
                View All
              </Link>
            </div>
            {allBookings.length === 0 ? (
              <p className="text-slate-400 text-center py-8">No bookings yet</p>
            ) : (
              <div className="space-y-3">
                {allBookings.slice(0, 5).map((booking) => (
                  <div key={booking.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      booking.room ? 'bg-blue-100' : 'bg-indigo-100'
                    }`}>
                      {booking.room ? (
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">
                        {booking.room?.hotel?.name || (booking.driver?.user ? `${booking.driver.user.first_name} ${booking.driver.user.last_name}` : 'Booking')}
                      </p>
                      <p className="text-xs text-slate-400">
                        {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[booking.status] || 'bg-slate-100 text-slate-800'}`}>
                      {booking.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-slate-800">Recent Reviews</h2>
            <Link to="/my-reviews" className="text-sm text-teal-600 hover:text-teal-700 font-medium">
              View All
            </Link>
          </div>
          {reviews.length === 0 ? (
            <p className="text-slate-400 text-center py-8">No reviews yet</p>
          ) : (
            <div className="space-y-3">
              {reviews.slice(0, 5).map((review) => (
                <div key={review.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <RatingDisplay rating={review.rating} size="sm" />
                    </div>
                    <p className="text-sm text-slate-600 mt-1 line-clamp-2">{review.comment || 'No comment'}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {review.hotel?.name || review.attraction?.name || review.restaurant?.name || 'Unknown'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
