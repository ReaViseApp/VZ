import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin/auth'
import { prisma } from '@/lib/prisma/client'

// GET /api/admin/content - List all content with filters
export async function GET(request: Request) {
  const admin = await requireAdmin()
  
  if (!admin) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const perPage = parseInt(searchParams.get('perPage') || '50')
    const type = searchParams.get('type') || 'ALL'
    const status = searchParams.get('status') || 'ALL'
    const featured = searchParams.get('featured') || 'ALL'
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Build where clause
    const where: any = {}

    if (type !== 'ALL') {
      where.type = type
    }

    if (status === 'APPROVED') {
      where.isApproved = true
    } else if (status === 'PENDING') {
      where.isApproved = false
    }

    if (featured === 'FEATURED') {
      where.isFeatured = true
    } else if (featured === 'NOT_FEATURED') {
      where.isFeatured = false
    }

    // Get total count
    const total = await prisma.content.count({ where })

    // Get content with pagination
    const content = await prisma.content.findMany({
      where,
      select: {
        id: true,
        userId: true,
        type: true,
        mediaUrl: true,
        caption: true,
        hashtags: true,
        isFeatured: true,
        featuredAt: true,
        isApproved: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            username: true,
          }
        },
        _count: {
          select: {
            vizLists: true,
            approvalRequests: true,
            flags: true,
          }
        }
      },
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * perPage,
      take: perPage,
    })

    return NextResponse.json({
      content,
      pagination: {
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      }
    })
  } catch (error) {
    console.error('Error fetching content:', error)
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 })
  }
}
