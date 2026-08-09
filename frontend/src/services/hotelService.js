import apiClient from './apiClient'

export async function getHotels(filters = {}) {
  const params = new URLSearchParams()
  if (filters.city_id) params.append('city_id', filters.city_id)
  if (filters.star_rating) params.append('star_rating', filters.star_rating)
  if (filters.search) params.append('search', filters.search)

  const queryString = params.toString()
  const url = `/hotels${queryString ? `?${queryString}` : ''}`
  const response = await apiClient.get(url)
  return response.data.data || response.data || []
}

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

export async function toggleHotelFavorite(hotelId) {
  const response = await apiClient.post('/favorites/toggle', { type: 'hotel', id: parseInt(hotelId, 10) })
  return response.data
}
