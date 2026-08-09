import apiClient from './apiClient'

export async function getCities() {
  const response = await apiClient.get('/cities')
  return response.data
}

export async function getCity(id) {
  const response = await apiClient.get(`/cities/${id}`)
  return response.data
}
