import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { prisma } from '@/lib/prisma/client'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const editorial = await prisma.editorial.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            username: true
          }
        }
      }
    })

    if (!editorial) {
      return NextResponse.json({ error: 'Editorial not found' }, { status: 404 })
    }

    return NextResponse.json(editorial)
  } catch (error) {
    console.error('Error fetching editorial:', error)
    return NextResponse.json({ error: 'Failed to fetch editorial' }, { status: 500 })
  }
}

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

    const body = await request.json()
    const { title, pages, isDraft } = body

    const editorial = await prisma.editorial.findUnique({
      where: { id: params.id }
    })

    if (!editorial) {
      return NextResponse.json({ error: 'Editorial not found' }, { status: 404 })
    }

    if (editorial.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const updated = await prisma.editorial.update({
      where: { id: params.id },
      data: {
        title: title || editorial.title,
        pages: pages || editorial.pages,
        isDraft: isDraft !== undefined ? isDraft : editorial.isDraft,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating editorial:', error)
    return NextResponse.json({ error: 'Failed to update editorial' }, { status: 500 })
  }
}
