import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { prisma } from '@/lib/prisma/client'

export async function PATCH(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // Get user's shop
    const shop = await prisma.vizLetShop.findUnique({
      where: { userId },
    })

    if (!shop) {
      return NextResponse.json({ error: 'Shop not found' }, { status: 404 })
    }

    const body = await request.json()
    const { shopName, description, isActive } = body

    // Prepare update data
    const updateData: {
      shopName?: string
      description?: string | null
      isActive?: boolean
    } = {}

    if (shopName !== undefined) {
      if (shopName.trim().length === 0) {
        return NextResponse.json({ error: 'Shop name cannot be empty' }, { status: 400 })
      }
      updateData.shopName = shopName.trim()
    }

    if (description !== undefined) {
      updateData.description = description?.trim() || null
    }

    if (isActive !== undefined) {
      updateData.isActive = isActive
    }

    // Update the shop
    const updatedShop = await prisma.vizLetShop.update({
      where: { userId },
      data: updateData,
    })

    return NextResponse.json({ shop: updatedShop }, { status: 200 })
  } catch (error) {
    console.error('Shop update error:', error)
    return NextResponse.json(
      { error: 'Failed to update shop' },
      { status: 500 }
    )
  }
}
