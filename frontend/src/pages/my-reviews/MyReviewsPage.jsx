import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMyReviews, updateReview, deleteReview } from '../../services/reviewService'
import Skeleton from '../../components/ui/Skeleton'

function StarRating({ rating, onChange, editable = false }) {
  const [hovered, setHovered] = useState(0)

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!editable}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => editable && setHovered(star)}
          onMouseLeave={() => editable && setHovered(0)}
          className={`w-5 h-5 ${editable ? 'cursor-pointer' : 'cursor-default'}`}
        >
          <svg
            className={`w-5 h-5 ${(hovered || rating) >= star ? 'text-yellow-400' : 'text-slate-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  )
}

export default function MyReviewsPage() {
  const queryClient = useQueryClient()
  const [deleteId, setDeleteId] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({ rating: 5, comment: '' })

  const { data: response, isLoading } = useQuery({
    queryKey: ['my-reviews'],
    queryFn: getMyReviews,
  })

  const reviews = response?.data?.data || response?.data || []

  const deleteMutation = useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries(['my-reviews'])
      setDeleteId(null)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateReview(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['my-reviews'])
      setEditingId(null)
    },
  })

  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId)
    }
  }

  const handleEdit = (review) => {
    setEditingId(review.id)
    setEditData({ rating: review.rating, comment: review.comment })
  }

  const handleSave = () => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: editData })
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">My Reviews</h2>
        <p className="text-slate-500 mt-1">Reviews you've written</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {reviews.length === 0 ? (
          <div className="px-6 py-12 text-center text-slate-500">
            No reviews yet
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {reviews.map((review) => {
              const entity = review.hotel || review.attraction || review.driver
              const entityType = review.hotel_id ? 'Hotel' : review.attraction_id ? 'Attraction' : 'Driver'

              return (
                <div key={review.id} className="px-6 py-4">
                  {editingId === review.id ? (
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Rating</p>
                        <StarRating
                          rating={editData.rating}
                          onChange={(r) => setEditData({ ...editData, rating: r })}
                          editable
                        />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Comment</p>
                        <textarea
                          value={editData.comment}
                          onChange={(e) => setEditData({ ...editData, comment: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                          rows={3}
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSave}
                          disabled={updateMutation.isPending}
                          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium disabled:opacity-50"
                        >
                          {updateMutation.isPending ? 'Saving...' : 'Save'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-800">{entity?.name || entityType}</span>
                          <span className="text-sm text-slate-500">({entityType})</span>
                        </div>
                        <StarRating rating={review.rating} />
                        <p className="text-slate-600">{review.comment}</p>
                        <p className="text-sm text-slate-400">{new Date(review.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(review)}
                          className="text-teal-600 hover:text-teal-700 font-medium text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteId(review.id)}
                          className="text-red-600 hover:text-red-700 font-medium text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Delete Review</h3>
            <p className="text-slate-600 mb-6">Are you sure you want to delete this review? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium"
              >
                Keep
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
