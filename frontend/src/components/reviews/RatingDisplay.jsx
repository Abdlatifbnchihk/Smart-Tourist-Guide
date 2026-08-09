import { useMemo } from 'react'

const sizeClasses = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
}

const gapClasses = {
  sm: 'gap-0.5',
  md: 'gap-1',
  lg: 'gap-1',
}

const textClasses = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
}

export default function RatingDisplay({ rating = 0, size = 'md', showValue = true }) {
  const numericRating = Number(rating) || 0

  const stars = useMemo(() => {
    const rounded = Math.round(numericRating * 2) / 2
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1
      if (rounded >= starValue) return 'full'
      if (rounded >= starValue - 0.5) return 'half'
      return 'empty'
    })
  }, [numericRating])

  return (
    <div className="flex items-center gap-1.5">
      <div className={`flex ${gapClasses[size]}`}>
        {stars.map((type, i) => (
          <div key={i} className="relative">
            {type === 'half' ? (
              <>
                <svg
                  className={`${sizeClasses[size]} text-slate-200`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                  <svg
                    className={`${sizeClasses[size]} text-amber-400`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </>
            ) : (
              <svg
                className={`${sizeClasses[size]} ${type === 'full' ? 'text-amber-400' : 'text-slate-200'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            )}
          </div>
        ))}
      </div>
      {showValue && numericRating > 0 && (
        <span className={`${textClasses[size]} font-medium text-slate-600`}>
          {numericRating.toFixed(1)}
        </span>
      )}
    </div>
  )
}
