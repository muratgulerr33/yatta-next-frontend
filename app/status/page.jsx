// Status Monitor Page - Status monitoring component'ini gösterir
'use client'

import StatusMonitor from '@/components/StatusMonitor'

export default function StatusPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <StatusMonitor />
      </div>
    </div>
  )
}

