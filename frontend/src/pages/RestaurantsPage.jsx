import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getRestaurants } from '../services/restaurantService'
import RestaurantCard from '../components/ui/RestaurantCard'

export default function RestaurantsPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const { data: restaurants = [], isLoading, error } = useQuery({
    queryKey: ['restaurants'],
    queryFn: getRestaurants,
  })

  const filtered = searchQuery
    ? restaurants.filter((r) =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.cuisine?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.address?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : restaurants

  return (
    <div className="pt-20 pb-12 px-4 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Restaurants</h1>
          <p className="text-slate-600">Savor authentic Moroccan cuisine across the kingdom</p>
        </div>

        <div className="mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search restaurants by name, cuisine, or address..."
            className="w-full max-w-md px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        {isLoading ? (
          <div className="text-center py-16">
            <div className="animate-spin w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full mx-auto" />
            <p className="mt-4 text-slate-600">Loading restaurants...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-600">Failed to load restaurants. Please try again later.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-600">No restaurants found{searchQuery && ` for "${searchQuery}"`}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((restaurant) => (
              <RestaurantCard key={restaurant.restaurant_id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
