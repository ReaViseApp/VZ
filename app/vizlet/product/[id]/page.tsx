import { prisma } from '@/lib/prisma/client'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await prisma.vizLetProduct.findUnique({
    where: { id: params.id },
    include: {
      content: {
        select: {
          id: true,
          mediaUrl: true,
          caption: true,
          type: true,
        },
      },
      shop: {
        include: {
          user: {
            select: {
              username: true,
            },
          },
        },
      },
    },
  })

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <div className="space-y-4">
              {product.productPhotos.map((photo, index) => (
                <div key={index} className="relative w-full aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={photo}
                    alt={`${product.productName} - Photo ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.productName}
                </h1>
                <p className="text-2xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {product.productDescription}
                </p>
              </div>

              {/* Shop Info */}
              <div className="border-t pt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Shop</h2>
                <Link
                  href={`/vizlet/shop/${product.shop.vizBizId}`}
                  className="inline-flex items-center text-gray-700 hover:text-gray-900"
                >
                  <div>
                    <p className="font-medium">{product.shop.shopName}</p>
                    <p className="text-sm text-gray-500">
                      Viz.Biz ID: {product.shop.vizBizId}
                    </p>
                    <p className="text-sm text-gray-500">
                      by @{product.shop.user.username}
                    </p>
                  </div>
                </Link>
              </div>

              {/* Payment Methods */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Accepted Payment Methods
                </h2>
                <div className="flex flex-wrap gap-2">
                  {product.acceptedPaymentMethods.map((method) => (
                    <span
                      key={method}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {method}
                    </span>
                  ))}
                </div>
              </div>

              {/* Delivery */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Delivery</h2>
                <p className="text-gray-700 mb-2">
                  <span className="font-medium">Delivery Time:</span> {product.deliveryTime}
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.deliveryMethods.map((method) => (
                    <span
                      key={method}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {method}
                    </span>
                  ))}
                </div>
              </div>

              {/* Optional Guidelines */}
              {product.customizationGuidelines && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    Customization Guidelines
                  </h2>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {product.customizationGuidelines}
                  </p>
                </div>
              )}

              {product.giftWrappingGuidelines && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    Gift Wrapping Guidelines
                  </h2>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {product.giftWrappingGuidelines}
                  </p>
                </div>
              )}

              {/* Stats */}
              <div className="border-t pt-6">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{product.viewCount} views</span>
                  {product.purchaseCount > 0 && (
                    <span>• {product.purchaseCount} sold</span>
                  )}
                </div>
              </div>

              {/* Original Content Reference */}
              <div className="border-t pt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Based on Quotable Content
                </h2>
                <div className="relative w-full h-48 rounded-lg overflow-hidden">
                  <Image
                    src={product.content.mediaUrl}
                    alt="Original content"
                    fill
                    className="object-cover"
                  />
                </div>
                {product.content.caption && (
                  <p className="text-sm text-gray-600 mt-2">{product.content.caption}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
