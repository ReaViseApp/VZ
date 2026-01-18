'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import ProductCreationForm from '@/components/vizlet/ProductCreationForm'
import toast from 'react-hot-toast'

export default function CreateProductContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const contentId = searchParams.get('contentId')
  const [shop, setShop] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!contentId) {
      toast.error('No content selected')
      router.push('/vizlet/myviz')
      return
    }

    // Check if user has a shop, create one if not
    const initShop = async () => {
      try {
        // Try to create a shop (it will fail if user already has one)
        const res = await fetch('/api/vizlet/shop/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            shopName: 'My Shop', // Default name, user can change later
          }),
        })

        if (res.ok) {
          const data = await res.json()
          setShop(data.shop)
        } else if (res.status === 400) {
          // Shop already exists, which is fine
          setShop({ exists: true })
        } else {
          throw new Error('Failed to initialize shop')
        }
      } catch (error) {
        console.error('Shop init error:', error)
        toast.error('Failed to initialize shop')
      } finally {
        setIsLoading(false)
      }
    }

    initShop()
  }, [contentId, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!contentId) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Product</h1>
          <p className="text-gray-600">
            List your quotable content as a product on Viz.Let marketplace
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <ProductCreationForm contentId={contentId} />
        </div>
      </div>
    </div>
  )
}
