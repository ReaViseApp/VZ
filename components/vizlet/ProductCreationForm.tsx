'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface ProductCreationFormProps {
  contentId: string
  onSuccess?: () => void
}

export default function ProductCreationForm({ contentId, onSuccess }: ProductCreationFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [photoFiles, setPhotoFiles] = useState<File[]>([])
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([])

  const [formData, setFormData] = useState({
    productName: '',
    productDescription: '',
    price: '',
    deliveryTime: '',
    customizationGuidelines: '',
    giftWrappingGuidelines: '',
    acceptedPaymentMethods: [] as string[],
    deliveryMethods: [] as string[],
  })

  const paymentMethodOptions = [
    'Credit Card',
    'Debit Card',
    'PayPal',
    'Bank Transfer',
    'Cash on Delivery',
  ]

  const deliveryMethodOptions = [
    'Standard Shipping',
    'Express Shipping',
    'Next Day Delivery',
    'International Shipping',
    'Local Pickup',
  ]

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + photoFiles.length > 10) {
      toast.error('Maximum 10 photos allowed')
      return
    }

    setPhotoFiles((prev) => [...prev, ...files])

    // Create previews
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreviews((prev) => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removePhoto = (index: number) => {
    setPhotoFiles((prev) => prev.filter((_, i) => i !== index))
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleCheckboxChange = (
    field: 'acceptedPaymentMethods' | 'deliveryMethods',
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.productName.trim()) {
      toast.error('Product name is required')
      return
    }

    if (!formData.productDescription.trim()) {
      toast.error('Product description is required')
      return
    }

    if (photoFiles.length < 5) {
      toast.error('Minimum 5 product photos required')
      return
    }

    const price = parseFloat(formData.price)
    if (isNaN(price) || price <= 0) {
      toast.error('Valid price is required')
      return
    }

    if (!formData.deliveryTime.trim()) {
      toast.error('Delivery time is required')
      return
    }

    if (formData.acceptedPaymentMethods.length === 0) {
      toast.error('Select at least one payment method')
      return
    }

    if (formData.deliveryMethods.length === 0) {
      toast.error('Select at least one delivery method')
      return
    }

    setIsLoading(true)

    try {
      // Upload photos first
      const photoUrls: string[] = []
      for (const file of photoFiles) {
        const uploadFormData = new FormData()
        uploadFormData.append('file', file)

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        })

        if (!uploadRes.ok) {
          throw new Error('Failed to upload photo')
        }

        const { url } = await uploadRes.json()
        photoUrls.push(url)
      }

      // Create product
      const res = await fetch('/api/vizlet/products/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentId,
          productName: formData.productName.trim(),
          productDescription: formData.productDescription.trim(),
          productPhotos: photoUrls,
          price,
          acceptedPaymentMethods: formData.acceptedPaymentMethods,
          deliveryTime: formData.deliveryTime.trim(),
          deliveryMethods: formData.deliveryMethods,
          customizationGuidelines: formData.customizationGuidelines.trim() || undefined,
          giftWrappingGuidelines: formData.giftWrappingGuidelines.trim() || undefined,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create product')
      }

      const { product } = await res.json()
      toast.success('Product created successfully!')
      
      if (onSuccess) {
        onSuccess()
      } else {
        router.push(`/vizlet/product/${product.id}`)
      }
    } catch (error) {
      console.error('Product creation error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create product')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Product Name */}
      <div>
        <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-2">
          Product Name *
        </label>
        <input
          type="text"
          id="productName"
          value={formData.productName}
          onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          required
        />
      </div>

      {/* Product Description */}
      <div>
        <label htmlFor="productDescription" className="block text-sm font-medium text-gray-700 mb-2">
          Product Description *
        </label>
        <textarea
          id="productDescription"
          value={formData.productDescription}
          onChange={(e) => setFormData({ ...formData, productDescription: e.target.value })}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          required
        />
      </div>

      {/* Product Photos */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Photos * (Minimum 5 required)
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handlePhotoChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-900 file:text-white hover:file:bg-gray-800"
        />
        <p className="text-xs text-gray-500 mt-1">
          {photoFiles.length} of 5 minimum photos uploaded
        </p>

        {/* Photo Previews */}
        {photoPreviews.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mt-4">
            {photoPreviews.map((preview, index) => (
              <div key={index} className="relative aspect-square">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Price */}
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
          Price (USD) *
        </label>
        <input
          type="number"
          id="price"
          step="0.01"
          min="0.01"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          required
        />
      </div>

      {/* Accepted Payment Methods */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Accepted Payment Methods *
        </label>
        <div className="space-y-2">
          {paymentMethodOptions.map((method) => (
            <label key={method} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.acceptedPaymentMethods.includes(method)}
                onChange={() => handleCheckboxChange('acceptedPaymentMethods', method)}
                className="mr-2 h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">{method}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Delivery Time */}
      <div>
        <label htmlFor="deliveryTime" className="block text-sm font-medium text-gray-700 mb-2">
          Delivery Time *
        </label>
        <input
          type="text"
          id="deliveryTime"
          placeholder="e.g., 3-5 business days"
          value={formData.deliveryTime}
          onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          required
        />
      </div>

      {/* Delivery Methods */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Delivery Methods *
        </label>
        <div className="space-y-2">
          {deliveryMethodOptions.map((method) => (
            <label key={method} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.deliveryMethods.includes(method)}
                onChange={() => handleCheckboxChange('deliveryMethods', method)}
                className="mr-2 h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">{method}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Customization Guidelines */}
      <div>
        <label htmlFor="customizationGuidelines" className="block text-sm font-medium text-gray-700 mb-2">
          Customization Guidelines (Optional)
        </label>
        <textarea
          id="customizationGuidelines"
          value={formData.customizationGuidelines}
          onChange={(e) => setFormData({ ...formData, customizationGuidelines: e.target.value })}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          placeholder="Describe any customization options available for this product"
        />
      </div>

      {/* Gift Wrapping Guidelines */}
      <div>
        <label htmlFor="giftWrappingGuidelines" className="block text-sm font-medium text-gray-700 mb-2">
          Gift Wrapping Guidelines (Optional)
        </label>
        <textarea
          id="giftWrappingGuidelines"
          value={formData.giftWrappingGuidelines}
          onChange={(e) => setFormData({ ...formData, giftWrappingGuidelines: e.target.value })}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          placeholder="Describe gift wrapping options and instructions"
        />
      </div>

      {/* Submit Button */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Creating...' : 'Create Product'}
        </button>
      </div>
    </form>
  )
}
