import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { prisma } from '@/lib/prisma/client'
import { generateVizBizId } from '@/lib/vizlet/generateVizBizId'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // Check if user already has a shop
    const existingShop = await prisma.vizLetShop.findUnique({
      where: { userId },
    })

    if (existingShop) {
      return NextResponse.json({ error: 'User already has a shop' }, { status: 400 })
    }

    const body = await request.json()
    const { shopName, description } = body

    if (!shopName || shopName.trim().length === 0) {
      return NextResponse.json({ error: 'Shop name is required' }, { status: 400 })
    }

    // Generate unique Viz.Biz ID
    const vizBizId = await generateVizBizId()

    // Calculate trial end date (1 year from now)
    const trialEndsAt = new Date()
    trialEndsAt.setFullYear(trialEndsAt.getFullYear() + 1)

    // Create the shop
    const shop = await prisma.vizLetShop.create({
      data: {
        userId,
        vizBizId,
        shopName: shopName.trim(),
        description: description?.trim() || null,
        trialEndsAt,
      },
    })

    return NextResponse.json({ shop }, { status: 201 })
  } catch (error) {
    console.error('Shop creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create shop' },
      { status: 500 }
    )
  }
}
