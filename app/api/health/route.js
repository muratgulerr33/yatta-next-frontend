// Server-side health check endpoint (API route)
// GET /api/health → JSON response
// Detaylı health check: frontend durumu, backend bağlantısı, sistem bilgileri

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.yatta.com.tr'
  const startTime = Date.now()
  
  const healthData = {
    status: 'ok',
    frontend: {
      framework: 'nextjs-ssr',
      version: process.env.npm_package_version || '15.5.6',
      nodeEnv: process.env.NODE_ENV || 'production',
      timestamp: new Date().toISOString(),
    },
    backend: null,
    checks: {
      backend: { status: 'unknown', latency: null },
    },
  }
  
  try {
    // Backend health check
    const backendStartTime = Date.now()
    const response = await fetch(`${API_BASE}/health/ping`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Next.js fetch cache kontrolü
      next: { revalidate: 0 },
      signal: AbortSignal.timeout(5000), // 5 saniye timeout
    })
    
    const backendLatency = Date.now() - backendStartTime
    const data = await response.json()
    
    healthData.backend = data
    healthData.checks.backend = {
      status: response.ok ? 'healthy' : 'unhealthy',
      latency: `${backendLatency}ms`,
      httpStatus: response.status,
    }
    
    if (!response.ok) {
      healthData.status = 'degraded'
    }
  } catch (error) {
    healthData.status = 'degraded'
    healthData.checks.backend = {
      status: 'error',
      error: error.message,
      latency: null,
    }
  }
  
  // Total response time
  const totalLatency = Date.now() - startTime
  healthData.checks.totalLatency = `${totalLatency}ms`
  
  // HTTP status code
  const httpStatus = healthData.status === 'ok' ? 200 : 503
  
  return Response.json(healthData, { status: httpStatus })
}

