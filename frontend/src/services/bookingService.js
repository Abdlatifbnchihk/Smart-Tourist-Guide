import apiClient from './apiClient'

export async function createHotelBooking(data) {
  const response = await apiClient.post('/hotel-bookings', data)
  return response.data
}

export async function createTransportBooking(data) {
  const response = await apiClient.post('/transport-bookings', data)
  return response.data
}

export async function getDrivers(filters = {}) {
  const params = new URLSearchParams()
  if (filters.city_id) params.append('city_id', filters.city_id)
  if (filters.is_verified !== undefined) params.append('is_verified', filters.is_verified)

  const queryString = params.toString()
  const url = `/drivers${queryString ? `?${queryString}` : ''}`
  const response = await apiClient.get(url)
  return response.data
}

export async function getDriverVehicles(driverId) {
  const response = await apiClient.get(`/drivers/${driverId}/vehicles`)
  return response.data
}

export async function getAllHotelBookings(filters = {}) {
  const params = new URLSearchParams()
  if (filters.status) params.append('status', filters.status)
  if (filters.search) params.append('search', filters.search)

  const queryString = params.toString()
  const url = `/admin/hotel-bookings${queryString ? `?${queryString}` : ''}`
  const response = await apiClient.get(url)
  return response.data
}

export async function getAllTransportBookings(filters = {}) {
  const params = new URLSearchParams()
  if (filters.status) params.append('status', filters.status)
  if (filters.search) params.append('search', filters.search)

  const queryString = params.toString()
  const url = `/admin/transport-bookings${queryString ? `?${queryString}` : ''}`
  const response = await apiClient.get(url)
  return response.data
}

export async function getBookingStats() {
  const response = await apiClient.get('/admin/booking-stats')
  return response.data
}

export async function updateHotelBookingStatus(id, status) {
  const response = await apiClient.patch(`/admin/hotel-bookings/${id}/status`, { status })
  return response.data
}

export async function cancelHotelBooking(id) {
  const response = await apiClient.patch(`/admin/hotel-bookings/${id}/status`, { status: 'cancelled' })
  return response.data
}

export async function updateTransportBookingStatus(id, status) {
  const response = await apiClient.patch(`/admin/transport-bookings/${id}/status`, { status })
  return response.data
}

export async function cancelTransportBooking(id) {
  const response = await apiClient.patch(`/admin/transport-bookings/${id}/status`, { status: 'cancelled' })
  return response.data
}

export async function deleteHotelBooking(id) {
  const response = await apiClient.delete(`/admin/hotel-bookings/${id}`)
  return response.data
}

export async function deleteTransportBooking(id) {
  const response = await apiClient.delete(`/admin/transport-bookings/${id}`)
  return response.data
}

// Tourist-facing booking functions
export async function getMyHotelBookings(filters = {}) {
  const params = new URLSearchParams()
  if (filters.status) params.append('status', filters.status)
  const queryString = params.toString()
  const url = `/hotel-bookings${queryString ? `?${queryString}` : ''}`
  const response = await apiClient.get(url)
  return response.data
}

export async function getMyTransportBookings(filters = {}) {
  const params = new URLSearchParams()
  if (filters.status) params.append('status', filters.status)
  const queryString = params.toString()
  const url = `/transport-bookings${queryString ? `?${queryString}` : ''}`
  const response = await apiClient.get(url)
  return response.data
}

export async function getMyBookingDetail(id, type) {
  if (type === 'transport') {
    const response = await apiClient.get(`/transport-bookings/${id}`)
    return response.data
  }
  if (type === 'hotel') {
    const response = await apiClient.get(`/hotel-bookings/${id}`)
    return response.data
  }
  // Try hotel first, then transport if not found
  try {
    const response = await apiClient.get(`/hotel-bookings/${id}`)
    return response.data
  } catch {
    const response = await apiClient.get(`/transport-bookings/${id}`)
    return response.data
  }
}

export async function getMyTransportBookingDetail(id) {
  const response = await apiClient.get(`/transport-bookings/${id}`)
  return response.data
}

export async function cancelMyHotelBooking(id) {
  const response = await apiClient.patch(`/hotel-bookings/${id}/cancel`)
  return response.data
}

export async function cancelMyTransportBooking(id) {
  const response = await apiClient.patch(`/transport-bookings/${id}/cancel`)
  return response.data
}
