'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { VizLetShop } from '@/types/vizlet'

interface ShopCardProps {
  shop: VizLetShop & {
    user?: { username: string }
    _count?: { products: number }
    products?: Array<{
      content?: { mediaUrl: string }
    }>
  }
}

export default function ShopCard({ shop }: ShopCardProps) {
  const productCount = shop._count?.products || 0
  const sampleProducts = shop.products?.slice(0, 3) || []

  return (
    <Link
      href={`/vizlet/shop/${shop.vizBizId}`}
      className="group block bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
    >
      {/* Shop Preview Images */}
      <div className="relative w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200">
        {sampleProducts.length > 0 ? (
          <div className="grid grid-cols-3 gap-1 h-full p-2">
            {sampleProducts.map((product, idx) => (
              <div key={idx} className="relative bg-white rounded overflow-hidden">
                {product.content?.mediaUrl && (
                  <Image
                    src={product.content.mediaUrl}
                    alt="Product"
                    fill
                    className="object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400">
              <svg
                className="w-12 h-12 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <p className="text-xs">No Products Yet</p>
            </div>
          </div>
        )}
      </div>

      {/* Shop Info */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 mb-1 group-hover:text-gray-600 transition-colors">
          {shop.shopName}
        </h3>
        <p className="text-xs text-gray-500 mb-2">
          Viz.Biz ID: {shop.vizBizId}
        </p>
        {shop.user && (
          <p className="text-xs text-gray-400 mb-3">
            by @{shop.user.username}
          </p>
        )}

        {shop.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {shop.description}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="text-sm text-gray-600">
            <span className="font-semibold">{productCount}</span>{' '}
            {productCount === 1 ? 'product' : 'products'}
          </div>
          {shop.isActive && (
            <div className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
              Active
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
