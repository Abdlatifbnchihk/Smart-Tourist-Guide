import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import CityCard from '../components/ui/CityCard'
import AttractionCard from '../components/ui/AttractionCard'
import RestaurantCard from '../components/ui/RestaurantCard'
import FeatureCard from '../components/ui/FeatureCard'
import SearchBar from '../components/ui/SearchBar'
import { getCities } from '../services/cityService'
import { getAttractions } from '../services/attractionService'
import { getRestaurants } from '../services/restaurantService'

const aiFeatures = [
  {
    step: '1',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    title: 'Tell Us Your Preferences',
    description: 'Share your travel dates, budget, interests, and preferred pace.',
  },
  {
    step: '2',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: 'AI Generates Your Itinerary',
    description: 'Our AI creates a personalized day-by-day plan in seconds.',
  },
  {
    step: '3',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Customize & Book',
    description: 'Adjust the plan, then book hotels and drivers directly.',
  },
]

const features = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    title: 'Verified Local Drivers',
    description: 'Safe, professional drivers who know every hidden road and shortcut across the kingdom.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: 'AI Trip Planning',
    description: 'Get a custom itinerary generated in seconds based on your specific interests and budget.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: 'Best Price Guarantee',
    description: 'Direct partnerships with riads and tour operators mean you always get the lowest rates.',
  },
]

export default function HomePage() {
  const navigate = useNavigate()
  const scrollRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const { data: cities = [], isLoading: citiesLoading } = useQuery({
    queryKey: ['cities'],
    queryFn: getCities,
  })

  const { data: attractions = [], isLoading: attractionsLoading } = useQuery({
    queryKey: ['attractions'],
    queryFn: getAttractions,
  })

  const { data: restaurants = [], isLoading: restaurantsLoading } = useQuery({
    queryKey: ['restaurants'],
    queryFn: getRestaurants,
  })

  const handleSearch = (query) => {
    navigate(`/cities?search=${encodeURIComponent(query)}`)
  }

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 10)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    checkScroll()
    const scrollElement = scrollRef.current
    if (scrollElement) {
      scrollElement.addEventListener('scroll', checkScroll)
      return () => scrollElement.removeEventListener('scroll', checkScroll)
    }
  }, [])

  const scroll = (direction) => {
    if (scrollRef.current) {
      const cardWidth = 288 + 20
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -cardWidth : cardWidth,
        behavior: 'smooth',
      })
    }
  }

  return (
    <div>
      <section className="relative min-h-[700px] flex flex-col">
        <div className="absolute inset-0">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHzpJS8GurorE99u6EyY4itRdRlKJsaJ31TdrQhy47f8hvdFRHD2bu6li9M44kOrYKSxQBtmYwTCYtOOaPNH3Rt-eMUmLzaHIZf6o9jeJnSwwtmLndDPhKYYE4LKaAANpkKHYsqGz-gt5StcHHuWUFOCGgCEv1tmb5XCxQSuen1SuWEnwQaCbl7Bt_dYcTvuqKoqCo0m1TN5bBfoz8R6NeN_VcSThoF3IMd0GIQuK9tMk9DocccHLU"
            alt="Morocco"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900/90" />
        </div>
        <div className="relative z-10 flex-1 flex items-center justify-center pt-16 pb-8">
          <div className="text-center px-4 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Discover Morocco's Hidden Gems
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8">
              Explore cities, book hotels, hire local drivers, and let AI plan your perfect trip
            </p>
            <div className="flex justify-center">
              <SearchBar onSearch={handleSearch} placeholder="Search cities, hotels, attractions..." />
            </div>
          </div>
        </div>
        <div className="relative z-10 pb-10 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl md:text-2xl font-bold text-white">Featured Restaurants</h3>
              <a href="#restaurants" className="text-amber-400 hover:text-amber-300 text-sm font-medium flex items-center gap-1">
                View All
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
            {restaurantsLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden animate-pulse">
                    <div className="aspect-[4/3] bg-white/10" />
                    <div className="p-3 space-y-2">
                      <div className="h-4 bg-white/10 rounded w-3/4" />
                      <div className="h-3 bg-white/10 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {restaurants.map((restaurant) => (
                  <a
                    key={restaurant.restaurant_id}
                    href={`/restaurants/${restaurant.restaurant_id}`}
                    className="group bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-white/20 transition-all duration-300"
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400'}
                        alt={restaurant.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-3">
                      <h4 className="text-sm font-bold text-white truncate">{restaurant.name}</h4>
                      <p className="text-xs text-white/60 truncate">{restaurant.cuisine}</p>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="restaurants" className="py-16 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">Explore Moroccan Cities</h2>
            <p className="text-slate-600">From ancient medinas to modern seaside resorts</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {citiesLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
                  <div className="aspect-[4/3] bg-slate-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-6 bg-slate-200 rounded w-1/2" />
                    <div className="h-4 bg-slate-200 rounded w-1/3" />
                  </div>
                </div>
              ))
            ) : (
              cities.map((city) => (
                <CityCard key={city.city_id} city={city} />
              ))
            )}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">Popular Attractions</h2>
              <p className="text-slate-600">Must-see locations for every traveler</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${
                  canScrollLeft
                    ? 'border-slate-300 hover:bg-slate-100 text-slate-600'
                    : 'border-slate-200 text-slate-300 cursor-not-allowed'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${
                  canScrollRight
                    ? 'border-slate-300 hover:bg-slate-100 text-slate-600'
                    : 'border-slate-200 text-slate-300 cursor-not-allowed'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
          >
            {attractionsLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-72 bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
                  <div className="aspect-[4/3] bg-slate-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-5 bg-slate-200 rounded w-3/4" />
                    <div className="h-4 bg-slate-200 rounded w-1/2" />
                  </div>
                </div>
              ))
            ) : (
              attractions.map((attraction) => (
                <div key={attraction.id} className="flex-shrink-0">
                  <AttractionCard attraction={attraction} />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-teal-100 text-teal-700 text-sm font-semibold rounded-full mb-4">
              AI-Powered
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Let AI Plan Your Perfect Trip
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              Our intelligent travel assistant creates personalized itineraries based on your preferences, budget, and travel style.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {aiFeatures.map((feature, index) => (
              <div key={index} className="relative">
                <div className="bg-slate-50 rounded-2xl p-8 h-full">
                  <div className="w-12 h-12 bg-teal-600 text-white rounded-xl flex items-center justify-center mb-5">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
                  <p className="text-slate-600">{feature.description}</p>
                </div>
                {index < aiFeatures.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  Ready to start your adventure?
                </h3>
                <p className="text-white/90">
                  Answer a few questions and get a custom itinerary in seconds.
                </p>
              </div>
              <button className="px-8 py-4 bg-white text-teal-700 font-semibold rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap">
                Plan My Trip
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">Why Travel With Us?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Experience Morocco with the confidence of local expertise and modern technology.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="bg-teal-700 rounded-2xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-left">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Plan Your Trip with AI</h2>
                <p className="text-white/90 max-w-lg">
                  Tell us your preferences and get a personalized day-by-day itinerary tailored to your travel style.
                </p>
              </div>
              <button className="px-8 py-3 bg-white text-teal-700 font-semibold rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap">
                Start Planning
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}