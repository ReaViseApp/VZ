'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import StatCard from '@/components/admin/StatCard'
import toast from 'react-hot-toast'

interface AnalyticsData {
  overview: {
    totalUsers: number
    newUsersLast30Days: number
    activeUsersLast7Days: number
    bannedUsers: number
    suspendedUsers: number
    totalContent: number
    totalEditorials: number
    totalVizListSaves: number
    pendingApprovals: number
    featuredContent: number
  }
  recentActivity: {
    recentUsers: any[]
    recentContent: any[]
  }
  topCreators: any[]
}

export default function AdminDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/analytics/overview')
      if (!response.ok) throw new Error('Failed to fetch analytics')
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('Error fetching analytics:', error)
      toast.error('Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Overview of your Viz. platform</p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            value={data?.overview.totalUsers || 0}
            icon="👥"
            change={data?.overview.newUsersLast30Days ? {
              value: `+${data.overview.newUsersLast30Days} this month`,
              type: 'increase'
            } : undefined}
            loading={loading}
          />
          
          <StatCard
            title="Active Users (7d)"
            value={data?.overview.activeUsersLast7Days || 0}
            icon="✨"
            loading={loading}
          />
          
          <StatCard
            title="Total Content"
            value={data?.overview.totalContent || 0}
            icon="📷"
            loading={loading}
          />
          
          <StatCard
            title="Editorials"
            value={data?.overview.totalEditorials || 0}
            icon="📝"
            loading={loading}
          />
          
          <StatCard
            title="Viz.List Saves"
            value={data?.overview.totalVizListSaves || 0}
            icon="⭐"
            loading={loading}
          />
          
          <StatCard
            title="Featured Content"
            value={data?.overview.featuredContent || 0}
            icon="🌟"
            loading={loading}
          />
          
          <StatCard
            title="Pending Approvals"
            value={data?.overview.pendingApprovals || 0}
            icon="⏳"
            loading={loading}
          />
          
          <StatCard
            title="Banned/Suspended"
            value={`${data?.overview.bannedUsers || 0} / ${data?.overview.suspendedUsers || 0}`}
            icon="🚫"
            loading={loading}
          />
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Users */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Users</h2>
            <div className="space-y-3">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-1/4" />
                    </div>
                  </div>
                ))
              ) : data?.recentActivity.recentUsers.length === 0 ? (
                <p className="text-gray-500 text-sm">No recent users</p>
              ) : (
                data?.recentActivity.recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold">
                        {user.username[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.username}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <span className={`
                      px-2 py-1 text-xs font-medium rounded-full
                      ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : ''}
                      ${user.role === 'MODERATOR' ? 'bg-blue-100 text-blue-700' : ''}
                      ${user.role === 'USER' ? 'bg-gray-100 text-gray-700' : ''}
                    `}>
                      {user.role}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Content */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Content</h2>
            <div className="space-y-3">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                ))
              ) : data?.recentActivity.recentContent.length === 0 ? (
                <p className="text-gray-500 text-sm">No recent content</p>
              ) : (
                data?.recentActivity.recentContent.map((content) => (
                  <div key={content.id} className="py-2 border-b border-gray-100 last:border-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {content.caption || 'Untitled'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          by {content.user.username} • {content.type}
                        </p>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(content.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Top Creators */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Creators</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse p-4 border border-gray-200 rounded-lg">
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              ))
            ) : data?.topCreators.length === 0 ? (
              <p className="text-gray-500 text-sm">No creators yet</p>
            ) : (
              data?.topCreators.map((creator) => (
                <div key={creator.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                  <p className="font-medium text-gray-900">{creator.username}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {creator._count.contents} content • {creator._count.editorials} editorials
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
