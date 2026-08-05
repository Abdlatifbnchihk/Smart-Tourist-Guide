import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import apiClient from '../services/apiClient'
import Skeleton from '../components/ui/Skeleton'
import HotelCard from '../components/ui/HotelCard'
import RestaurantCard from '../components/ui/RestaurantCard'

const tabs = [
  { id: 'hotels', label: 'Hotels', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
  { id: 'attractions', label: 'Attractions', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z' },
  { id: 'restaurants', label: 'Restaurants', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
]

export default function CityDetailPage() {
  const { id } = useParams()
  const [city, setCity] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('hotels')

  useEffect(() => {
    const fetchCity = async () => {
      try {
        const res = await apiClient.get(`/cities/${id}`)
        setCity(res.data.data)
      } catch (err) {
        setError('Failed to load city details. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
    fetchCity()
  }, [id])

  if (loading) {
    return (
      <div className="pt-20 pb-12 px-4 bg-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-64 rounded-2xl mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="pt-20 pb-12 px-4 bg-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto text-center py-16">
          <svg className="w-16 h-16 mx-auto text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p className="text-slate-600 text-lg">{error}</p>
        </div>
      </div>
    )
  }

  if (!city) return null

  const items = city[activeTab] || []

  return (
    <div className="pt-20 pb-12 px-4 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Hero Header */}
        <div className="bg-slate-900 rounded-2xl overflow-hidden mb-8">
          <div className="relative h-64 bg-gradient-to-r from-slate-900 to-slate-800 flex items-end">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
            <div className="relative p-8 w-full">
              <span className="inline-block px-4 py-1 bg-white/20 text-white text-sm font-semibold rounded-full backdrop-blur-sm mb-4">
                {city.region}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">{city.name}</h1>
              <p className="text-white/80 max-w-2xl text-lg">{city.description}</p>
            </div>
          </div>
          <div className="px-8 py-5 flex gap-8 border-t border-white/10">
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <div>
                <p className="text-2xl font-bold text-white">{city.hotels_count || 0}</p>
                <p className="text-white/60 text-sm">Hotels</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <p className="text-2xl font-bold text-white">{city.attractions_count || 0}</p>
                <p className="text-white/60 text-sm">Attractions</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-2xl font-bold text-white">{city.restaurants_count || 0}</p>
                <p className="text-white/60 text-sm">Restaurants</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-slate-200 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'text-teal-600 border-teal-600'
                  : 'text-slate-500 border-transparent hover:text-slate-700'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
              </svg>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {items.length === 0 ? (
          <div className="text-center py-16">
            <svg className="w-16 h-16 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-slate-500 text-lg">No {activeTab} found in this city</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeTab === 'hotels' && items.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
            {activeTab === 'attractions' && items.map((attraction) => (
              <AttractionGridCard key={attraction.id} attraction={attraction} />
            ))}
            {activeTab === 'restaurants' && items.map((restaurant) => (
              <RestaurantCard key={restaurant.restaurant_id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function AttractionGridCard({ attraction }) {
  return (
    <a
      href={`/attractions/${attraction.slug}`}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
    >
      <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-purple-100 to-indigo-200">
        <img
          src={attraction.image || `https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=400`}
          alt={attraction.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-slate-800 mb-2">{attraction.name}</h3>
        <p className="text-sm text-slate-500 mb-3 line-clamp-2">{attraction.description}</p>
        <div className="flex items-center justify-between">
          {attraction.opening_hours && (
            <span className="text-xs text-slate-400">{attraction.opening_hours}</span>
          )}
          {attraction.average_rating && (
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-medium text-slate-600">{attraction.average_rating}</span>
            </div>
          )}
        </div>
      </div>
    </a>
  )
}
