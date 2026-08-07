import apiClient from './apiClient'

// ==================== Hotel Management ====================
// Base: /api/v1/hotel-manager/manage-hotel (apiResource)

export async function getManagerHotels() {
  const response = await apiClient.get('/hotel-manager/manage-hotel')
  return response.data
}

export async function getManagerHotel(id) {
  const response = await apiClient.get(`/hotel-manager/manage-hotel/${id}`)
  return response.data
}

export async function createHotel(data) {
  const response = await apiClient.post('/hotel-manager/manage-hotel', data)
  return response.data
}

export async function updateHotel(id, data) {
  const response = await apiClient.put(`/hotel-manager/manage-hotel/${id}`, data)
  return response.data
}

export async function deleteHotel(id) {
  const response = await apiClient.delete(`/hotel-manager/manage-hotel/${id}`)
  return response.data
}

export async function getTrashedHotels() {
  const response = await apiClient.get('/hotel-manager/manage-hotel/trashed')
  return response.data
}

export async function restoreHotel(id) {
  const response = await apiClient.post(`/hotel-manager/manage-hotel/${id}/restore`)
  return response.data
}

export async function forceDeleteHotel(id) {
  const response = await apiClient.delete(`/hotel-manager/manage-hotel/${id}/force-delete`)
  return response.data
}

// ==================== Room Management ====================
// Base: /api/v1/hotel-manager/manage-rooms (apiResource except show)
// Show: GET /manage-rooms/{room} (withTrashed)
// Restore: POST /manage-rooms/{room}/restore
// Force delete: DELETE /manage-rooms/{room}/force-delete

export async function getManagerRooms() {
  const response = await apiClient.get('/hotel-manager/manage-rooms')
  return response.data
}

export async function getManagerRoom(id) {
  const response = await apiClient.get(`/hotel-manager/manage-rooms/${id}`)
  return response.data
}

export async function createRoom(data) {
  const response = await apiClient.post('/hotel-manager/manage-rooms', data)
  return response.data
}

export async function updateRoom(id, data) {
  const response = await apiClient.put(`/hotel-manager/manage-rooms/${id}`, data)
  return response.data
}

export async function deleteRoom(id) {
  const response = await apiClient.delete(`/hotel-manager/manage-rooms/${id}`)
  return response.data
}

export async function getTrashedRooms() {
  const response = await apiClient.get('/hotel-manager/manage-rooms/trashed')
  return response.data
}

export async function restoreRoom(id) {
  const response = await apiClient.post(`/hotel-manager/manage-rooms/${id}/restore`)
  return response.data
}

export async function forceDeleteRoom(id) {
  const response = await apiClient.delete(`/hotel-manager/manage-rooms/${id}/force-delete`)
  return response.data
}

// ==================== Room Routes (by hotel) ====================
// GET /api/v1/hotels/{hotelId}/rooms - List rooms for a specific hotel

export async function getHotelRooms(hotelId) {
  const response = await apiClient.get(`/hotels/${hotelId}/rooms`)
  return response.data
}

// ==================== Bookings Management ====================
// Base: /api/v1/hotel-bookings (apiResource)
// Hotel manager sees only bookings for their hotels
// Status update: PATCH /hotel-bookings/{booking}/status (confirm/complete only)
// Cancel: PATCH /hotel-bookings/{booking}/cancel

export async function getManagerBookings(filters = {}) {
  const params = new URLSearchParams()
  if (filters.status) params.append('status', filters.status)
  if (filters.per_page) params.append('per_page', filters.per_page)

  const queryString = params.toString()
  const url = `/hotel-bookings${queryString ? `?${queryString}` : ''}`
  const response = await apiClient.get(url)
  return response.data
}

export async function getBooking(id) {
  const response = await apiClient.get(`/hotel-bookings/${id}`)
  return response.data
}

export async function updateBookingStatus(id, status) {
  const response = await apiClient.patch(`/hotel-bookings/${id}/status`, { status })
  return response.data
}

export async function cancelBooking(id) {
  const response = await apiClient.patch(`/hotel-bookings/${id}/cancel`)
  return response.data
}

// ==================== Dashboard Stats ====================
// Fetches manager's hotels and calculates stats client-side

export async function getDashboardStats() {
  const response = await apiClient.get('/hotel-manager/manage-hotel')
  const hotels = response.data.data || []

  const totalRooms = hotels.reduce((sum, hotel) => sum + (hotel.rooms_count || 0), 0)
  const avgRating = hotels.length > 0
    ? (hotels.reduce((sum, hotel) => sum + (hotel.rating || 0), 0) / hotels.length).toFixed(1)
    : '0.0'

  return {
    total_hotels: hotels.length,
    total_rooms: totalRooms,
    avg_rating: avgRating,
    hotels,
  }
}

// ==================== Utilities ====================

export async function getCities() {
  const response = await apiClient.get('/cities')
  return response.data
}
