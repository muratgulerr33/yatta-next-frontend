// Status Monitoring Component - API ve App durumlarını kontrol eder
// Eski React/Vite yapısındaki linklet component'inin Next.js versiyonu

'use client'

import { useEffect, useState, useCallback } from 'react'

const INITIAL_SERVICES = [
  {
    name: 'API',
    url: 'https://api.yatta.com.tr',
    status: 'checking',
    latency: null,
    error: null,
  },
  {
    name: 'App',
    url: 'https://app.yatta.com.tr',
    status: 'checking',
    latency: null,
    error: null,
  },
  {
    name: 'Frontend',
    url: 'https://yatta.com.tr',
    status: 'checking',
    latency: null,
    error: null,
  },
]

export default function StatusMonitor() {
  const [services, setServices] = useState(INITIAL_SERVICES)
  const [lastCheck, setLastCheck] = useState(null)

  const checkService = async (service) => {
    const startTime = Date.now()
    
    try {
      // Health endpoint'lerini kontrol et
      let healthUrl = ''
      if (service.url.includes('api.yatta.com.tr')) {
        healthUrl = `${service.url}/health/ping`
      } else if (service.url.includes('app.yatta.com.tr')) {
        healthUrl = `${service.url}/health/ping` // App için de health endpoint olabilir
      } else {
        // Frontend için Next.js health endpoint (API route)
        // Not: /api/health doğru endpoint, Content-Type kontrolü yapılacak
        healthUrl = `${service.url}/api/health`
      }

      const response = await fetch(healthUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000), // 5 saniye timeout
        mode: 'cors', // CORS mode açık
      })

      const latency = Date.now() - startTime

      if (response.ok) {
        // Content-Type kontrolü - JSON olmalı
        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json()
          return {
            ...service,
            status: 'healthy',
            latency,
            error: null,
          }
        } else {
          // JSON değilse (HTML dönüyorsa) hata olarak işaretle
          return {
            ...service,
            status: 'unhealthy',
            latency,
            error: 'Invalid response format',
          }
        }
      } else {
        return {
          ...service,
          status: 'unhealthy',
          latency,
          error: `HTTP ${response.status}`,
        }
      }
    } catch (error) {
      const latency = Date.now() - startTime
      // JSON parse hatası için özel mesaj
      const errorMessage = error.message?.includes('JSON') 
        ? 'JSON parse error' 
        : error.message || 'Connection failed'
      return {
        ...service,
        status: 'error',
        latency: latency < 5000 ? latency : null,
        error: errorMessage,
      }
    }
  }

  const checkAllServices = useCallback(async () => {
    console.log('[StatusMonitor] Checking all services...')
    
    // Tüm servisleri "checking" durumuna getir
    setServices(prev => prev.map(s => ({ ...s, status: 'checking', latency: null, error: null })))
    
    // Tüm servisleri paralel kontrol et
    const results = await Promise.all(
      INITIAL_SERVICES.map(service => checkService(service))
    )
    
    console.log('[StatusMonitor] Results:', results)
    setServices(results)
    setLastCheck(new Date())
  }, [])

  const handleRefresh = () => {
    console.log('[StatusMonitor] Manual refresh triggered')
    checkAllServices()
  }

  useEffect(() => {
    // İlk kontrol
    checkAllServices()

    // Her 30 saniyede bir kontrol et
    const interval = setInterval(() => {
      checkAllServices()
    }, 30000)

    return () => clearInterval(interval)
  }, [checkAllServices])

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-500'
      case 'unhealthy':
        return 'bg-yellow-500'
      case 'error':
        return 'bg-red-500'
      default:
        return 'bg-gray-400'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'healthy':
        return 'Sağlıklı'
      case 'unhealthy':
        return 'Sorunlu'
      case 'error':
        return 'Hata'
      default:
        return 'Kontrol ediliyor...'
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Servis Durumları</h2>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
        >
          Yenile
        </button>
      </div>

      <div className="space-y-4">
        {services.map((service, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-4 h-4 rounded-full ${getStatusColor(service.status)} ${
                  service.status === 'checking' ? 'animate-pulse' : ''
                }`}
              />
              <div>
                <h3 className="font-semibold text-lg">{service.name}</h3>
                <p className="text-sm text-gray-600">{service.url}</p>
              </div>
            </div>

            <div className="text-right">
              <p
                className={`font-medium ${
                  service.status === 'healthy'
                    ? 'text-green-600'
                    : service.status === 'unhealthy'
                    ? 'text-yellow-600'
                    : service.status === 'error'
                    ? 'text-red-600'
                    : 'text-gray-500'
                }`}
              >
                {getStatusText(service.status)}
              </p>
              {service.latency !== null && (
                <p className="text-sm text-gray-500">
                  {service.latency}ms
                </p>
              )}
              {service.error && (
                <p className="text-sm text-red-500 mt-1">{service.error}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-sm text-gray-500 text-center">
        {lastCheck ? (
          <>Son kontrol: {lastCheck.toLocaleTimeString('tr-TR')}</>
        ) : (
          <>Kontrol ediliyor...</>
        )}
      </div>
    </div>
  )
}
