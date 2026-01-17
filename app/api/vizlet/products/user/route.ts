import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { prisma } from '@/lib/prisma/client'

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // Get user's shop
    const shop = await prisma.vizLetShop.findUnique({
      where: { userId },
    })

    if (!shop) {
      return NextResponse.json({ products: [] }, { status: 200 })
    }

    // Get user's products
    const products = await prisma.vizLetProduct.findMany({
      where: { shopId: shop.id },
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
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ products }, { status: 200 })
  } catch (error) {
    console.error('Get user products error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
