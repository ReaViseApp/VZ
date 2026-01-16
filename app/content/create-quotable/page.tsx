'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import MainLayout from '@/components/MainLayout'

interface Point {
  x: number
  y: number
}

interface QuotableRegion {
  id: string
  mediaId: string
  points: Point[]
  title: string
  approvalType: 'CREATOR_APPROVAL_REQUIRED' | 'REFERENCE_EDIT_REPOST_APPROVED'
}

interface MediaFile {
  id: string
  preview: string
  type: 'image' | 'video'
}

export default function CreateQuotablePage() {
  const router = useRouter()
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentPoints, setCurrentPoints] = useState<Point[]>([])
  const [regions, setRegions] = useState<QuotableRegion[]>([])
  const [showRegionForm, setShowRegionForm] = useState(false)
  const [tempRegion, setTempRegion] = useState<Point[]>([])
  const [regionTitle, setRegionTitle] = useState('')
  const [approvalType, setApprovalType] = useState<'CREATOR_APPROVAL_REQUIRED' | 'REFERENCE_EDIT_REPOST_APPROVED'>('CREATOR_APPROVAL_REQUIRED')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const storedMedia = sessionStorage.getItem('uploadedMedia')
    if (storedMedia) {
      const mediaData = JSON.parse(storedMedia)
      const reconstructedMedia = mediaData.map((m: any) => ({
        ...m,
        preview: sessionStorage.getItem(`media-blob-${m.id}`) || ''
      }))
      setMediaFiles(reconstructedMedia.filter((m: any) => m.preview))
    } else {
      router.push('/content/upload')
    }
  }, [router])

  useEffect(() => {
    if (canvasRef.current && imgRef.current) {
      const canvas = canvasRef.current
      const img = imgRef.current
      canvas.width = img.width
      canvas.height = img.height
      drawCanvas()
    }
  }, [currentMediaIndex, regions, currentPoints, tempRegion])

  const drawCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const currentMedia = mediaFiles[currentMediaIndex]
    const currentRegions = regions.filter((r) => r.mediaId === currentMedia?.id)

    currentRegions.forEach((region) => {
      drawRegion(ctx, region.points, 'rgba(0, 123, 255, 0.4)')
    })

    if (currentPoints.length > 0) {
      drawRegion(ctx, currentPoints, 'rgba(0, 255, 0, 0.4)', true)
    }

    if (tempRegion.length > 0) {
      drawRegion(ctx, tempRegion, 'rgba(255, 165, 0, 0.4)')
    }
  }

  const drawRegion = (ctx: CanvasRenderingContext2D, points: Point[], color: string, isActive = false) => {
    if (points.length < 2) return

    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)
    
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y)
    }
    
    if (!isActive) ctx.closePath()
    
    ctx.strokeStyle = color
    ctx.lineWidth = 3
    ctx.stroke()

    if (!isActive) {
      ctx.fillStyle = color.replace('0.4', '0.2')
      ctx.fill()
    }
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (showRegionForm) return
    
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setIsDrawing(true)
    setCurrentPoints([{ x, y }])
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || showRegionForm) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setCurrentPoints((prev) => [...prev, { x, y }])
  }

  const handleMouseUp = () => {
    if (!isDrawing || currentPoints.length < 3) {
      setIsDrawing(false)
      setCurrentPoints([])
      return
    }

    setIsDrawing(false)
    setTempRegion(currentPoints)
    setCurrentPoints([])
    setShowRegionForm(true)
  }

  const handleSaveRegion = () => {
    const wordCount = regionTitle.trim().split(/\s+/).length
    if (!regionTitle.trim()) {
      alert('Please enter a title')
      return
    }
    if (wordCount > 20) {
      alert('Title must be 20 words or less')
      return
    }
    if (!approvalType) {
      alert('Please select an approval type')
      return
    }

    const newRegion: QuotableRegion = {
      id: Math.random().toString(36).substring(7),
      mediaId: mediaFiles[currentMediaIndex].id,
      points: tempRegion,
      title: regionTitle,
      approvalType,
    }

    setRegions((prev) => [...prev, newRegion])
    setTempRegion([])
    setRegionTitle('')
    setApprovalType('CREATOR_APPROVAL_REQUIRED')
    setShowRegionForm(false)
  }

  const handleCancelRegion = () => {
    setTempRegion([])
    setRegionTitle('')
    setApprovalType('CREATOR_APPROVAL_REQUIRED')
    setShowRegionForm(false)
  }

  const handleFinish = async () => {
    if (regions.length === 0) {
      alert('Please add at least one quotable region')
      return
    }

    setIsSubmitting(true)

    try {
      const uploadPromises = mediaFiles.map(async (media) => {
        const response = await fetch(media.preview)
        const blob = await response.blob()
        
        const formData = new FormData()
        formData.append('file', blob, `media-${media.id}.${media.type === 'video' ? 'mp4' : 'jpg'}`)

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!uploadRes.ok) throw new Error('Upload failed')

        const { url: mediaUrl } = await uploadRes.json()

        const mediaRegions = regions.filter((r) => r.mediaId === media.id).map((r) => ({
          id: r.id,
          title: r.title,
          coordinates: { points: r.points },
          approvalType: r.approvalType,
        }))

        const contentRes = await fetch('/api/content/quotable-region', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: media.type === 'video' ? 'VIDEO' : 'PHOTO',
            mediaUrl,
            quotableRegions: mediaRegions,
          }),
        })

        if (!contentRes.ok) throw new Error('Content creation failed')

        const content = await contentRes.json()

        await Promise.all(mediaRegions.map(region =>
          fetch('/api/viz-list/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contentId: content.id,
              quotableRegionId: region.id,
            }),
          })
        ))

        return content
      })

      await Promise.all(uploadPromises)

      sessionStorage.removeItem('uploadedMedia')
      router.push('/saved')
    } catch (error) {
      console.error('Error creating content:', error)
      alert('Failed to create content. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentMedia = mediaFiles[currentMediaIndex]
  const currentRegions = regions.filter((r) => r.mediaId === currentMedia?.id)
  const wordCount = regionTitle.trim() ? regionTitle.trim().split(/\s+/).length : 0

  if (!currentMedia) return null

  return (
    <MainLayout>
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Add Quotable Regions</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="relative">
                {currentMedia.type === 'image' ? (
                  <img
                    ref={imgRef}
                    src={currentMedia.preview}
                    alt="Media"
                    className="w-full rounded"
                    onLoad={() => drawCanvas()}
                  />
                ) : (
                  <video src={currentMedia.preview} className="w-full rounded" controls />
                )}
                <canvas
                  ref={canvasRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  className="absolute top-0 left-0 cursor-crosshair"
                  style={{ pointerEvents: currentMedia.type === 'image' ? 'auto' : 'none' }}
                />
              </div>

              {mediaFiles.length > 1 && (
                <div className="mt-4 flex justify-between items-center">
                  <button
                    onClick={() => setCurrentMediaIndex((prev) => Math.max(0, prev - 1))}
                    disabled={currentMediaIndex === 0}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    {currentMediaIndex + 1} / {mediaFiles.length}
                  </span>
                  <button
                    onClick={() => setCurrentMediaIndex((prev) => Math.min(mediaFiles.length - 1, prev + 1))}
                    disabled={currentMediaIndex === mediaFiles.length - 1}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Instructions</h2>
              <p className="text-sm text-gray-600 mb-4">
                Draw freeform lasso selections around quotable content areas. Click and drag to create a region.
              </p>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Regions ({currentRegions.length})</h3>
              <div className="space-y-2 max-h-64 overflow-auto">
                {currentRegions.map((region) => (
                  <div key={region.id} className="p-3 bg-gray-50 rounded border border-gray-200">
                    <p className="text-sm font-medium text-gray-900">{region.title}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {region.approvalType === 'CREATOR_APPROVAL_REQUIRED' ? 'Approval Required' : 'Edit & Repost Approved'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleFinish}
              disabled={isSubmitting || regions.length === 0}
              className="w-full mt-4 px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? 'Creating...' : 'Finish & Save'}
            </button>
          </div>
        </div>

        {showRegionForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Configure Region</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title ({wordCount}/20 words)
                </label>
                <input
                  type="text"
                  value={regionTitle}
                  onChange={(e) => setRegionTitle(e.target.value)}
                  placeholder="Enter region title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  maxLength={200}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Approval Type</label>
                <div className="space-y-2">
                  <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      value="CREATOR_APPROVAL_REQUIRED"
                      checked={approvalType === 'CREATOR_APPROVAL_REQUIRED'}
                      onChange={(e) => setApprovalType(e.target.value as any)}
                      className="mr-3"
                    />
                    <span className="text-sm">Creator Approval Required</span>
                  </label>
                  <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      value="REFERENCE_EDIT_REPOST_APPROVED"
                      checked={approvalType === 'REFERENCE_EDIT_REPOST_APPROVED'}
                      onChange={(e) => setApprovalType(e.target.value as any)}
                      className="mr-3"
                    />
                    <span className="text-sm">Reference, Edit & Re-post Approved</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCancelRegion}
                  className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveRegion}
                  className="flex-1 px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  Save Region
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
