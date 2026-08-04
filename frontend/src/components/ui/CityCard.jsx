import { Link } from 'react-router-dom'

export default function CityCard({ city }) {
  return (
    <Link
      to={`/cities/${city.city_id}`}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={city.image || 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=800'}
          alt={city.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold bg-white/95 text-teal-700 rounded-md backdrop-blur-sm">
          {city.region}
        </span>
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-slate-800 mb-3">{city.name}</h3>
        <div className="flex gap-5 text-sm text-slate-600">
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            {city.hotel_count || 0} Hotels
          </span>
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {city.attraction_count || 0} Attractions
          </span>
        </div>
      </div>
    </Link>
  )
}