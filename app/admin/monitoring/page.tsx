'use client'

import { useEffect, useState } from 'react'

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  uptime: number
  checks: {
    database: {
      status: 'pass' | 'fail'
      responseTime?: number
    }
    memory: {
      status: 'pass' | 'warn' | 'fail'
      usage: number
      limit: number
    }
  }
}

export default function MonitoringPage() {
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchHealth = async () => {
    try {
      const res = await fetch('/api/health')
      const data = await res.json()
      setHealth(data)
    } catch (error) {
      console.error('Failed to fetch health status', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHealth()
    const interval = setInterval(fetchHealth, 30000) // Refresh every 30s
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  const statusColor = {
    healthy: 'bg-green-500',
    degraded: 'bg-yellow-500',
    unhealthy: 'bg-red-500',
  }[health?.status || 'unhealthy']

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">System Monitoring</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Overall Status */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Overall Status</h2>
          <div className={`${statusColor} text-white px-4 py-2 rounded text-center font-bold uppercase`}>
            {health?.status}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Uptime: {Math.floor((health?.uptime || 0) / 3600)}h {Math.floor(((health?.uptime || 0) % 3600) / 60)}m
          </p>
        </div>

        {/* Database Status */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Database</h2>
          <div className={`${health?.checks.database.status === 'pass' ? 'bg-green-500' : 'bg-red-500'} text-white px-4 py-2 rounded text-center font-bold`}>
            {health?.checks.database.status === 'pass' ? 'Connected' : 'Disconnected'}
          </div>
          {health?.checks.database.responseTime && (
            <p className="text-sm text-gray-500 mt-2">
              Response time: {health.checks.database.responseTime}ms
            </p>
          )}
        </div>

        {/* Memory Status */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Memory</h2>
          <div className={`${
            health?.checks.memory.status === 'pass' ? 'bg-green-500' :
            health?.checks.memory.status === 'warn' ? 'bg-yellow-500' : 'bg-red-500'
          } text-white px-4 py-2 rounded text-center font-bold uppercase`}>
            {health?.checks.memory.status}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Usage: {((health?.checks.memory.usage || 0) / 1024 / 1024).toFixed(2)} MB / 
            {((health?.checks.memory.limit || 0) / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
      </div>

      <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Last Health Check</h2>
        <p className="text-sm text-gray-600">
          {health?.timestamp ? new Date(health.timestamp).toLocaleString() : 'N/A'}
        </p>
      </div>
    </div>
  )
}
