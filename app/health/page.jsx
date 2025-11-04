"use client"

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

// Not: Client component'lerde revalidate kullanılamaz
// Cache kontrolü için SSR page component kullanılmalı veya API route kullanılmalı

export default function Health() {
  const [status, setStatus] = useState('checking...')
  const [error, setError] = useState(null)

  useEffect(() => {
    // Önce Next.js API route'u dene
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setStatus(JSON.stringify(data, null, 2)))
      .catch(() => {
        // Fallback: direkt backend API'ye git (api client ile)
        api.health.ping()
          .then(res => setStatus(JSON.stringify(res.data, null, 2)))
          .catch(err => setError(err.message || 'Backend connection failed'))
      })
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-8 rounded-2xl shadow bg-white max-w-xl">
        <h2 className="text-2xl font-semibold mb-3">Backend Health</h2>
        {error ? (
          <p className="text-red-600">Hata: {error}</p>
        ) : (
          <pre className="text-sm bg-slate-100 p-3 rounded">{status}</pre>
        )}
      </div>
    </div>
  )
}

