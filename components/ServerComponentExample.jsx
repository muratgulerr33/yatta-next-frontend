// Server Component Example - Next.js Server Components ile API çağrıları
// Bu component server-side'da render edilir, SEO-friendly ve hızlı

import { api } from '@/lib/api'

// Server Component (async function olabilir)
export default async function ServerComponentExample() {
  // Server-side'da direkt API çağrısı yapabiliriz
  // Bu çağrı build-time veya request-time'da yapılır
  
  let data = null
  let error = null
  
  try {
    // Server-side fetch (Next.js fetch ile otomatik cache)
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.yatta.com.tr'}/health/ping`, {
      // Next.js fetch cache kontrolü
      next: { revalidate: 60 }, // 60 saniye cache
    })
    
    if (response.ok) {
      data = await response.json()
    } else {
      error = `HTTP ${response.status}`
    }
  } catch (err) {
    error = err.message
  }
  
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Server Component Example</h2>
      
      {error ? (
        <p className="text-red-600">Error: {error}</p>
      ) : data ? (
        <div>
          <p className="text-green-600">✅ Backend connected</p>
          <pre className="mt-2 p-3 bg-gray-100 rounded text-sm overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      
      <p className="mt-4 text-sm text-gray-600">
        This component is rendered on the server. It's SEO-friendly and fast!
      </p>
    </div>
  )
}

