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
    const { title, pages, isDraft } = body

    if (!title || !pages) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const editorial = await prisma.editorial.create({
      data: {
        userId: user.id,
        title,
        pages,
        isDraft: isDraft !== false,
      },
    })

    return NextResponse.json(editorial, { status: 201 })
  } catch (error) {
    console.error('Editorial creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create editorial' },
      { status: 500 }
    )
  }
}
