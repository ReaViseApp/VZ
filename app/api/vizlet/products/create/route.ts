import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { prisma } from '@/lib/prisma/client'

export async function POST(request: NextRequest) {
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
      return NextResponse.json({ error: 'No shop found. Please create a shop first.' }, { status: 404 })
    }

    if (!shop.isActive) {
      return NextResponse.json({ error: 'Shop is not active' }, { status: 403 })
    }

    const body = await request.json()
    const {
      contentId,
      quotableRegionId,
      productName,
      productDescription,
      productPhotos,
      price,
      acceptedPaymentMethods,
      deliveryTime,
      deliveryMethods,
      customizationGuidelines,
      giftWrappingGuidelines,
    } = body

    // Validate required fields
    if (!contentId || !productName || !productDescription || !productPhotos || !price || !deliveryTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate product photos (minimum 5)
    if (!Array.isArray(productPhotos) || productPhotos.length < 5) {
      return NextResponse.json({ error: 'Minimum 5 product photos required' }, { status: 400 })
    }

    // Validate price
    if (typeof price !== 'number' || price <= 0) {
      return NextResponse.json({ error: 'Price must be greater than 0' }, { status: 400 })
    }

    // Verify that the content exists and belongs to the user
    const content = await prisma.content.findUnique({
      where: { id: contentId },
    })

    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 })
    }

    if (content.userId !== userId) {
      return NextResponse.json({ error: 'You can only create products from your own content' }, { status: 403 })
    }

    // Create the product
    const product = await prisma.vizLetProduct.create({
      data: {
        shopId: shop.id,
        contentId,
        quotableRegionId: quotableRegionId || null,
        productName: productName.trim(),
        productDescription: productDescription.trim(),
        productPhotos,
        price,
        acceptedPaymentMethods: acceptedPaymentMethods || [],
        deliveryTime,
        deliveryMethods: deliveryMethods || [],
        customizationGuidelines: customizationGuidelines?.trim() || null,
        giftWrappingGuidelines: giftWrappingGuidelines?.trim() || null,
      },
      include: {
        content: {
          select: {
            mediaUrl: true,
            caption: true,
          },
        },
        shop: true,
      },
    })

    return NextResponse.json({ product }, { status: 201 })
  } catch (error) {
    console.error('Product creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
