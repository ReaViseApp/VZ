'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import MainLayout from '@/components/MainLayout'
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react'

interface VizListItem {
  id: string
  contentId: string
  quotableRegionId: string | null
  content: {
    id: string
    mediaUrl: string
    type: string
    quotableRegions: any
    user: {
      username: string
    }
  }
}

interface CanvasPage {
  id: string
  canvasData: any
}

export default function EditorialCreatePage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [vizList, setVizList] = useState<VizListItem[]>([])
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [canvas, setCanvas] = useState<any>(null)
  const [pages, setPages] = useState<CanvasPage[]>([{ id: '1', canvasData: null }])
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [editorialTitle, setEditorialTitle] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricRef = useRef<any>(null)

  useEffect(() => {
    fetchVizList()
  }, [])

  useEffect(() => {
    const loadFabric = async () => {
      if (step === 2 && canvasRef.current && !canvas) {
        const fabric = await import('fabric')
        fabricRef.current = {
          Canvas: fabric.Canvas,
          IText: fabric.IText,
          Rect: fabric.Rect,
          Circle: fabric.Circle,
          Triangle: fabric.Triangle,
          Line: fabric.Line,
          Text: fabric.Text,
          Image: fabric.Image
        }
        
        const fabricCanvas = new fabric.Canvas(canvasRef.current, {
          width: 800,
          height: 800,
          backgroundColor: '#ffffff',
        })
        setCanvas(fabricCanvas)

        return () => {
          fabricCanvas.dispose()
        }
      }
    }
    loadFabric()
  }, [step, canvas])

  useEffect(() => {
    if (canvas && pages[currentPageIndex]?.canvasData) {
      canvas.loadFromJSON(pages[currentPageIndex].canvasData, () => {
        canvas.renderAll()
      })
    }
  }, [currentPageIndex, canvas, pages])

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

  const toggleSelection = (id: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const handleNextToCanvas = () => {
    if (selectedItems.size === 0) {
      alert('Please select at least one item from your Viz.List')
      return
    }
    setStep(2)
  }

  const addText = () => {
    if (!canvas || !fabricRef.current) return
    const text = new fabricRef.current.IText('Add Caption', {
      left: 100,
      top: 100,
      fontFamily: 'Arial',
      fontSize: 24,
      fill: '#000000',
    })
    canvas.add(text)
    canvas.setActiveObject(text)
  }

  const addShape = (type: 'rect' | 'circle' | 'triangle' | 'line') => {
    if (!canvas || !fabricRef.current) return

    let shape: any

    switch (type) {
      case 'rect':
        shape = new fabricRef.current.Rect({
          left: 100,
          top: 100,
          width: 100,
          height: 100,
          fill: 'rgba(0, 123, 255, 0.5)',
          stroke: '#007bff',
          strokeWidth: 2,
        })
        break
      case 'circle':
        shape = new fabricRef.current.Circle({
          left: 100,
          top: 100,
          radius: 50,
          fill: 'rgba(255, 0, 0, 0.5)',
          stroke: '#ff0000',
          strokeWidth: 2,
        })
        break
      case 'triangle':
        shape = new fabricRef.current.Triangle({
          left: 100,
          top: 100,
          width: 100,
          height: 100,
          fill: 'rgba(0, 255, 0, 0.5)',
          stroke: '#00ff00',
          strokeWidth: 2,
        })
        break
      case 'line':
        shape = new fabricRef.current.Line([50, 100, 200, 100], {
          stroke: '#000000',
          strokeWidth: 3,
        })
        break
    }

    canvas.add(shape)
    canvas.setActiveObject(shape)
  }

  const enableDrawing = () => {
    if (!canvas) return
    canvas.isDrawingMode = !canvas.isDrawingMode
    if (canvas.isDrawingMode) {
      canvas.freeDrawingBrush.color = '#000000'
      canvas.freeDrawingBrush.width = 5
    }
  }

  const addEmoji = (emojiData: EmojiClickData) => {
    if (!canvas || !fabricRef.current) return
    const text = new fabricRef.current.Text(emojiData.emoji, {
      left: 100,
      top: 100,
      fontSize: 48,
    })
    canvas.add(text)
    setShowEmojiPicker(false)
  }

  const addQuotableToCanvas = async (item: VizListItem) => {
    if (!canvas || !fabricRef.current) return

    fabricRef.current.Image.fromURL(item.content.mediaUrl, (img: any) => {
      img.scaleToWidth(200)
      img.set({
        left: 100,
        top: 100,
      })
      canvas.add(img)
    }, { crossOrigin: 'anonymous' })
  }

  const saveCurrentPage = () => {
    if (!canvas) return
    const canvasData = canvas.toJSON()
    setPages((prev) =>
      prev.map((page, idx) =>
        idx === currentPageIndex ? { ...page, canvasData } : page
      )
    )
  }

  const addPage = () => {
    saveCurrentPage()
    const newPage = { id: Date.now().toString(), canvasData: null }
    setPages((prev) => [...prev, newPage])
    setCurrentPageIndex(pages.length)
    canvas?.clear()
    canvas?.setBackgroundColor('#ffffff', () => canvas.renderAll())
  }

  const deletePage = (index: number) => {
    if (pages.length === 1) {
      alert('Cannot delete the only page')
      return
    }
    setPages((prev) => prev.filter((_, idx) => idx !== index))
    if (currentPageIndex >= pages.length - 1) {
      setCurrentPageIndex(Math.max(0, pages.length - 2))
    }
  }

  const changePage = (index: number) => {
    saveCurrentPage()
    setCurrentPageIndex(index)
  }

  const handleSave = async (isDraft: boolean) => {
    if (!editorialTitle.trim()) {
      alert('Please enter a title for your editorial')
      return
    }

    saveCurrentPage()
    setIsSaving(true)

    try {
      const res = await fetch('/api/editorial/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editorialTitle,
          pages: pages.map((p) => p.canvasData),
          isDraft,
        }),
      })

      if (!res.ok) throw new Error('Failed to save editorial')

      const editorial = await res.json()

      if (!isDraft) {
        await fetch(`/api/editorial/${editorial.id}/publish`, {
          method: 'POST',
        })
      }

      router.push('/')
    } catch (error) {
      console.error('Error saving editorial:', error)
      alert('Failed to save editorial. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const selectedVizItems = Array.from(selectedItems)
    .map((id) => vizList.find((item) => item.id === id))
    .filter(Boolean) as VizListItem[]

  return (
    <MainLayout>
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Create Editorial</h1>

        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Step 1: Select from Your Viz.List
            </h2>

            {loading ? (
              <p>Loading...</p>
            ) : vizList.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">Your Viz.List is empty</p>
                <button
                  onClick={() => router.push('/content/upload')}
                  className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800"
                >
                  Create Content
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                  {vizList.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => toggleSelection(item.id)}
                      className={`relative cursor-pointer rounded-lg overflow-hidden border-4 transition-all ${
                        selectedItems.has(item.id)
                          ? 'border-blue-500 shadow-lg'
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <div className="aspect-square relative bg-gray-100">
                        <img
                          src={item.content.mediaUrl}
                          alt="Content"
                          className="w-full h-full object-cover"
                        />
                        {selectedItems.has(item.id) && (
                          <div className="absolute top-2 right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">{selectedItems.size} items selected</p>
                  <button
                    onClick={handleNextToCanvas}
                    disabled={selectedItems.size === 0}
                    className="px-8 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
                  >
                    Next: Canvas Editor
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="flex gap-6">
            <div className="w-20 bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="space-y-4">
                <button onClick={addText} className="w-full p-2 hover:bg-gray-100 rounded" title="Add Text">
                  <svg className="w-8 h-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                </button>
                <button onClick={() => addShape('rect')} className="w-full p-2 hover:bg-gray-100 rounded" title="Rectangle">
                  <svg className="w-8 h-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
                  </svg>
                </button>
                <button onClick={() => addShape('circle')} className="w-full p-2 hover:bg-gray-100 rounded" title="Circle">
                  <svg className="w-8 h-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" strokeWidth={2} />
                  </svg>
                </button>
                <button onClick={() => addShape('triangle')} className="w-full p-2 hover:bg-gray-100 rounded" title="Triangle">
                  <svg className="w-8 h-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4l8 14H4l8-14z" />
                  </svg>
                </button>
                <button onClick={() => addShape('line')} className="w-full p-2 hover:bg-gray-100 rounded" title="Line">
                  <svg className="w-8 h-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19l14-14" />
                  </svg>
                </button>
                <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="w-full p-2 hover:bg-gray-100 rounded" title="Emoji">
                  <span className="text-2xl">😀</span>
                </button>
                <button onClick={enableDrawing} className="w-full p-2 hover:bg-gray-100 rounded" title="Draw">
                  <svg className="w-8 h-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex-1 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="mb-4">
                <input
                  type="text"
                  value={editorialTitle}
                  onChange={(e) => setEditorialTitle(e.target.value)}
                  placeholder="Editorial Title (required)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
                />
              </div>

              <div className="flex justify-center mb-4">
                <canvas ref={canvasRef} className="border-2 border-gray-300" />
              </div>

              <div className="flex items-center gap-4 mb-4">
                <button onClick={addPage} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  Add Page
                </button>
                <div className="flex gap-2 flex-1 overflow-x-auto">
                  {pages.map((page, idx) => (
                    <div key={page.id} className="relative">
                      <button
                        onClick={() => changePage(idx)}
                        className={`px-4 py-2 rounded ${
                          idx === currentPageIndex ? 'bg-gray-900 text-white' : 'bg-gray-200'
                        }`}
                      >
                        Page {idx + 1}
                      </button>
                      {pages.length > 1 && (
                        <button
                          onClick={() => deletePage(idx)}
                          className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <span className="text-sm text-gray-600">Page {currentPageIndex + 1} / {pages.length}</span>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => handleSave(true)}
                  disabled={isSaving}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                >
                  Save Draft
                </button>
                <button
                  onClick={() => handleSave(false)}
                  disabled={isSaving}
                  className="px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800"
                >
                  Publish
                </button>
              </div>
            </div>

            <div className="w-64 bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quotable Content</h3>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {selectedVizItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => addQuotableToCanvas(item)}
                    className="cursor-pointer hover:bg-gray-50 rounded p-2 border border-gray-200"
                  >
                    <img src={item.content.mediaUrl} alt="Content" className="w-full rounded mb-1" />
                    <p className="text-xs text-gray-600">@{item.content.user.username}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {showEmojiPicker && (
          <div className="fixed bottom-24 left-24 z-50">
            <EmojiPicker onEmojiClick={addEmoji} />
          </div>
        )}
      </div>
    </MainLayout>
  )
}
