import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createReview, getMyReviews } from '../../services/reviewService'
import { getMyHotelBookings, getMyTransportBookings } from '../../services/bookingService'
import Skeleton from '../../components/ui/Skeleton'

function StarRatingSelector({ rating, onChange }) {
  const [hovered, setHovered] = useState(0)

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="w-8 h-8 focus:outline-none"
          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
        >
          <svg
            className={`w-8 h-8 ${(hovered || rating) >= star ? 'text-amber-400' : 'text-slate-300'} transition-colors`}
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

export default function WriteReviewPage() {
  const navigate = useNavigate()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [selectedEntity, setSelectedEntity] = useState(null)
  const [errors, setErrors] = useState({})

  const { data: reviewsResponse } = useQuery({
    queryKey: ['my-reviews'],
    queryFn: getMyReviews,
  })

  const { data: hotelBookingsRes, isLoading: loadingHotels } = useQuery({
    queryKey: ['my-hotel-bookings', 'Completed'],
    queryFn: () => getMyHotelBookings({ status: 'Completed' }),
  })

  const { data: transportBookingsRes, isLoading: loadingTransport } = useQuery({
    queryKey: ['my-transport-bookings', 'Completed'],
    queryFn: () => getMyTransportBookings({ status: 'Completed' }),
  })

  const existingReviews = reviewsResponse?.data?.data || reviewsResponse?.data || []
  const hotelBookings = hotelBookingsRes?.data?.data || hotelBookingsRes?.data || []
  const transportBookings = transportBookingsRes?.data?.data || transportBookingsRes?.data || []

  const reviewableEntities = useMemo(() => {
    const entities = []
    const reviewedHotelIds = new Set(existingReviews.filter(r => r.hotel_id).map(r => r.hotel_id))
    const reviewedDriverIds = new Set(existingReviews.filter(r => r.driver_id).map(r => r.driver_id))
    const reviewedAttractionIds = new Set(existingReviews.filter(r => r.attraction_id).map(r => r.attraction_id))

    hotelBookings.forEach((booking) => {
      const hotel = booking.room?.hotel
      if (hotel && !reviewedHotelIds.has(hotel.id)) {
        entities.push({
          id: hotel.id,
          type: 'hotel',
          name: hotel.name,
          bookingId: booking.id,
        })
        reviewedHotelIds.add(hotel.id)
      }

      const driver = booking.driver
      if (driver && !reviewedDriverIds.has(driver.id)) {
        entities.push({
          id: driver.id,
          type: 'driver',
          name: `${driver.user?.first_name || ''} ${driver.user?.last_name || ''}`.trim() || `Driver #${driver.id}`,
          bookingId: booking.id,
        })
        reviewedDriverIds.add(driver.id)
      }
    })

    transportBookings.forEach((booking) => {
      const driver = booking.driver
      if (driver && !reviewedDriverIds.has(driver.id)) {
        entities.push({
          id: driver.id,
          type: 'driver',
          name: `${driver.user?.first_name || ''} ${driver.user?.last_name || ''}`.trim() || `Driver #${driver.id}`,
          bookingId: booking.id,
        })
        reviewedDriverIds.add(driver.id)
      }
    })

    return entities
  }, [hotelBookings, transportBookings, existingReviews])

  const createMutation = useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      navigate('/my-reviews')
    },
  })

  const validate = () => {
    const newErrors = {}

    if (!rating) {
      newErrors.rating = 'Please select a rating'
    }

    if (!comment.trim()) {
      newErrors.comment = 'Please enter a comment'
    } else if (comment.length > 1000) {
      newErrors.comment = 'Comment must be 1000 characters or less'
    }

    if (!selectedEntity) {
      newErrors.entity = 'Please select an entity to review'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    const payload = {
      rating,
      comment: comment.trim(),
    }

    if (selectedEntity.type === 'hotel') {
      payload.hotel_id = selectedEntity.id
    } else if (selectedEntity.type === 'attraction') {
      payload.attraction_id = selectedEntity.id
    } else if (selectedEntity.type === 'driver') {
      payload.driver_id = selectedEntity.id
    }

    createMutation.mutate(payload)
  }

  const isLoading = loadingHotels || loadingTransport

  if (isLoading) {
    return (
      <div className="pt-24 pb-12 px-4 bg-slate-50 min-h-screen">
        <div className="max-w-2xl mx-auto space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-12 px-4 bg-slate-50 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Write a Review</h1>
          <p className="text-slate-500 mt-1">Share your experience with others</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Select Entity to Review <span className="text-red-500">*</span>
            </label>
            {reviewableEntities.length === 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-sm">
                  You don't have any completed bookings to review. Complete a booking first to leave a review.
                </p>
              </div>
            ) : (
              <select
                value={selectedEntity ? `${selectedEntity.type}-${selectedEntity.id}` : ''}
                onChange={(e) => {
                  const entity = reviewableEntities.find(
                    (ent) => `${ent.type}-${ent.id}` === e.target.value
                  )
                  setSelectedEntity(entity || null)
                }}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="">Select an entity</option>
                {reviewableEntities.map((entity) => (
                  <option key={`${entity.type}-${entity.id}`} value={`${entity.type}-${entity.id}`}>
                    {entity.name} ({entity.type})
                  </option>
                ))}
              </select>
            )}
            {errors.entity && (
              <p className="text-red-500 text-sm mt-1">{errors.entity}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Rating <span className="text-red-500">*</span>
            </label>
            <StarRatingSelector rating={rating} onChange={setRating} />
            {errors.rating && (
              <p className="text-red-500 text-sm mt-1">{errors.rating}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Comment <span className="text-red-500">*</span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              maxLength={1000}
              placeholder="Write your review here..."
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
            />
            <div className="flex justify-between mt-1">
              {errors.comment && (
                <p className="text-red-500 text-sm">{errors.comment}</p>
              )}
              <p className="text-slate-400 text-sm ml-auto">{comment.length}/1000</p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/my-reviews')}
              className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || reviewableEntities.length === 0}
              className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium disabled:opacity-50 transition-colors"
            >
              {createMutation.isPending ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>

          {createMutation.isError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm">
                {createMutation.error?.response?.data?.message || 'Failed to submit review. Please try again.'}
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
