import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/client'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Fetch shop by ID (could be shop id or vizBizId)
    let shop = await prisma.vizLetShop.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            username: true,
          },
        },
        products: {
          where: { isActive: true },
          orderBy: { createdAt: 'desc' },
          take: 12,
          include: {
            content: {
              select: {
                mediaUrl: true,
                caption: true,
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

    // If not found by ID, try by vizBizId
    if (!shop) {
      shop = await prisma.vizLetShop.findUnique({
        where: { vizBizId: id },
        include: {
          user: {
            select: {
              username: true,
            },
          },
          products: {
            where: { isActive: true },
            orderBy: { createdAt: 'desc' },
            take: 12,
            include: {
              content: {
                select: {
                  mediaUrl: true,
                  caption: true,
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
    }

    if (!shop) {
      return NextResponse.json({ error: 'Shop not found' }, { status: 404 })
    }

    return NextResponse.json({ shop }, { status: 200 })
  } catch (error) {
    console.error('Get shop error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch shop' },
      { status: 500 }
    )
  }
}
