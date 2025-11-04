import { useEffect, useState } from 'react'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://api.yatta.com.tr'

export default function Health() {
  const [status, setStatus] = useState('checking...')
  const [error, setError] = useState(null)

  useEffect(() => {
    axios.get(`${API_BASE}/health/ping`, { timeout: 5000 })
      .then(res => setStatus(JSON.stringify(res.data)))
      .catch(err => setError(err.message))
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
