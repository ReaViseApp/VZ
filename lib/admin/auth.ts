import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { prisma } from '@/lib/prisma/client'

/**
 * Check if the current user has admin role
 * @returns User object if admin, null otherwise
 */
export async function requireAdmin() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    return null
  }
  
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      isBanned: true,
      isSuspended: true,
    }
  })
  
  if (!user || user.role !== 'ADMIN') {
    return null
  }
  
  return user
}

/**
 * Log admin activity
 */
export async function logAdminActivity({
  userId,
  action,
  targetType,
  targetId,
  details,
  ipAddress,
}: {
  userId: string
  action: string
  targetType?: string
  targetId?: string
  details?: any
  ipAddress?: string
}) {
  try {
    await prisma.adminActivityLog.create({
      data: {
        userId,
        action,
        targetType,
        targetId,
        details,
        ipAddress,
      },
    })
  } catch (error) {
    console.error('Failed to log admin activity:', error)
  }
}
