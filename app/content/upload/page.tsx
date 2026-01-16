'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import MainLayout from '@/components/MainLayout'
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface MediaFile {
  id: string
  file: File
  preview: string
  type: 'image' | 'video'
  edited?: boolean
  crop?: PixelCrop
}

interface SortableMediaProps {
  media: MediaFile
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

function SortableMedia({ media, onEdit, onDelete }: SortableMediaProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: media.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group bg-gray-100 rounded-lg overflow-hidden aspect-square"
    >
      <div {...attributes} {...listeners} className="cursor-move">
        {media.type === 'image' ? (
          <Image
            src={media.preview}
            alt="Preview"
            fill
            className="object-cover"
          />
        ) : (
          <video src={media.preview} className="w-full h-full object-cover" />
        )}
      </div>
      
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center gap-2">
        <button
          onClick={() => onEdit(media.id)}
          className="opacity-0 group-hover:opacity-100 px-3 py-1 bg-white text-gray-900 rounded text-sm font-medium hover:bg-gray-100 transition-all"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(media.id)}
          className="opacity-0 group-hover:opacity-100 px-3 py-1 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 transition-all"
        >
          Delete
        </button>
      </div>
    </div>
  )
}

export default function ContentUploadPage() {
  const router = useRouter()
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [editingMedia, setEditingMedia] = useState<MediaFile | null>(null)
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const imgRef = useRef<HTMLImageElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    const newFiles = Array.from(files).map((file) => {
      const isVideo = file.type.startsWith('video/')
      return {
        id: Math.random().toString(36).substring(7),
        file,
        preview: URL.createObjectURL(file),
        type: (isVideo ? 'video' : 'image') as 'image' | 'video',
      }
    })

    setMediaFiles((prev) => [...prev, ...newFiles])
  }

  const handleEdit = (id: string) => {
    const media = mediaFiles.find((m) => m.id === id)
    if (media && media.type === 'image') {
      setEditingMedia(media)
      setCrop(media.crop)
    }
  }

  const handleDelete = (id: string) => {
    setMediaFiles((prev) => {
      const updated = prev.filter((m) => m.id !== id)
      const deleted = prev.find((m) => m.id === id)
      if (deleted) URL.revokeObjectURL(deleted.preview)
      return updated
    })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setMediaFiles((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const applyCrop = () => {
    if (editingMedia && completedCrop) {
      setMediaFiles((prev) =>
        prev.map((m) =>
          m.id === editingMedia.id
            ? { ...m, crop: completedCrop, edited: true }
            : m
        )
      )
      setEditingMedia(null)
      setCrop(undefined)
      setCompletedCrop(undefined)
    }
  }

  const cancelEdit = () => {
    setEditingMedia(null)
    setCrop(undefined)
    setCompletedCrop(undefined)
  }

  const handleNext = () => {
    if (mediaFiles.length === 0) {
      alert('Please upload at least one media file')
      return
    }
    
    const mediaData = mediaFiles.map((m) => ({
      id: m.id,
      type: m.type,
      crop: m.crop,
    }))
    sessionStorage.setItem('uploadedMedia', JSON.stringify(mediaData))
    
    mediaFiles.forEach(m => {
      sessionStorage.setItem(`media-blob-${m.id}`, m.preview)
    })
    
    router.push('/content/create-quotable')
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Upload Content</h1>

        {!editingMedia && (
          <>
            <div className="mb-8 flex gap-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
              >
                <div className="text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p className="mt-2 text-sm text-gray-600">Select Files</p>
                  <p className="mt-1 text-xs text-gray-500">JPEG, PNG, MP4, MOV</p>
                </div>
              </button>

              <button
                onClick={() => cameraInputRef.current?.click()}
                className="flex-1 py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
              >
                <div className="text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="mt-2 text-sm text-gray-600">Open Camera</p>
                  <p className="mt-1 text-xs text-gray-500">Take photo or video</p>
                </div>
              </button>
            </div>

            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,video/mp4,video/quicktime" multiple onChange={(e) => handleFileSelect(e.target.files)} className="hidden" />
            <input ref={cameraInputRef} type="file" accept="image/*,video/*" capture="environment" onChange={(e) => handleFileSelect(e.target.files)} className="hidden" />

            {mediaFiles.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Uploaded Media ({mediaFiles.length})</h2>
                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={mediaFiles.map((m) => m.id)} strategy={verticalListSortingStrategy}>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {mediaFiles.map((media) => (
                        <SortableMedia key={media.id} media={media} onEdit={handleEdit} onDelete={handleDelete} />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            )}

            {mediaFiles.length > 0 && (
              <div className="flex justify-end">
                <button onClick={handleNext} className="px-8 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
                  Next: Add Quotable Regions
                </button>
              </div>
            )}
          </>
        )}

        {editingMedia && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Edit Image</h2>
              <div className="mb-4">
                <ReactCrop crop={crop} onChange={(c) => setCrop(c)} onComplete={(c) => setCompletedCrop(c)}>
                  <img ref={imgRef} src={editingMedia.preview} alt="Edit" className="max-w-full" />
                </ReactCrop>
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={cancelEdit} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={applyCrop} className="px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">Apply</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
