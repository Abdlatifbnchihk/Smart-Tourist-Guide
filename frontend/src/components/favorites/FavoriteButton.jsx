import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toggleFavorite } from '../../services/favoriteService'

export default function FavoriteButton({ type, id, isFavorited = false, onToggle }) {
  const queryClient = useQueryClient()
  const [optimisticState, setOptimisticState] = useState(isFavorited)
  const [showConfirm, setShowConfirm] = useState(false)

  const mutation = useMutation({
    mutationFn: () => toggleFavorite(type, id),
    onMutate: async () => {
      setOptimisticState(!optimisticState)
    },
    onError: () => {
      setOptimisticState(optimisticState)
    },
    onSettled: () => {
      queryClient.invalidateQueries(['favorites'])
      queryClient.invalidateQueries(['favoriteStatus', type, id])
    },
  })

  const handleClick = () => {
    setShowConfirm(true)
  }

  const handleConfirm = () => {
    setShowConfirm(false)
    mutation.mutate()
    onToggle?.(!optimisticState)
  }

  const handleCancel = () => {
    setShowConfirm(false)
  }

  return (
    <>
      <button
        onClick={handleClick}
        className="p-2 rounded-full hover:bg-slate-100 transition-colors"
        aria-label={optimisticState ? 'Remove from favorites' : 'Add to favorites'}
      >
        <svg
          className={`w-5 h-5 transition-colors ${
            optimisticState ? 'text-red-500' : 'text-slate-400 hover:text-red-400'
          }`}
          fill={optimisticState ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              {optimisticState ? 'Remove from Favorites' : 'Add to Favorites'}
            </h3>
            <p className="text-slate-600 mb-6">
              {optimisticState
                ? 'Are you sure you want to remove this from your favorites?'
                : 'Are you sure you want to add this to your favorites?'}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={mutation.isPending}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium disabled:opacity-50"
              >
                {mutation.isPending ? 'Saving...' : optimisticState ? 'Remove' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
