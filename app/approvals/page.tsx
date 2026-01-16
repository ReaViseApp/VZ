'use client'

import { useEffect, useState } from 'react'
import MainLayout from '@/components/MainLayout'
import ContentDisplay from '@/components/ContentDisplay'

interface ApprovalRequest {
  id: string
  requesterId: string
  creatorId: string
  contentId: string
  quotableRegionId: string | null
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: string
  requester: {
    id: string
    username: string
  }
  content: {
    id: string
    type: 'PHOTO' | 'VIDEO'
    mediaUrl: string
    caption?: string
    quotableRegions: any
    user: {
      username: string
    }
  }
}

export default function ApprovalsPage() {
  const [requests, setRequests] = useState<ApprovalRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const res = await fetch('/api/approval/pending')
      if (res.ok) {
        const data = await res.json()
        setRequests(data)
      }
    } catch (error) {
      console.error('Error fetching approval requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/approval/${id}/approve`, { method: 'PUT' })
      if (res.ok) {
        setRequests((prev) => prev.filter((req) => req.id !== id))
      }
    } catch (error) {
      console.error('Error approving request:', error)
    }
  }

  const handleReject = async (id: string) => {
    try {
      const res = await fetch(`/api/approval/${id}/reject`, { method: 'PUT' })
      if (res.ok) {
        setRequests((prev) => prev.filter((req) => req.id !== id))
      }
    } catch (error) {
      console.error('Error rejecting request:', error)
    }
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Stamp</h1>
          <p className="text-lg text-gray-600 mb-8">
            Manage approval requests for your quotable content
          </p>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 border border-gray-200 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">No Approval Requests Yet</h2>
                <p className="text-gray-600">
                  When other users request to use quotable regions from your content, you&apos;ll see them here.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {requests.map((request) => (
                <div key={request.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-lg font-semibold text-gray-900">
                          @{request.requester.username} wants to use your content
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <ContentDisplay content={request.content} />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleApprove(request.id)}
                        className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
