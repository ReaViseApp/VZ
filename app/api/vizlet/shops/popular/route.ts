import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '12')

    // Get popular shops based on total products and total purchases
    const shops = await prisma.vizLetShop.findMany({
      where: {
        isActive: true,
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
        products: {
          where: { isActive: true },
          take: 3,
          orderBy: { createdAt: 'desc' },
          include: {
            content: {
              select: {
                mediaUrl: true,
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
      take: limit,
    })

    // Calculate popularity score for each shop
    const shopsWithScore = await Promise.all(
      shops.map(async (shop) => {
        // Get total purchase count for all products in this shop
        const purchaseStats = await prisma.vizLetProduct.aggregate({
          where: {
            shopId: shop.id,
            isActive: true,
          },
          _sum: {
            purchaseCount: true,
          },
        })

        const totalPurchases = purchaseStats._sum.purchaseCount || 0
        const productCount = shop._count.products

        // Popularity score: products * 0.4 + purchases * 0.6
        const popularityScore = productCount * 0.4 + totalPurchases * 0.6

        return {
          ...shop,
          popularityScore,
        }
      })
    )

    // Sort by popularity score
    shopsWithScore.sort((a, b) => b.popularityScore - a.popularityScore)

    // Remove the popularity score from the response
    const sortedShops = shopsWithScore.map(({ popularityScore, ...shop }) => shop)

    return NextResponse.json({ shops: sortedShops }, { status: 200 })
  } catch (error) {
    console.error('Get popular shops error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch popular shops' },
      { status: 500 }
    )
  }
}
