import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '../../services/apiClient'
import Skeleton from '../../components/ui/Skeleton'

export default function ReviewsManagementPage() {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingReview, setDeletingReview] = useState(null)

  const { data: response, isLoading, error } = useQuery({
    queryKey: ['admin-reviews'],
    queryFn: async () => {
      const res = await apiClient.get('/reviews')
      return res.data
    },
  })

  const reviews = response?.data || response || []

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await apiClient.delete(`/reviews/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-reviews'])
      setShowDeleteModal(false)
      setDeletingReview(null)
    },
  })

  const filteredReviews = reviews.filter((review) => {
    const comment = review.comment?.toLowerCase() || ''
    const firstName = review.user?.first_name?.toLowerCase() || ''
    const lastName = review.user?.last_name?.toLowerCase() || ''
    const q = searchQuery.toLowerCase()
    return comment.includes(q) || firstName.includes(q) || lastName.includes(q)
  })

  const handleDelete = () => {
    if (deletingReview) {
      deleteMutation.mutate(deletingReview.id)
    }
  }

  const getReviewableName = (review) => {
    if (review.hotel) return review.hotel.name
    if (review.attraction) return review.attraction.name
    if (review.driver) return review.driver.license_plate
    return '-'
  }

  const getReviewableType = (review) => {
    if (review.hotel) return 'Hotel'
    if (review.attraction) return 'Attraction'
    if (review.driver) return 'Driver'
    return '-'
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 rounded-xl" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Reviews Moderation</h2>
        <p className="text-slate-500 mt-1">Manage and moderate user reviews</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4">
        <input
          type="text"
          placeholder="Search reviews..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error.message || 'Failed to load reviews'}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-slate-500 border-b border-slate-100 bg-slate-50">
              <th className="px-6 py-3 font-medium">User</th>
              <th className="px-6 py-3 font-medium">Rating</th>
              <th className="px-6 py-3 font-medium">Review</th>
              <th className="px-6 py-3 font-medium">Entity</th>
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReviews.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                  No reviews found
                </td>
              </tr>
            ) : (
              filteredReviews.map((review, index) => (
                <tr key={review.id} className={`border-b border-slate-50 ${index % 2 === 0 ? '' : 'bg-slate-50/50'}`}>
                  <td className="px-6 py-4">
                    <span className="font-medium text-slate-800">
                      {review.user?.first_name} {review.user?.last_name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400' : 'text-slate-200'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-sm max-w-xs truncate">{review.comment || '-'}</td>
                  <td className="px-6 py-4 text-slate-600 text-sm">
                    <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">
                      {getReviewableType(review)}
                    </span>
                    <span className="ml-2 text-xs text-slate-500">{getReviewableName(review)}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-sm">
                    {review.created_at ? new Date(review.created_at).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => { setDeletingReview(review); setShowDeleteModal(true) }}
                      className="text-red-600 hover:text-red-700 font-medium text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Delete Review</h3>
              <p className="text-slate-500 mb-6">
                Are you sure you want to delete this review by <strong>{deletingReview?.user?.first_name} {deletingReview?.user?.last_name}</strong>? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
                >
                  {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
