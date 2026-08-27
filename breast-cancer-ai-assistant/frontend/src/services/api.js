import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
})

// Add a request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

export const login = (email, password) => {
  const form = new URLSearchParams()
  form.append('username', email)
  form.append('password', password)
  return api.post('/auth/login', form)
}

export const signup = (email, password, fullName) => {
  return api.post('/auth/signup', { email, password, full_name: fullName })
}

export const getMe = () => api.get('/auth/me')

export const chatWithAssistant = (message, language = 'en') =>
  api.post('/chat', { message, language })

export const uploadReport = (file, documentType) => {
  const form = new FormData()
  form.append('file', file)
  form.append('document_type', documentType)
  return api.post('/reports/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const getReport = (reportId) => api.get(`/reports/${reportId}`)

export const getReports = () => api.get('/reports')

export const deleteReport = (reportId) => api.delete(`/reports/${reportId}`)

export const getTimeline = (marker, documentType) =>
  api.get(`/trends/timeline`, { params: { marker, ...(documentType && documentType !== 'all' ? { document_type: documentType } : {}) } })

export const compareReports = (id1, id2, language = 'en') =>
  api.get(`/trends/compare`, { params: { id1, id2, language } })

export const sendChatMessage = (message, reportId) =>
  api.post('/chat', { message, report_id: reportId })

export const translateText = (text, targetLang) =>
  api.post('/translate', { text, target_lang: targetLang })

export const translateTextBatch = (texts, targetLang) =>
  api.post('/translate/batch', { texts, target_lang: targetLang })

export default api

