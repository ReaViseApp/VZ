import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
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
    const { type, mediaUrl, caption, hashtags } = body

    if (!type || !mediaUrl) {
      return NextResponse.json(
        { error: 'Missing required fields: type and mediaUrl' },
        { status: 400 }
      )
    }

    const content = await prisma.content.create({
      data: {
        userId: user.id,
        type,
        mediaUrl,
        caption: caption || null,
        hashtags: hashtags || [],
      },
    })

    return NextResponse.json(content, { status: 201 })
  } catch (error) {
    console.error('Content upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload content' },
      { status: 500 }
    )
  }
}
