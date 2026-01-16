import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/client'

export async function GET() {
  try {
    const editorials = await prisma.editorial.findMany({
      where: {
        isDraft: false,
        publishedAt: { not: null }
      },
      include: {
        user: {
          select: {
            id: true,
            username: true
          }
        }
      },
      orderBy: { publishedAt: 'desc' },
      take: 50
    })

    return NextResponse.json(editorials)
  } catch (error) {
    console.error('Error fetching editorial feed:', error)
    return NextResponse.json({ error: 'Failed to fetch feed' }, { status: 500 })
  }
}
