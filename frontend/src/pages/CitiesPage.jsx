import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import apiClient from '../services/apiClient'
import CityCard from '../components/ui/CityCard'

export default function CitiesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [cities, setCities] = useState([])
  const [filteredCities, setFilteredCities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await apiClient.get('/cities')
        setCities(res.data.data || [])
        setFilteredCities(res.data.data || [])
      } catch (err) {
        setError('Failed to load cities. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
    fetchCities()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const filtered = cities.filter((city) =>
        city.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredCities(filtered)
    } else {
      setFilteredCities(cities)
    }
  }, [searchQuery, cities])

  const handleSearch = (e) => {
    const value = e.target.value
    setSearchQuery(value)
    if (value) {
      setSearchParams({ search: value })
    } else {
      setSearchParams({})
    }
  }

  return (
    <div className="pt-20 pb-12 px-4 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Moroccan Cities</h1>
          <p className="text-slate-600">Discover the beauty and culture of Morocco's cities</p>
        </div>

        <div className="mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search cities by name..."
            className="w-full max-w-md px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full mx-auto" />
            <p className="mt-4 text-slate-600">Loading cities...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-600">{error}</p>
          </div>
        ) : filteredCities.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-600">No cities found{searchQuery && ` for "${searchQuery}"`}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCities.map((city) => (
              <CityCard key={city.city_id} city={city} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}