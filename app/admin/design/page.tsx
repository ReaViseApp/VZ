'use client'

import AdminLayout from '@/components/admin/AdminLayout'
import Link from 'next/link'

export default function DesignPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Design Customization</h1>
          <p className="mt-2 text-gray-600">Customize the look and feel of your platform</p>
        </div>

        {/* Design Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Colors */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Theme Colors</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Customize primary, secondary, and accent colors
                </p>
              </div>
              <span className="text-3xl">🎨</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Available in Settings page. You can configure primary, secondary, accent, and font colors.
            </p>
            <Link
              href="/admin/settings"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Go to Settings
            </Link>
          </div>

          {/* Typography */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Typography</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Choose fonts and text styles
                </p>
              </div>
              <span className="text-3xl">🔤</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Font customization coming soon. Current font: System default
            </p>
            <button
              disabled
              className="inline-block px-4 py-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed text-sm font-medium"
            >
              Coming Soon
            </button>
          </div>

          {/* Logo */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Logo & Branding</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Upload custom logo and favicon
                </p>
              </div>
              <span className="text-3xl">📷</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Logo upload feature coming soon. Current logo: Default Viz. logo
            </p>
            <button
              disabled
              className="inline-block px-4 py-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed text-sm font-medium"
            >
              Coming Soon
            </button>
          </div>

          {/* Layout */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Layout Options</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Configure sidebar, header, and page layouts
                </p>
              </div>
              <span className="text-3xl">📐</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Layout customization coming soon. Current: Left sidebar, default header
            </p>
            <button
              disabled
              className="inline-block px-4 py-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed text-sm font-medium"
            >
              Coming Soon
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">ℹ️</span>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Design System Overview</h3>
              <p className="text-sm text-blue-800">
                The design customization system is currently in development. Basic color theming is available
                in the Settings page. Advanced features like typography selection, logo upload, and layout
                customization will be added in future updates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
