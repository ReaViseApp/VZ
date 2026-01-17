'use client'

import AdminLayout from '@/components/admin/AdminLayout'
import Link from 'next/link'

export default function AnalyticsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-2 text-gray-600">Detailed insights and statistics</p>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">📊</span>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Analytics Dashboard</h3>
              <p className="text-sm text-blue-800 mb-4">
                Detailed analytics with charts and graphs are available on the main Dashboard page.
                This dedicated analytics page will be enhanced with more advanced features in future updates.
              </p>
              <Link
                href="/admin"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                View Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-3xl mb-3">📈</div>
            <h3 className="font-semibold text-gray-900 mb-2">User Growth</h3>
            <p className="text-sm text-gray-600">
              Track user registration trends and active user metrics over time.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-3xl mb-3">📷</div>
            <h3 className="font-semibold text-gray-900 mb-2">Content Analytics</h3>
            <p className="text-sm text-gray-600">
              Monitor content uploads, engagement, and popular posts.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-3xl mb-3">⭐</div>
            <h3 className="font-semibold text-gray-900 mb-2">Engagement Metrics</h3>
            <p className="text-sm text-gray-600">
              Analyze Viz.List saves, editorial views, and user interactions.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
