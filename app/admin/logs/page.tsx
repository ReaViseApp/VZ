'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

interface ActivityLog {
  id: string
  action: string
  targetType: string | null
  targetId: string | null
  details: any
  ipAddress: string | null
  createdAt: string
  user: {
    username: string
    email: string | null
  }
}

export default function LogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [actionFilter, setActionFilter] = useState('')
  const [targetTypeFilter, setTargetTypeFilter] = useState('')

  useEffect(() => {
    fetchLogs()
  }, [page, actionFilter, targetTypeFilter])

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        perPage: '50',
        ...(actionFilter && { action: actionFilter }),
        ...(targetTypeFilter && { targetType: targetTypeFilter }),
      })

      const response = await fetch(`/api/admin/logs?${params}`)
      if (!response.ok) throw new Error('Failed to fetch logs')
      
      const data = await response.json()
      setLogs(data.logs)
      setTotalPages(data.pagination.totalPages)
    } catch (error) {
      console.error('Error fetching logs:', error)
      toast.error('Failed to load activity logs')
    } finally {
      setLoading(false)
    }
  }

  const getActionColor = (action: string) => {
    if (action.includes('BANNED') || action.includes('REJECTED') || action.includes('DELETED')) {
      return 'text-red-600 bg-red-50'
    }
    if (action.includes('APPROVED') || action.includes('FEATURED') || action.includes('UNBANNED')) {
      return 'text-green-600 bg-green-50'
    }
    if (action.includes('UPDATED') || action.includes('CHANGED')) {
      return 'text-blue-600 bg-blue-50'
    }
    if (action.includes('SUSPENDED')) {
      return 'text-yellow-600 bg-yellow-50'
    }
    return 'text-gray-600 bg-gray-50'
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Activity Logs</h1>
          <p className="mt-2 text-gray-600">Track all admin actions and changes</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Filter by action..."
              value={actionFilter}
              onChange={(e) => {
                setActionFilter(e.target.value)
                setPage(1)
              }}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <select
              value={targetTypeFilter}
              onChange={(e) => {
                setTargetTypeFilter(e.target.value)
                setPage(1)
              }}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Target Types</option>
              <option value="USER">User</option>
              <option value="CONTENT">Content</option>
              <option value="EDITORIAL">Editorial</option>
              <option value="SETTINGS">Settings</option>
            </select>
            
            <button
              onClick={() => {
                setActionFilter('')
                setTargetTypeFilter('')
                setPage(1)
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Admin User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Target
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  Array.from({ length: 10 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={5} className="px-6 py-4">
                        <div className="animate-pulse flex space-x-4">
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded" />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      No activity logs found
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(log.createdAt), 'MMM d, yyyy HH:mm:ss')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{log.user.username}</div>
                        <div className="text-xs text-gray-500">{log.user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getActionColor(log.action)}`}>
                          {log.action.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.targetType || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {log.details ? (
                          <details className="cursor-pointer">
                            <summary className="text-blue-600 hover:text-blue-800">
                              View details
                            </summary>
                            <pre className="mt-2 p-2 bg-gray-50 rounded text-xs overflow-auto max-w-md">
                              {JSON.stringify(log.details, null, 2)}
                            </pre>
                          </details>
                        ) : (
                          '-'
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <div>
                <p className="text-sm text-gray-700">
                  Page <span className="font-medium">{page}</span> of{' '}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
