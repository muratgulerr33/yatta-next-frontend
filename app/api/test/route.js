// API Test Endpoint - Backend entegrasyonu testi
// GET /api/test → Backend API'ye test isteği gönderir

import { api } from '../../../lib/api'
import { env } from '../../../lib/env'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  const testResults = {
    timestamp: new Date().toISOString(),
    frontend: {
      apiBaseUrl: env.apiBaseUrl,
      nodeEnv: env.nodeEnv,
    },
    backend: {
      connected: false,
      latency: null,
      error: null,
    },
  }
  
  try {
    const startTime = Date.now()
    
    // Backend health endpoint'ine istek gönder
    const response = await api.health.ping()
    
    const latency = Date.now() - startTime
    
    testResults.backend = {
      connected: true,
      latency: `${latency}ms`,
      status: response.status,
      data: response.data,
    }
    
    return Response.json(testResults, { status: 200 })
  } catch (error) {
    testResults.backend.error = error.message || 'Unknown error'
    testResults.backend.status = error.status || 0
    
    return Response.json(testResults, { status: 503 })
  }
}

