import apiClient from './apiClient'

export async function getMyReviews() {
  const response = await apiClient.get('/reviews')
  return response.data
}

export async function updateReview(id, data) {
  const response = await apiClient.put(`/reviews/${id}`, data)
  return response.data
}

export async function deleteReview(id) {
  const response = await apiClient.delete(`/reviews/${id}`)
  return response.data
}
