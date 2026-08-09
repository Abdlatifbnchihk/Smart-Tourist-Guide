import { Link } from 'react-router-dom'
import RatingDisplay from '../reviews/RatingDisplay'

export default function HotelCard({ hotel }) {
  return (
    <Link
      to={`/hotels/${hotel.id}`}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
    >
      <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-teal-100 to-teal-200">
        <img
          src={hotel.image || `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400`}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-slate-800 mb-2">{hotel.name}</h3>
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-4 h-4 ${i < (hotel.stars || 0) ? 'text-amber-400' : 'text-slate-200'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <p className="text-sm text-slate-500 mb-3">{hotel.address}</p>
        <div className="flex items-center justify-between">
          {hotel.average_rating && (
            <RatingDisplay rating={hotel.average_rating} size="sm" />
          )}
        </div>
      </div>
    </Link>
  )
}
