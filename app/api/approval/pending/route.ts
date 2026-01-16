import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma/client'

export async function GET() {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const pendingRequests = await prisma.approvalRequest.findMany({
      where: {
        creatorId: user.id,
        status: 'PENDING'
      },
      include: {
        requester: {
          select: { id: true, username: true }
        },
        content: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(pendingRequests)
  } catch (error) {
    console.error('Error fetching pending approvals:', error)
    return NextResponse.json({ error: 'Failed to fetch approvals' }, { status: 500 })
  }
}
