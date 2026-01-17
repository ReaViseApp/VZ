import { NextResponse } from 'next/server'
import { requireAdmin, logAdminActivity } from '@/lib/admin/auth'
import { prisma } from '@/lib/prisma/client'

// PUT /api/admin/content/[id]/feature - Feature/unfeature content
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin()
  
  if (!admin) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  try {
    const { featured } = await request.json()
    
    if (featured === undefined) {
      return NextResponse.json({ error: 'Featured status required' }, { status: 400 })
    }

    const content = await prisma.content.findUnique({
      where: { id: params.id },
      select: { id: true, caption: true, user: { select: { username: true } } }
    })

    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 })
    }

    const updatedContent = await prisma.content.update({
      where: { id: params.id },
      data: { 
        isFeatured: featured,
        featuredAt: featured ? new Date() : null,
      },
      select: {
        id: true,
        isFeatured: true,
        featuredAt: true,
        user: {
          select: {
            username: true,
          }
        }
      }
    })

    // Log the activity
    await logAdminActivity({
      userId: admin.id,
      action: featured ? 'CONTENT_FEATURED' : 'CONTENT_UNFEATURED',
      targetType: 'CONTENT',
      targetId: params.id,
      details: {
        caption: content.caption,
        author: content.user.username,
      },
    })

    return NextResponse.json(updatedContent)
  } catch (error) {
    console.error('Error featuring content:', error)
    return NextResponse.json({ error: 'Failed to feature content' }, { status: 500 })
  }
}
