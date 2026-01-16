'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import MainLayout from '@/components/MainLayout'
import ContentDisplay from '@/components/ContentDisplay'

interface VizListItem {
  id: string
  contentId: string
  quotableRegionId: string | null
  content: {
    id: string
    type: 'PHOTO' | 'VIDEO'
    mediaUrl: string
    caption?: string
    quotableRegions: any
    user: {
      id: string
      username: string
    }
  }
  createdAt: string
}

export default function SavedPage() {
  const router = useRouter()
  const [vizList, setVizList] = useState<VizListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'images' | 'videos'>('all')

  useEffect(() => {
    fetchVizList()
  }, [])

  const fetchVizList = async () => {
    try {
      const res = await fetch('/api/viz-list')
      if (res.ok) {
        const data = await res.json()
        setVizList(data)
      }
    } catch (error) {
      console.error('Error fetching Viz.List:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (id: string) => {
    try {
      const res = await fetch(`/api/viz-list/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setVizList((prev) => prev.filter((item) => item.id !== id))
      }
    } catch (error) {
      console.error('Error removing from Viz.List:', error)
    }
  }

  const filteredList = vizList.filter((item) => {
    if (filter === 'images') return item.content.type === 'PHOTO'
    if (filter === 'videos') return item.content.type === 'VIDEO'
    return true
  })

  return (
    <MainLayout>
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Viz.List</h1>
              <p className="text-lg text-gray-600">
                Your saved quotable content
              </p>
            </div>
            <button
              onClick={() => router.push('/content/upload')}
              className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Create New Content
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading...</p>
            </div>
          ) : vizList.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 border border-gray-200 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">No Saved Content Yet</h2>
                <p className="text-gray-600 mb-6">
                  Create content with quotable regions to start building your Viz.List.
                </p>
                <button
                  onClick={() => router.push('/content/upload')}
                  className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800"
                >
                  Create Content
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  All ({vizList.length})
                </button>
                <button
                  onClick={() => setFilter('images')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === 'images' ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Images ({vizList.filter((i) => i.content.type === 'PHOTO').length})
                </button>
                <button
                  onClick={() => setFilter('videos')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === 'videos' ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Videos ({vizList.filter((i) => i.content.type === 'VIDEO').length})
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredList.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <ContentDisplay content={item.content} />
                    <div className="p-4 border-t border-gray-200">
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        Remove from Viz.List
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
