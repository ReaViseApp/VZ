import { prisma } from '@/lib/prisma/client'
import { notFound } from 'next/navigation'
import ProductCard from '@/components/vizlet/ProductCard'

export default async function ShopPage({ params }: { params: { vizBizId: string } }) {
  const shop = await prisma.vizLetShop.findUnique({
    where: { vizBizId: params.vizBizId },
    include: {
      user: {
        select: {
          username: true,
        },
      },
      products: {
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
        include: {
          content: {
            select: {
              id: true,
              mediaUrl: true,
              caption: true,
            },
          },
          shop: {
            select: {
              id: true,
              shopName: true,
              vizBizId: true,
            },
          },
        },
      },
      _count: {
        select: {
          products: true,
        },
      },
    },
  })

  if (!shop) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Shop Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {shop.shopName}
              </h1>
              <p className="text-gray-600 mb-4">
                Viz.Biz ID: {shop.vizBizId}
              </p>
              <p className="text-gray-600 mb-4">
                by @{shop.user.username}
              </p>

              {shop.description && (
                <p className="text-gray-700 mt-4">
                  {shop.description}
                </p>
              )}
            </div>

            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {shop._count.products}
              </div>
              <div className="text-sm text-gray-600">
                {shop._count.products === 1 ? 'Product' : 'Products'}
              </div>
              {shop.isActive && (
                <div className="mt-2 px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full inline-block">
                  Active
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Products */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Products</h2>
          
          {shop.products.length === 0 ? (
            <div className="bg-white rounded-lg p-12 text-center">
              <p className="text-gray-500">No products available yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {shop.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
