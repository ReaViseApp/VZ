import { NextResponse } from 'next/server'
import { requireAdmin, logAdminActivity } from '@/lib/admin/auth'
import { prisma } from '@/lib/prisma/client'

// PUT /api/admin/content/[id]/approve - Approve/reject content
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin()
  
  if (!admin) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  try {
    const { approved, reason } = await request.json()
    
    if (approved === undefined) {
      return NextResponse.json({ error: 'Approval status required' }, { status: 400 })
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
      data: { isApproved: approved },
      select: {
        id: true,
        isApproved: true,
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
      action: approved ? 'CONTENT_APPROVED' : 'CONTENT_REJECTED',
      targetType: 'CONTENT',
      targetId: params.id,
      details: {
        caption: content.caption,
        author: content.user.username,
        reason: reason || 'No reason provided',
      },
    })

    return NextResponse.json(updatedContent)
  } catch (error) {
    console.error('Error approving content:', error)
    return NextResponse.json({ error: 'Failed to approve content' }, { status: 500 })
  }
}
