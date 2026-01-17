'use client'

import { useState } from 'react'
import Image from 'next/image'
import VizLetOptionModal from './VizLetOptionModal'
import { useRouter } from 'next/navigation'
import type { Content } from '@prisma/client'

import { formatDate } from '@/lib/utils/date'

interface MyVizGridProps {
  contents: Content[]
}

export default function MyVizGrid({ contents }: MyVizGridProps) {
  const [selectedContent, setSelectedContent] = useState<string | null>(null)
  const router = useRouter()

  const handleContentClick = (contentId: string) => {
    setSelectedContent(contentId)
  }

  const handleConfirm = () => {
    if (selectedContent) {
      router.push(`/vizlet/products/create?contentId=${selectedContent}`)
    }
    setSelectedContent(null)
  }

  const handleClose = () => {
    setSelectedContent(null)
  }

  if (contents.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg
            className="w-16 h-16 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No Content Yet
        </h3>
        <p className="text-gray-500 mb-4">
          Create some quotable content first to list products on Viz.Let
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {contents.map((content) => (
          <div
            key={content.id}
            onClick={() => handleContentClick(content.id)}
            className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:ring-4 hover:ring-gray-900 transition-all"
          >
            <Image
              src={content.mediaUrl}
              alt={content.caption || 'Content'}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-opacity flex items-center justify-center">
              <div className="text-white text-center opacity-0 group-hover:opacity-100 transition-opacity p-4">
                <div className="text-sm font-medium mb-2">Create Product</div>
                <svg
                  className="w-8 h-8 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
            </div>

            {/* Date Badge */}
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
              {formatDate(content.createdAt)}
            </div>
          </div>
        ))}
      </div>

      <VizLetOptionModal
        isOpen={selectedContent !== null}
        onClose={handleClose}
        onConfirm={handleConfirm}
        contentId={selectedContent || ''}
      />
    </>
  )
}
