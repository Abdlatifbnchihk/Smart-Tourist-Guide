import { Link } from 'react-router-dom'

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
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-4 h-4 ${star <= (attraction.average_rating || 0) ? 'text-amber-400' : 'text-slate-200'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          {attraction.average_rating && (
            <span className="text-sm font-medium text-slate-600">{attraction.average_rating}</span>
          )}
        </div>
      </div>
    </Link>
  )
}