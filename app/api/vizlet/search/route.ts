import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')?.trim()

    if (!query) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 })
    }

    // Search products by name
    const products = await prisma.vizLetProduct.findMany({
      where: {
        isActive: true,
        shop: {
          isActive: true,
        },
        OR: [
          {
            productName: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            productDescription: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
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
      ],
      take: 20,
    })

    // Search shops by name or vizBizId
    const shops = await prisma.vizLetShop.findMany({
      where: {
        isActive: true,
        OR: [
          {
            shopName: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            vizBizId: {
              contains: query,
            },
          },
          {
            user: {
              username: {
                contains: query,
                mode: 'insensitive',
              },
            },
          },
        ],
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
      take: 10,
    })

    return NextResponse.json({ products, shops }, { status: 200 })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    )
  }
}
