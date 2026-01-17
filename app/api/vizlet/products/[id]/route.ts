import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { prisma } from '@/lib/prisma/client'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const product = await prisma.vizLetProduct.findUnique({
      where: { id },
      include: {
        content: {
          select: {
            id: true,
            mediaUrl: true,
            caption: true,
            type: true,
          },
        },
        shop: {
          select: {
            id: true,
            shopName: true,
            vizBizId: true,
            description: true,
            user: {
              select: {
                username: true,
              },
            },
          },
        },
      },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Increment view count (fire and forget - don't wait for it)
    prisma.vizLetProduct.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    }).catch(err => console.error('Failed to increment view count:', err))

    return NextResponse.json({ product }, { status: 200 })
  } catch (error) {
    console.error('Get product error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const { id } = params

    // Get the product and verify ownership
    const product = await prisma.vizLetProduct.findUnique({
      where: { id },
      include: {
        shop: true,
      },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    if (product.shop.userId !== userId) {
      return NextResponse.json({ error: 'Not authorized to update this product' }, { status: 403 })
    }

    const body = await request.json()
    const {
      productName,
      productDescription,
      productPhotos,
      price,
      acceptedPaymentMethods,
      deliveryTime,
      deliveryMethods,
      customizationGuidelines,
      giftWrappingGuidelines,
      isActive,
    } = body

    // Prepare update data
    const updateData: any = {}

    if (productName !== undefined) {
      if (productName.trim().length === 0) {
        return NextResponse.json({ error: 'Product name cannot be empty' }, { status: 400 })
      }
      updateData.productName = productName.trim()
    }

    if (productDescription !== undefined) {
      if (productDescription.trim().length === 0) {
        return NextResponse.json({ error: 'Product description cannot be empty' }, { status: 400 })
      }
      updateData.productDescription = productDescription.trim()
    }

    if (productPhotos !== undefined) {
      if (!Array.isArray(productPhotos) || productPhotos.length < 5) {
        return NextResponse.json({ error: 'Minimum 5 product photos required' }, { status: 400 })
      }
      updateData.productPhotos = productPhotos
    }

    if (price !== undefined) {
      if (typeof price !== 'number' || price <= 0) {
        return NextResponse.json({ error: 'Price must be greater than 0' }, { status: 400 })
      }
      updateData.price = price
    }

    if (acceptedPaymentMethods !== undefined) {
      updateData.acceptedPaymentMethods = acceptedPaymentMethods
    }

    if (deliveryTime !== undefined) {
      updateData.deliveryTime = deliveryTime
    }

    if (deliveryMethods !== undefined) {
      updateData.deliveryMethods = deliveryMethods
    }

    if (customizationGuidelines !== undefined) {
      updateData.customizationGuidelines = customizationGuidelines?.trim() || null
    }

    if (giftWrappingGuidelines !== undefined) {
      updateData.giftWrappingGuidelines = giftWrappingGuidelines?.trim() || null
    }

    if (isActive !== undefined) {
      updateData.isActive = isActive
    }

    // Update the product
    const updatedProduct = await prisma.vizLetProduct.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json({ product: updatedProduct }, { status: 200 })
  } catch (error) {
    console.error('Update product error:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const { id } = params

    // Get the product and verify ownership
    const product = await prisma.vizLetProduct.findUnique({
      where: { id },
      include: {
        shop: true,
      },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    if (product.shop.userId !== userId) {
      return NextResponse.json({ error: 'Not authorized to delete this product' }, { status: 403 })
    }

    // Deactivate instead of deleting (soft delete)
    await prisma.vizLetProduct.update({
      where: { id },
      data: { isActive: false },
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Delete product error:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
