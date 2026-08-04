export default function Skeleton({ lines = 1, className = '' }) {
  if (lines === 1) {
    return <div className={`animate-pulse bg-slate-200 rounded ${className}`} />
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-slate-200 rounded h-4 ${
            i === lines - 1 ? 'w-3/4' : 'w-full'
          }`}
        />
      ))}
    </div>
  )
}
