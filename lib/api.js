// API Client - Centralized API configuration and error handling
import axios from 'axios'

// API Base URL (environment variable'dan alınır)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.yatta.com.tr'

// Axios instance oluştur (tüm API çağrıları için ortak config)
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 saniye timeout
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor (her istekte çalışır)
apiClient.interceptors.request.use(
  (config) => {
    // Token varsa ekle (gelecekte authentication için)
    // const token = localStorage.getItem('token')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    
    // Logging (development'ta)
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`)
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor (her response'ta çalışır)
apiClient.interceptors.response.use(
  (response) => {
    // Başarılı response'ları direkt döndür
    return response
  },
  (error) => {
    // Error handling
    if (error.response) {
      // Server'dan gelen error response
      const { status, data } = error.response
      
      // 401 Unauthorized - Token yenileme veya login'e yönlendirme
      if (status === 401) {
        // localStorage.removeItem('token')
        // window.location.href = '/login'
        console.error('[API] Unauthorized - Authentication required')
      }
      
      // 403 Forbidden
      if (status === 403) {
        console.error('[API] Forbidden - Access denied')
      }
      
      // 404 Not Found
      if (status === 404) {
        console.error('[API] Not Found - Endpoint does not exist')
      }
      
      // 500 Server Error
      if (status >= 500) {
        console.error('[API] Server Error - Backend issue')
      }
      
      // Error mesajını döndür
      return Promise.reject({
        message: data?.message || data?.error || 'An error occurred',
        status,
        data,
      })
    } else if (error.request) {
      // Request gönderildi ama response alınamadı (network error)
      console.error('[API] Network Error - No response received')
      return Promise.reject({
        message: 'Network error - Please check your connection',
        status: 0,
      })
    } else {
      // Request setup hatası
      console.error('[API] Request Error -', error.message)
      return Promise.reject({
        message: error.message || 'An unexpected error occurred',
        status: 0,
      })
    }
  }
)

// API fonksiyonları
export const api = {
  // Health check
  health: {
    ping: () => apiClient.get('/health/ping'),
  },
  
  // AI endpoints (örnek - gerçek endpoint'lere göre güncellenebilir)
  ai: {
    // Örnek endpoint'ler - gerçek API'ye göre güncellenmeli
    // chat: (data) => apiClient.post('/api/ai/chat', data),
    // generate: (data) => apiClient.post('/api/ai/generate', data),
  },
  
  // Genel GET/POST/PUT/DELETE helper'ları
  get: (url, config) => apiClient.get(url, config),
  post: (url, data, config) => apiClient.post(url, data, config),
  put: (url, data, config) => apiClient.put(url, data, config),
  delete: (url, config) => apiClient.delete(url, config),
}

// Export axios instance (gerekirse direkt kullanım için)
export default apiClient

