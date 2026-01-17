import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '12')

    // Get trending products based on view count and purchase count
    // Weighted formula: (viewCount * 0.3) + (purchaseCount * 0.7)
    const products = await prisma.vizLetProduct.findMany({
      where: {
        isActive: true,
        shop: {
          isActive: true,
        },
      },
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
            user: {
              select: {
                username: true,
              },
            },
          },
        },
      },
      orderBy: [
        { purchaseCount: 'desc' },
        { viewCount: 'desc' },
        { createdAt: 'desc' },
      ],
      take: limit,
    })

    return NextResponse.json({ products }, { status: 200 })
  } catch (error) {
    console.error('Get trending products error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trending products' },
      { status: 500 }
    )
  }
}
