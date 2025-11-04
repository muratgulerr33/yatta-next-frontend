// Environment Variables Validation
// Bu dosya environment variable'ların doğru yüklendiğini kontrol eder

/**
 * Environment variables validator
 * Production'da eksik env var'lar için uyarı verir
 */
export function validateEnv() {
  const requiredEnvVars = {
    // Public env vars (client-side'da kullanılabilir)
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    
    // Server-side only env vars (optional)
    // WEBHOOK_SECRET: process.env.WEBHOOK_SECRET,
  }
  
  const missing = []
  const warnings = []
  
  // Required env vars kontrolü
  if (!requiredEnvVars.NEXT_PUBLIC_API_BASE_URL) {
    missing.push('NEXT_PUBLIC_API_BASE_URL')
  }
  
  // URL format kontrolü
  if (requiredEnvVars.NEXT_PUBLIC_API_BASE_URL) {
    try {
      new URL(requiredEnvVars.NEXT_PUBLIC_API_BASE_URL)
    } catch {
      warnings.push('NEXT_PUBLIC_API_BASE_URL is not a valid URL')
    }
  }
  
  // Development'ta console'a yazdır
  if (process.env.NODE_ENV === 'development') {
    if (missing.length > 0) {
      console.warn('[ENV] Missing required environment variables:', missing)
    }
    if (warnings.length > 0) {
      console.warn('[ENV] Environment variable warnings:', warnings)
    }
    console.log('[ENV] API Base URL:', requiredEnvVars.NEXT_PUBLIC_API_BASE_URL)
  }
  
  // Production'da eksik env var varsa error fırlat
  if (process.env.NODE_ENV === 'production' && missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
  
  return {
    valid: missing.length === 0 && warnings.length === 0,
    missing,
    warnings,
    values: requiredEnvVars,
  }
}

// Environment variables export
export const env = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.yatta.com.tr',
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
}

// Validate on import (server-side only)
if (typeof window === 'undefined') {
  validateEnv()
}

