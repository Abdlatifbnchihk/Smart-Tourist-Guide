import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAttractions } from '../services/attractionService'
import AttractionCard from '../components/ui/AttractionCard'

export default function AttractionsPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const { data: attractions = [], isLoading, error } = useQuery({
    queryKey: ['attractions'],
    queryFn: getAttractions,
  })

  const filtered = searchQuery
    ? attractions.filter((a) =>
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.city?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.city_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : attractions

  return (
    <div className="pt-20 pb-12 px-4 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Attractions</h1>
          <p className="text-slate-600">Must-see locations for every traveler in Morocco</p>
        </div>

        <div className="mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search attractions by name, city, or description..."
            className="w-full max-w-md px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        {isLoading ? (
          <div className="text-center py-16">
            <div className="animate-spin w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full mx-auto" />
            <p className="mt-4 text-slate-600">Loading attractions...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-600">Failed to load attractions. Please try again later.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-600">No attractions found{searchQuery && ` for "${searchQuery}"`}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((attraction) => (
              <AttractionCard key={attraction.id} attraction={attraction} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
