import { NextResponse } from 'next/server'
import { requireAdmin, logAdminActivity } from '@/lib/admin/auth'
import { prisma } from '@/lib/prisma/client'

// PUT /api/admin/users/[id]/role - Change user role
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin()
  
  if (!admin) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  try {
    const { role } = await request.json()
    
    if (!['USER', 'MODERATOR', 'ADMIN'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: { id: true, username: true, role: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: { role },
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
      action: 'USER_ROLE_CHANGED',
      targetType: 'USER',
      targetId: params.id,
      details: {
        username: user.username,
        previousRole: user.role,
        newRole: role,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error updating user role:', error)
    return NextResponse.json({ error: 'Failed to update user role' }, { status: 500 })
  }
}
