import apiClient from './apiClient'

export async function getFavorites(type = '') {
  const params = new URLSearchParams()
  if (type) params.append('type', type)
  const queryString = params.toString()
  const url = `/favorites${queryString ? `?${queryString}` : ''}`
  const response = await apiClient.get(url)
  return response.data
}

export async function removeFavorite(id) {
  const response = await apiClient.delete(`/favorites/${id}`)
  return response.data
}

export async function toggleFavorite(type, id) {
  const response = await apiClient.post('/favorites/toggle', { type, id })
  return response.data
}
