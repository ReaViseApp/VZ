'use client'

import { useRouter } from 'next/navigation'
import MainLayout from '@/components/MainLayout'

export default function CreatePage() {
  const router = useRouter()

  return (
    <MainLayout>
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Viz.Edit</h1>
          <p className="text-lg text-gray-600 mb-8">
            Create and edit your quotable digital content
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => router.push('/content/upload')}
              className="bg-white rounded-lg shadow-sm p-8 border border-gray-200 hover:shadow-md transition-shadow text-left"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Create Content</h2>
              <p className="text-gray-600">
                Upload photos and videos, add quotable regions with lasso selector, and share with the community.
              </p>
            </button>

            <button
              onClick={() => router.push('/editorial/create')}
              className="bg-white rounded-lg shadow-sm p-8 border border-gray-200 hover:shadow-md transition-shadow text-left"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Create Editorial</h2>
              <p className="text-gray-600">
                Create multi-page editorials using quotable content from your Viz.List with the canvas editor.
              </p>
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
