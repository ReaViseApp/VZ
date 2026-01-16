import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma/client'

export async function POST(
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

    const editorial = await prisma.editorial.findUnique({
      where: { id: params.id }
    })

    if (!editorial) {
      return NextResponse.json({ error: 'Editorial not found' }, { status: 404 })
    }

    if (editorial.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const published = await prisma.editorial.update({
      where: { id: params.id },
      data: {
        isDraft: false,
        publishedAt: new Date(),
      },
    })

    return NextResponse.json(published)
  } catch (error) {
    console.error('Error publishing editorial:', error)
    return NextResponse.json({ error: 'Failed to publish editorial' }, { status: 500 })
  }
}
