import apiClient from './apiClient'

export async function getRestaurants() {
  const response = await apiClient.get('/restaurants')
  return response.data
}

export async function getRestaurant(id) {
  const response = await apiClient.get(`/restaurants/${id}`)
  return response.data
}
