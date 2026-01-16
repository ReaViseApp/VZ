'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import MainLayout from '@/components/MainLayout'
import ContentDisplay from '@/components/ContentDisplay'

interface Content {
  id: string
  type: 'PHOTO' | 'VIDEO'
  mediaUrl: string
  caption?: string
  quotableRegions: any
  createdAt: string
  user: {
    id: string
    username: string
  }
}

interface Editorial {
  id: string
  title: string
  pages: any[]
  publishedAt: string
  user: {
    id: string
    username: string
  }
}

export default function Home() {
  const router = useRouter()
  const [contents, setContents] = useState<Content[]>([])
  const [editorials, setEditorials] = useState<Editorial[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'content' | 'editorials'>('content')

  useEffect(() => {
    fetchFeed()
  }, [])

  const fetchFeed = async () => {
    try {
      const [contentRes, editorialRes] = await Promise.all([
        fetch('/api/content/feed'),
        fetch('/api/editorial/feed'),
      ])

      if (contentRes.ok) {
        const contentData = await contentRes.json()
        setContents(contentData)
      }

      if (editorialRes.ok) {
        const editorialData = await editorialRes.json()
        setEditorials(editorialData)
      }
    } catch (error) {
      console.error('Error fetching feed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-6 py-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Viz.</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A creative community platform where you can create quotable digital content and publish editorials recommending other users&apos; content.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setTab('content')}
              className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                tab === 'content' ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Content Feed
            </button>
            <button
              onClick={() => setTab('editorials')}
              className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                tab === 'editorials' ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Editorials
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading...</p>
            </div>
          ) : tab === 'content' ? (
            contents.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 border border-gray-200 text-center">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">No Content Yet</h2>
                <p className="text-gray-600 mb-6">Be the first to create content!</p>
                <button
                  onClick={() => router.push('/content/upload')}
                  className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800"
                >
                  Create Content
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contents.map((content) => (
                  <div key={content.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <ContentDisplay content={content} />
                    <div className="p-4 border-t border-gray-200">
                      <p className="text-sm text-gray-500">
                        {new Date(content.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            editorials.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 border border-gray-200 text-center">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">No Editorials Yet</h2>
                <p className="text-gray-600 mb-6">Create an editorial to showcase your favorite content!</p>
                <button
                  onClick={() => router.push('/editorial/create')}
                  className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800"
                >
                  Create Editorial
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {editorials.map((editorial) => (
                  <div key={editorial.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{editorial.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      By @{editorial.user.username} • {new Date(editorial.publishedAt).toLocaleDateString()}
                    </p>
                    <button
                      onClick={() => router.push(`/editorial/${editorial.id}`)}
                      className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800"
                    >
                      View Editorial
                    </button>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </MainLayout>
  )
}
