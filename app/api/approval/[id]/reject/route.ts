import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { prisma } from '@/lib/prisma/client'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const approvalRequest = await prisma.approvalRequest.findUnique({
      where: { id: params.id }
    })

    if (!approvalRequest) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 })
    }

    if (approvalRequest.creatorId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const updated = await prisma.approvalRequest.update({
      where: { id: params.id },
      data: { status: 'REJECTED' }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error rejecting request:', error)
    return NextResponse.json({ error: 'Failed to reject request' }, { status: 500 })
  }
}
