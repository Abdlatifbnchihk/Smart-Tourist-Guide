import apiClient from './apiClient'

export async function getUsers(params = {}) {
  const query = new URLSearchParams()
  if (params.role) query.append('role', params.role)
  if (params.status) query.append('status', params.status)
  if (params.active !== undefined && params.active !== '') query.append('active', params.active)
  if (params.search) query.append('search', params.search)
  if (params.page) query.append('page', params.page)

  const qs = query.toString()
  const response = await apiClient.get(`/admin/users${qs ? '?' + qs : ''}`)
  return response.data
}

export async function getUser(id) {
  const response = await apiClient.get(`/admin/users/${id}`)
  return response.data
}

export async function createUser(data) {
  const response = await apiClient.post('/admin/users', data)
  return response.data
}

export async function updateUser(id, data) {
  const response = await apiClient.put(`/admin/users/${id}`, data)
  return response.data
}

export async function deleteUser(id) {
  const response = await apiClient.delete(`/admin/users/${id}`)
  return response.data
}

export async function getCities() {
  const response = await apiClient.get('/cities')
  return Array.isArray(response.data) ? response.data : response.data.data
}
