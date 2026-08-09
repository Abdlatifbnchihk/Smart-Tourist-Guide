import { useState } from 'react'
import RatingDisplay from './RatingDisplay'

export default function ReviewCard({ review, currentUserId, onEdit, onDelete }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const entity = review.hotel || review.attraction || review.driver
  const entityType = review.hotel_id ? 'Hotel' : review.attraction_id ? 'Attraction' : 'Driver'
  const isOwner = review.user_id === currentUserId

  const handleDelete = () => {
    setShowDeleteConfirm(true)
  }

  const confirmDelete = () => {
    setShowDeleteConfirm(false)
    onDelete?.(review.id)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold text-slate-800">
                {entity?.name || entityType}
              </span>
              <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                {entityType}
              </span>
            </div>

            <div className="mb-3">
              <RatingDisplay rating={review.rating} size="sm" />
            </div>

            <p className="text-slate-600 mb-3 leading-relaxed">{review.comment}</p>

            <div className="flex items-center gap-4 text-sm text-slate-400">
              <span>{review.user?.name || 'Anonymous'}</span>
              <span>{formatDate(review.created_at)}</span>
            </div>
          </div>

          {isOwner && (
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => onEdit?.(review)}
                className="text-teal-600 hover:text-teal-700 font-medium text-sm px-3 py-1 rounded-lg hover:bg-teal-50 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="text-red-600 hover:text-red-700 font-medium text-sm px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Delete Review</h3>
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete this review? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium"
              >
                Keep
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
