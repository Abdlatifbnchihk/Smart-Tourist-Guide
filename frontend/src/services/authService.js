import apiClient from './apiClient'

export async function register(data) {
  if(!data){
    console.log('the data varaible is empty');
  }
  const response = await apiClient.post('/auth/register', data)
  return response.data
}

export async function login(email, password) {
  const response = await apiClient.post('/auth/login', { email, password })
  return response.data
}

export async function logout() {
  const response = await apiClient.post('/auth/logout')
  return response.data
}

export async function getMe() {
  const response = await apiClient.get('/auth/me')
  return response.data
}

export async function getProfile() {
  const response = await apiClient.get('/profile')
  return response.data
}

export async function updateProfile(data) {
  const response = await apiClient.put('/profile', data)
  return response.data
}

export async function updateDriverProfile(data) {
  const response = await apiClient.put('/profile/driver', data)
  return response.data
}

export async function getTokens() {
  const response = await apiClient.get('/tokens')
  return response.data
}

export async function createToken(name) {
  const response = await apiClient.post('/tokens', { name })
  return response.data
}

export async function revokeToken(id) {
  const response = await apiClient.delete(`/tokens/${id}`)
  return response.data
}

export async function revokeAllTokens() {
  const response = await apiClient.delete('/tokens')
  return response.data
}
