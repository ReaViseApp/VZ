import { NextResponse } from 'next/server'
import { requireAdmin, logAdminActivity } from '@/lib/admin/auth'
import { prisma } from '@/lib/prisma/client'

// PUT /api/admin/users/[id]/ban - Ban user
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin()
  
  if (!admin) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  try {
    const { reason, ban } = await request.json()
    
    if (ban === undefined) {
      return NextResponse.json({ error: 'Ban status required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: { id: true, username: true, role: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Prevent banning other admins
    if (user.role === 'ADMIN') {
      return NextResponse.json({ error: 'Cannot ban admin users' }, { status: 403 })
    }

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: { 
        isBanned: ban,
        isSuspended: false, // Clear suspension if banning
        suspendedUntil: null,
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isBanned: true,
        isSuspended: true,
      }
    })

    // Log the activity
    await logAdminActivity({
      userId: admin.id,
      action: ban ? 'USER_BANNED' : 'USER_UNBANNED',
      targetType: 'USER',
      targetId: params.id,
      details: {
        username: user.username,
        reason: reason || 'No reason provided',
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error banning user:', error)
    return NextResponse.json({ error: 'Failed to ban user' }, { status: 500 })
  }
}
