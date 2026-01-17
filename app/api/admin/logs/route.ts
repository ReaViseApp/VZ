import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin/auth'
import { prisma } from '@/lib/prisma/client'

// GET /api/admin/logs - Get activity logs
export async function GET(request: Request) {
  const admin = await requireAdmin()
  
  if (!admin) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const perPage = parseInt(searchParams.get('perPage') || '50')
    const action = searchParams.get('action') || ''
    const targetType = searchParams.get('targetType') || ''
    const userId = searchParams.get('userId') || ''

    // Build where clause
    const where: any = {}

    if (action) {
      where.action = { contains: action, mode: 'insensitive' }
    }

    if (targetType) {
      where.targetType = targetType
    }

    if (userId) {
      where.userId = userId
    }

    // Get total count
    const total = await prisma.adminActivityLog.count({ where })

    // Get logs with pagination
    const logs = await prisma.adminActivityLog.findMany({
      where,
      select: {
        id: true,
        action: true,
        targetType: true,
        targetId: true,
        details: true,
        ipAddress: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
    })

    return NextResponse.json({
      logs,
      pagination: {
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      }
    })
  } catch (error) {
    console.error('Error fetching logs:', error)
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 })
  }
}
