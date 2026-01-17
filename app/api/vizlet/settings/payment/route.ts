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

    // Get user's payment methods
    const paymentMethods = await prisma.paymentMethod.findMany({
      where: { userId },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' },
      ],
    })

    return NextResponse.json({ paymentMethods }, { status: 200 })
  } catch (error) {
    console.error('Get payment methods error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payment methods' },
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
      type,
      lastFourDigits,
      expiryMonth,
      expiryYear,
      cardholderName,
      isDefault,
    } = body

    // Validate required fields
    if (!type) {
      return NextResponse.json({ error: 'Payment method type is required' }, { status: 400 })
    }

    // Validate card fields if type is card
    if (type === 'credit_card' || type === 'debit_card') {
      if (!lastFourDigits || !expiryMonth || !expiryYear || !cardholderName) {
        return NextResponse.json({ error: 'Card details are required' }, { status: 400 })
      }
    }

    // If this is set as default, unset all other defaults
    if (isDefault) {
      await prisma.paymentMethod.updateMany({
        where: { userId },
        data: { isDefault: false },
      })
    }

    // Create the payment method
    const paymentMethod = await prisma.paymentMethod.create({
      data: {
        userId,
        type,
        lastFourDigits: lastFourDigits || null,
        expiryMonth: expiryMonth || null,
        expiryYear: expiryYear || null,
        cardholderName: cardholderName?.trim() || null,
        isDefault: isDefault || false,
      },
    })

    return NextResponse.json({ paymentMethod }, { status: 201 })
  } catch (error) {
    console.error('Create payment method error:', error)
    return NextResponse.json(
      { error: 'Failed to create payment method' },
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
      return NextResponse.json({ error: 'Payment method ID is required' }, { status: 400 })
    }

    // Verify ownership
    const existingPaymentMethod = await prisma.paymentMethod.findUnique({
      where: { id },
    })

    if (!existingPaymentMethod || existingPaymentMethod.userId !== userId) {
      return NextResponse.json({ error: 'Payment method not found' }, { status: 404 })
    }

    // If setting as default, unset all other defaults
    if (updateData.isDefault) {
      await prisma.paymentMethod.updateMany({
        where: { userId },
        data: { isDefault: false },
      })
    }

    // Update the payment method
    const paymentMethod = await prisma.paymentMethod.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ paymentMethod }, { status: 200 })
  } catch (error) {
    console.error('Update payment method error:', error)
    return NextResponse.json(
      { error: 'Failed to update payment method' },
      { status: 500 }
    )
  }
}
