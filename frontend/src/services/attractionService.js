import apiClient from './apiClient'

export async function getAttraction(id) {
  const response = await apiClient.get(`/attractions/${id}`)
  return response.data
}

export async function getAttractions(filters = {}) {
  const params = new URLSearchParams()
  if (filters.city_id) params.append('city_id', filters.city_id)
  if (filters.category) params.append('category', filters.category)
  if (filters.min_price) params.append('min_price', filters.min_price)
  if (filters.max_price) params.append('max_price', filters.max_price)
  if (filters.min_rating) params.append('min_rating', filters.min_rating)
  if (filters.search) params.append('search', filters.search)

  const queryString = params.toString()
  const url = `/attractions${queryString ? `?${queryString}` : ''}`
  const response = await apiClient.get(url)
  return response.data
}

export async function createAttraction(data) {
  const response = await apiClient.post('/attractions', data)
  return response.data
}

export async function updateAttraction(id, data) {
  const response = await apiClient.put(`/attractions/${id}`, data)
  return response.data
}

export async function deleteAttraction(id) {
  const response = await apiClient.delete(`/attractions/${id}`)
  return response.data
}

export async function toggleFavoriteAttraction(attractionId) {
  const response = await apiClient.post('/favorites', {
    type: 'attraction',
    id: attractionId,
  })
  return response.data
}
