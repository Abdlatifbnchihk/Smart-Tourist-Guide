import { Link } from 'react-router-dom'
import RatingDisplay from '../reviews/RatingDisplay'

export default function AttractionCard({ attraction }) {
  return (
    <Link
      to={`/attractions/${attraction.id}`}
      className="flex-shrink-0 w-72 bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
    >
      <div className="aspect-[3/2] overflow-hidden">
        <img
          src={attraction.image || 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=400'}
          alt={attraction.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h4 className="text-lg font-bold text-slate-800 mb-1">{attraction.name}</h4>
        <p className="text-sm text-slate-500 mb-3">{attraction.city?.name || attraction.city_name}</p>
        <div className="flex items-center justify-between">
          {attraction.average_rating && (
            <RatingDisplay rating={attraction.average_rating} size="sm" />
          )}
        </div>
      </div>
    </Link>
  )
}
