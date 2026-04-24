const API_URL = import.meta.env.VITE_API_URL || 'https://api.assist-ambu.fr/api'

const request = async (method, endpoint, data = null) => {
  const token = localStorage.getItem('token')

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }

  if (token) headers['Authorization'] = `Bearer ${token}`

  const options = { method, headers }
  if (data) options.body = JSON.stringify(data)

  const response = await fetch(`${API_URL}${endpoint}`, options)
  const json = await response.json()

  if (!response.ok) throw { status: response.status, errors: json }

  return json
}

export const api = {
  get:    (endpoint)       => request('GET',    endpoint),
  post:   (endpoint, data) => request('POST',   endpoint, data),
  put:    (endpoint, data) => request('PUT',    endpoint, data),
  delete: (endpoint)       => request('DELETE', endpoint),
}

export const authApi = {
  me:     () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
}

export const usersApi = {
  index:   ()           => api.get('/admin/users'),
  show:    (id)         => api.get(`/admin/users/${id}`),
  update:  (id, data)   => api.put(`/admin/users/${id}`, data),
  destroy: (id)         => api.delete(`/admin/users/${id}`),
}

export const shiftsApi = {
  index: () => api.get('/admin/shifts'),
  show:  (id) => api.get(`/admin/shifts/${id}`),
}

export const interventionsApi = {
  index: () => api.get('/admin/interventions'),
  show:  (id) => api.get(`/admin/interventions/${id}`),
}

export const itemsApi = {
  index:   ()         => api.get('/admin/items'),
  store:   (data)     => api.post('/admin/items', data),
  update:  (id, data) => api.put(`/admin/items/${id}`, data),
  destroy: (id)       => api.delete(`/admin/items/${id}`),
}

export const hospitalsApi = {
  index:   ()         => api.get('/hospitals'),
  store:   (data)     => api.post('/hospitals', data),
  update:  (id, data) => api.put(`/hospitals/${id}`, data),
  destroy: (id)       => api.delete(`/hospitals/${id}`),
}

export const waitlistApi = {
  index: () => api.get('/waitlist'),
}

export const statsApi = {
  global: () => api.get('/admin/stats'),
}