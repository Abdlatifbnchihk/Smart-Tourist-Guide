import apiClient, { extractData } from './apiClient'

export async function getCities() {
  const response = await apiClient.get('/cities')
  return extractData(response)
}

export async function getCity(id) {
  const response = await apiClient.get(`/cities/${id}`)
  return response.data
}
