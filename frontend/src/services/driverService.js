import apiClient from './apiClient'

// ==================== Driver Profile ====================
// Base: /api/v1/drivers (apiResource)

export async function getDriverProfile(userId) {
  const response = await apiClient.get(`/drivers?user_id=${userId}`)
  return response.data
}

export async function getOrCreateDriverProfile() {
  const response = await apiClient.post('/drivers/profile')
  return response.data
}

export async function getDriver(id) {
  const response = await apiClient.get(`/drivers/${id}`)
  return response.data
}

export async function updateDriverProfile(id, data) {
  const response = await apiClient.put(`/drivers/${id}`, data)
  return response.data
}

// ==================== Vehicle Management ====================
// Base: /api/v1/drivers/{driverId}/vehicles

export async function getDriverVehicles(driverId) {
  const response = await apiClient.get(`/drivers/${driverId}/vehicles`)
  return response.data
}

export async function createVehicle(driverId, data) {
  const response = await apiClient.post(`/drivers/${driverId}/vehicles`, data)
  return response.data
}

export async function getVehicle(id) {
  const response = await apiClient.get(`/vehicles/${id}`)
  return response.data
}

export async function updateVehicle(id, data) {
  const response = await apiClient.put(`/vehicles/${id}`, data)
  return response.data
}

export async function deleteVehicle(id) {
  const response = await apiClient.delete(`/vehicles/${id}`)
  return response.data
}

// ==================== Transport Bookings ====================
// Base: /api/v1/transport-bookings

export async function getDriverBookings(status = null) {
  let url = '/transport-bookings'
  if (status && status !== 'All') {
    url += `?status=${status}`
  }
  const response = await apiClient.get(url)
  return response.data
}

export async function getDriverBooking(id) {
  const response = await apiClient.get(`/transport-bookings/${id}`)
  return response.data
}

export async function updateBookingStatus(id, status) {
  const response = await apiClient.patch(`/transport-bookings/${id}/status`, { status })
  return response.data
}

export async function cancelBooking(id) {
  const response = await apiClient.patch(`/transport-bookings/${id}/cancel`)
  return response.data
}

// ==================== Utilities ====================

export async function getCities() {
  const response = await apiClient.get('/cities')
  return response.data
}
