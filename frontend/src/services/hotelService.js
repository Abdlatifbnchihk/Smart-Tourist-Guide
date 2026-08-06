import apiClient from './apiClient'

export async function getHotel(id) {
  const response = await apiClient.get(`/hotels/${id}`)
  return response.data
}

export async function getRooms(hotelId, filters = {}) {
  const params = new URLSearchParams()
  if (filters.room_type) params.append('room_type', filters.room_type)
  if (filters.availability) params.append('availability', filters.availability)
  if (filters.min_price) params.append('min_price', filters.min_price)
  if (filters.max_price) params.append('max_price', filters.max_price)

  const queryString = params.toString()
  const url = `/hotels/${hotelId}/rooms${queryString ? `?${queryString}` : ''}`
  const response = await apiClient.get(url)
  return response.data
}

export async function addFavorite(hotelId) {
  const response = await apiClient.post(`/hotels/${hotelId}/favorites`)
  return response.data
}

export async function removeFavorite(hotelId) {
  const response = await apiClient.delete(`/hotels/${hotelId}/favorites`)
  return response.data
}
