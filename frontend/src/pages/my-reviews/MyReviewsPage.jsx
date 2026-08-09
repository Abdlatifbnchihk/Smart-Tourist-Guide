import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMyReviews, updateReview, deleteReview } from '../../services/reviewService'
import { useAuth } from '../../context/AuthContext'
import ReviewCard from '../../components/reviews/ReviewCard'
import Skeleton from '../../components/ui/Skeleton'

export default function MyReviewsPage() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
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
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateReview(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['my-reviews'])
      setEditingId(null)
    },
  })

  const handleEdit = (review) => {
    setEditingId(review.id)
    setEditData({ rating: review.rating, comment: review.comment })
  }

  const handleSave = () => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: editData })
    }
  }

  const handleDelete = (id) => {
    deleteMutation.mutate(id)
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
    <div className="pt-24 pb-12 px-4 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">My Reviews</h2>
            <p className="text-slate-500 mt-1">Reviews you've written</p>
          </div>
          <Link
            to="/reviews/new"
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium transition-colors"
          >
            Write Review
          </Link>
        </div>

        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm px-6 py-12 text-center">
              <svg
                className="w-16 h-16 text-slate-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              <p className="text-slate-500 text-lg">No reviews yet</p>
              <p className="text-slate-400 text-sm mt-1 mb-4">
                Share your experiences with others!
              </p>
              <Link
                to="/reviews/new"
                className="inline-block px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium transition-colors"
              >
                Write Your First Review
              </Link>
            </div>
          ) : (
            reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                currentUserId={user?.id}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>

        {editingId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Edit Review</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500 mb-2">Rating</p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setEditData({ ...editData, rating: star })}
                        className="w-8 h-8 focus:outline-none"
                      >
                        <svg
                          className={`w-8 h-8 ${editData.rating >= star ? 'text-amber-400' : 'text-slate-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-2">Comment</p>
                  <textarea
                    value={editData.comment}
                    onChange={(e) => setEditData({ ...editData, comment: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-3">
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
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
