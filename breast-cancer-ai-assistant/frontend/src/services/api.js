import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
})

export const uploadReport = (file, documentType) => {
  const form = new FormData()
  form.append('file', file)
  form.append('document_type', documentType)
  return api.post('/reports/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const getReport = (reportId) => api.get(`/reports/${reportId}`)

export const getTrends = (patientId, marker) =>
  api.get(`/trends/${patientId}`, { params: { marker } })

export const sendChatMessage = (message, reportId) =>
  api.post('/chat', { message, report_id: reportId })

export const translateText = (text, targetLang) =>
  api.post('/translate', { text, target_lang: targetLang })

export const translateTextBatch = (texts, targetLang) =>
  api.post('/translate/batch', { texts, target_lang: targetLang })

export default api
