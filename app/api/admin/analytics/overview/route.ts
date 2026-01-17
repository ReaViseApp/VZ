import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin/auth'
import { prisma } from '@/lib/prisma/client'

// GET /api/admin/analytics/overview - Get dashboard statistics
export async function GET() {
  const admin = await requireAdmin()
  
  if (!admin) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  try {
    // Get date 30 days ago
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // Get date 7 days ago
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    // Parallel queries for better performance
    const [
      totalUsers,
      newUsersLast30Days,
      activeUsersLast7Days,
      bannedUsers,
      suspendedUsers,
      totalContent,
      totalEditorials,
      totalVizListSaves,
      pendingApprovals,
      featuredContent,
      recentUsers,
      recentContent,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.user.count({
        where: {
          OR: [
            { contents: { some: { createdAt: { gte: sevenDaysAgo } } } },
            { editorials: { some: { createdAt: { gte: sevenDaysAgo } } } },
          ]
        }
      }),
      prisma.user.count({ where: { isBanned: true } }),
      prisma.user.count({ where: { isSuspended: true } }),
      prisma.content.count(),
      prisma.editorial.count(),
      prisma.vizList.count(),
      prisma.approvalRequest.count({ where: { status: 'PENDING' } }),
      prisma.content.count({ where: { isFeatured: true } }),
      prisma.user.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          createdAt: true,
        }
      }),
      prisma.content.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          type: true,
          caption: true,
          createdAt: true,
          user: {
            select: {
              username: true,
            }
          }
        }
      }),
    ])

    // Get user growth data (last 30 days)
    const userGrowth = await prisma.$queryRaw`
      SELECT DATE("createdAt") as date, COUNT(*)::int as count
      FROM "User"
      WHERE "createdAt" >= ${thirtyDaysAgo}
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `

    // Get content by type
    const contentByType = await prisma.content.groupBy({
      by: ['type'],
      _count: true,
    })

    // Get top creators
    const topCreators = await prisma.user.findMany({
      take: 10,
      select: {
        id: true,
        username: true,
        _count: {
          select: {
            contents: true,
            editorials: true,
          }
        }
      },
      orderBy: {
        contents: {
          _count: 'desc'
        }
      }
    })

    return NextResponse.json({
      overview: {
        totalUsers,
        newUsersLast30Days,
        activeUsersLast7Days,
        bannedUsers,
        suspendedUsers,
        totalContent,
        totalEditorials,
        totalVizListSaves,
        pendingApprovals,
        featuredContent,
      },
      charts: {
        userGrowth,
        contentByType,
      },
      recentActivity: {
        recentUsers,
        recentContent,
      },
      topCreators,
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
