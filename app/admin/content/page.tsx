'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import ConfirmationModal from '@/components/admin/ConfirmationModal'
import toast from 'react-hot-toast'

interface Content {
  id: string
  type: 'PHOTO' | 'VIDEO'
  mediaUrl: string
  caption: string | null
  isFeatured: boolean
  isApproved: boolean
  createdAt: string
  user: {
    username: string
  }
  _count: {
    vizLists: number
    flags: number
  }
}

export default function ContentPage() {
  const [content, setContent] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [featuredFilter, setFeaturedFilter] = useState('ALL')
  
  const [modalOpen, setModalOpen] = useState(false)
  const [modalConfig, setModalConfig] = useState<any>(null)

  useEffect(() => {
    fetchContent()
  }, [page, typeFilter, statusFilter, featuredFilter])

  const fetchContent = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        perPage: '20',
        ...(typeFilter !== 'ALL' && { type: typeFilter }),
        ...(statusFilter !== 'ALL' && { status: statusFilter }),
        ...(featuredFilter !== 'ALL' && { featured: featuredFilter }),
      })

      const response = await fetch(`/api/admin/content?${params}`)
      if (!response.ok) throw new Error('Failed to fetch content')
      
      const data = await response.json()
      setContent(data.content)
      setTotalPages(data.pagination.totalPages)
    } catch (error) {
      console.error('Error fetching content:', error)
      toast.error('Failed to load content')
    } finally {
      setLoading(false)
    }
  }

  const handleFeature = async (contentId: string, featured: boolean) => {
    try {
      const response = await fetch(`/api/admin/content/${contentId}/feature`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured }),
      })

      if (!response.ok) throw new Error('Failed to feature content')
      
      toast.success(featured ? 'Content featured successfully' : 'Content unfeatured successfully')
      fetchContent()
    } catch (error) {
      console.error('Error featuring content:', error)
      toast.error('Failed to feature content')
    }
  }

  const handleApprove = async (contentId: string, approved: boolean) => {
    try {
      const response = await fetch(`/api/admin/content/${contentId}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved }),
      })

      if (!response.ok) throw new Error('Failed to approve content')
      
      toast.success(approved ? 'Content approved successfully' : 'Content rejected successfully')
      fetchContent()
    } catch (error) {
      console.error('Error approving content:', error)
      toast.error('Failed to approve content')
    }
  }

  const openConfirmationModal = (config: any) => {
    setModalConfig(config)
    setModalOpen(true)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
          <p className="mt-2 text-gray-600">Moderate and manage user content</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value)
                setPage(1)
              }}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Types</option>
              <option value="PHOTO">Photos</option>
              <option value="VIDEO">Videos</option>
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setPage(1)
              }}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Status</option>
              <option value="APPROVED">Approved</option>
              <option value="PENDING">Pending</option>
            </select>
            
            <select
              value={featuredFilter}
              onChange={(e) => {
                setFeaturedFilter(e.target.value)
                setPage(1)
              }}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Featured Status</option>
              <option value="FEATURED">Featured</option>
              <option value="NOT_FEATURED">Not Featured</option>
            </select>
            
            <button
              onClick={() => {
                setTypeFilter('ALL')
                setStatusFilter('ALL')
                setFeaturedFilter('ALL')
                setPage(1)
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-lg border border-gray-200 p-4">
                <div className="aspect-square bg-gray-200 rounded mb-4" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))
          ) : content.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              No content found
            </div>
          ) : (
            content.map((item) => (
              <div key={item.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                {/* Content Preview */}
                <div className="aspect-square bg-gray-100 relative">
                  {item.type === 'PHOTO' ? (
                    <img 
                      src={item.mediaUrl} 
                      alt={item.caption || 'Content'} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video 
                      src={item.mediaUrl} 
                      className="w-full h-full object-cover"
                    />
                  )}
                  
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex gap-2">
                    {item.isFeatured && (
                      <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                        ⭐ Featured
                      </span>
                    )}
                    {!item.isApproved && (
                      <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
                        Pending
                      </span>
                    )}
                  </div>
                  
                  {/* Type Badge */}
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-1 text-xs font-medium bg-black bg-opacity-70 text-white rounded">
                      {item.type}
                    </span>
                  </div>
                </div>

                {/* Content Info */}
                <div className="p-4">
                  <p className="text-sm text-gray-900 line-clamp-2 mb-2">
                    {item.caption || 'No caption'}
                  </p>
                  <p className="text-xs text-gray-500 mb-3">
                    by {item.user.username}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>💾 {item._count.vizLists} saves</span>
                    {item._count.flags > 0 && (
                      <span className="text-red-600">🚩 {item._count.flags} flags</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {!item.isApproved && (
                      <button
                        onClick={() => handleApprove(item.id, true)}
                        className="flex-1 px-3 py-2 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700 transition-colors"
                      >
                        Approve
                      </button>
                    )}
                    
                    <button
                      onClick={() => {
                        openConfirmationModal({
                          title: item.isFeatured ? 'Unfeature Content' : 'Feature Content',
                          message: `Are you sure you want to ${item.isFeatured ? 'unfeature' : 'feature'} this content?`,
                          onConfirm: () => handleFeature(item.id, !item.isFeatured),
                          type: 'info'
                        })
                      }}
                      className={`flex-1 px-3 py-2 text-xs font-medium rounded transition-colors ${
                        item.isFeatured
                          ? 'text-gray-700 bg-gray-200 hover:bg-gray-300'
                          : 'text-white bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {item.isFeatured ? 'Unfeature' : 'Feature'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-700">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {modalConfig && (
        <ConfirmationModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          {...modalConfig}
        />
      )}
    </AdminLayout>
  )
}
