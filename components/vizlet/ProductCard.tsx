'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { VizLetProduct } from '@/types/vizlet'

interface ProductCardProps {
  product: VizLetProduct
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/vizlet/product/${product.id}`}
      className="group block bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
    >
      {/* Product Image */}
      <div className="relative w-full h-48 bg-gray-100">
        {product.productPhotos && product.productPhotos.length > 0 ? (
          <Image
            src={product.productPhotos[0]}
            alt={product.productName}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
        {/* Price Badge */}
        <div className="absolute top-2 right-2 bg-gray-900 text-white px-3 py-1 rounded-full text-sm font-bold">
          ${product.price.toFixed(2)}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-gray-600 transition-colors">
          {product.productName}
        </h3>
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
          {product.productDescription}
        </p>

        {/* Shop Info */}
        {product.shop && (
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 truncate">
                {product.shop.shopName}
              </p>
              <p className="text-xs text-gray-400">
                ID: {product.shop.vizBizId}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400 ml-2">
              <span>{product.viewCount} views</span>
              {product.purchaseCount > 0 && (
                <span>• {product.purchaseCount} sold</span>
              )}
            </div>
          </div>
        )}
      </div>
    </Link>
  )
}
