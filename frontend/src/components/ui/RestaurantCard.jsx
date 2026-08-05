import { Link } from 'react-router-dom'

export default function RestaurantCard({ restaurant }) {
  const priceSymbols = '$'.repeat(restaurant.price_range || 1)

  return (
    <Link
      to={`/restaurants/${restaurant.restaurant_id}`}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
    >
      <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-orange-100 to-amber-200">
        <img
          src={restaurant.image || `https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400`}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-slate-800 mb-2">{restaurant.name}</h3>
        <p className="text-sm text-slate-500 mb-3">{restaurant.cuisine}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-teal-600">{priceSymbols}</span>
          {restaurant.address && (
            <span className="text-xs text-slate-400 truncate ml-2">{restaurant.address}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
