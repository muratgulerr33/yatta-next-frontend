// Client-side State Management - Context API ile basit state management
'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { api } from '@/lib/api'

// State Context oluştur
const AppStateContext = createContext()

// Custom hook - State'e erişim için
export function useAppState() {
  const context = useContext(AppStateContext)
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider')
  }
  return context
}

// State Provider Component
export function AppStateProvider({ children }) {
  // Global state
  const [backendStatus, setBackendStatus] = useState('unknown')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  // Backend health check
  const checkBackendHealth = async () => {
    setLoading(true)
    setError(null)
    
    // Artık throw etmeyeceği için try-catch gereksiz
    const response = await api.health.ping()
    
    if (response.status === 200) {
      setBackendStatus('up')
    } else {
      setBackendStatus('down')
      setError(`Backend health check failed with status ${response.status}`)
    }
    
    setLoading(false)
    return response.data
  }
  
  // Initial health check
  useEffect(() => {
    checkBackendHealth()
  }, [])
  
  // State value
  const value = {
    backendStatus,
    loading,
    error,
    checkBackendHealth,
  }
  
  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  )
}

// Zustand örneği (opsiyonel - kurulum gerekli)
// npm install zustand
/*
import { create } from 'zustand'

export const useStore = create((set) => ({
  backendStatus: 'unknown',
  loading: false,
  error: null,
  
  checkBackendHealth: async () => {
    set({ loading: true, error: null })
    try {
      const response = await api.health.ping()
      set({ backendStatus: 'healthy', loading: false })
      return response.data
    } catch (err) {
      set({ backendStatus: 'unhealthy', error: err.message, loading: false })
      throw err
    }
  },
}))
*/

