import { NextResponse } from 'next/server'
import { requireAdmin, logAdminActivity } from '@/lib/admin/auth'
import { prisma } from '@/lib/prisma/client'

// PUT /api/admin/users/[id]/suspend - Suspend user
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin()
  
  if (!admin) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  try {
    const { reason, suspend, days } = await request.json()
    
    if (suspend === undefined) {
      return NextResponse.json({ error: 'Suspend status required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: { id: true, username: true, role: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Prevent suspending admins
    if (user.role === 'ADMIN') {
      return NextResponse.json({ error: 'Cannot suspend admin users' }, { status: 403 })
    }

    let suspendedUntil = null
    if (suspend && days) {
      const date = new Date()
      date.setDate(date.getDate() + days)
      suspendedUntil = date
    }

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: { 
        isSuspended: suspend,
        suspendedUntil: suspend ? suspendedUntil : null,
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isBanned: true,
        isSuspended: true,
        suspendedUntil: true,
      }
    })

    // Log the activity
    await logAdminActivity({
      userId: admin.id,
      action: suspend ? 'USER_SUSPENDED' : 'USER_UNSUSPENDED',
      targetType: 'USER',
      targetId: params.id,
      details: {
        username: user.username,
        reason: reason || 'No reason provided',
        days: days || null,
        suspendedUntil,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error suspending user:', error)
    return NextResponse.json({ error: 'Failed to suspend user' }, { status: 500 })
  }
}
