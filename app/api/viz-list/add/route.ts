import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma/client'

export async function POST(request: NextRequest) {
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

    const existing = await prisma.vizList.findUnique({
      where: {
        userId_contentId_quotableRegionId: {
          userId: user.id,
          contentId,
          quotableRegionId: quotableRegionId || null
        }
      }
    })

    if (existing) {
      return NextResponse.json({ message: 'Already in Viz.List' }, { status: 200 })
    }

    const vizListItem = await prisma.vizList.create({
      data: {
        userId: user.id,
        contentId,
        quotableRegionId: quotableRegionId || null,
      },
      include: {
        content: true
      }
    })

    return NextResponse.json(vizListItem, { status: 201 })
  } catch (error) {
    console.error('Add to Viz.List error:', error)
    return NextResponse.json(
      { error: 'Failed to add to Viz.List' },
      { status: 500 }
    )
  }
}
