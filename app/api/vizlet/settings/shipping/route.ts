import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { prisma } from '@/lib/prisma/client'

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // Get user's shipping addresses
    const addresses = await prisma.shippingAddress.findMany({
      where: { userId },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' },
      ],
    })

    return NextResponse.json({ addresses }, { status: 200 })
  } catch (error) {
    console.error('Get shipping addresses error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch shipping addresses' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const body = await request.json()
    const {
      fullName,
      address1,
      address2,
      city,
      state,
      postalCode,
      country,
      phone,
      isDefault,
    } = body

    // Validate required fields
    if (!fullName || !address1 || !city || !state || !postalCode || !country || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // If this is set as default, unset all other defaults
    if (isDefault) {
      await prisma.shippingAddress.updateMany({
        where: { userId },
        data: { isDefault: false },
      })
    }

    // Create the shipping address
    const address = await prisma.shippingAddress.create({
      data: {
        userId,
        fullName: fullName.trim(),
        address1: address1.trim(),
        address2: address2?.trim() || null,
        city: city.trim(),
        state: state.trim(),
        postalCode: postalCode.trim(),
        country: country.trim(),
        phone: phone.trim(),
        isDefault: isDefault || false,
      },
    })

    return NextResponse.json({ address }, { status: 201 })
  } catch (error) {
    console.error('Create shipping address error:', error)
    return NextResponse.json(
      { error: 'Failed to create shipping address' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: 'Address ID is required' }, { status: 400 })
    }

    // Verify ownership
    const existingAddress = await prisma.shippingAddress.findUnique({
      where: { id },
    })

    if (!existingAddress || existingAddress.userId !== userId) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 })
    }

    // If setting as default, unset all other defaults
    if (updateData.isDefault) {
      await prisma.shippingAddress.updateMany({
        where: { userId },
        data: { isDefault: false },
      })
    }

    // Update the address
    const address = await prisma.shippingAddress.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ address }, { status: 200 })
  } catch (error) {
    console.error('Update shipping address error:', error)
    return NextResponse.json(
      { error: 'Failed to update shipping address' },
      { status: 500 }
    )
  }
}
