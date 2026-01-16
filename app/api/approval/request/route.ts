import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma/client'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const { contentId, quotableRegionId } = body

    if (!contentId) {
      return NextResponse.json({ error: 'Content ID required' }, { status: 400 })
    }

    const content = await prisma.content.findUnique({
      where: { id: contentId }
    })

    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 })
    }

    const existing = await prisma.approvalRequest.findFirst({
      where: {
        requesterId: user.id,
        contentId,
        quotableRegionId: quotableRegionId || null,
        status: 'PENDING'
      }
    })

    if (existing) {
      return NextResponse.json({ error: 'Request already exists' }, { status: 400 })
    }

    const approvalRequest = await prisma.approvalRequest.create({
      data: {
        requesterId: user.id,
        creatorId: content.userId,
        contentId,
        quotableRegionId: quotableRegionId || null,
        status: 'PENDING',
      },
      include: {
        content: true,
        requester: {
          select: { id: true, username: true }
        }
      }
    })

    return NextResponse.json(approvalRequest, { status: 201 })
  } catch (error) {
    console.error('Approval request error:', error)
    return NextResponse.json({ error: 'Failed to create approval request' }, { status: 500 })
  }
}
