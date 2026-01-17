import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin/auth'
import { prisma } from '@/lib/prisma/client'

// GET /api/admin/users - List all users with filters
export async function GET(request: Request) {
  const admin = await requireAdmin()
  
  if (!admin) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const perPage = parseInt(searchParams.get('perPage') || '50')
    const search = searchParams.get('search') || ''
    const role = searchParams.get('role') || 'ALL'
    const status = searchParams.get('status') || 'ALL'
    const verified = searchParams.get('verified') || 'ALL'
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Build where clause
    const where: any = {}

    if (search) {
      where.OR = [
        { username: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (role !== 'ALL') {
      where.role = role
    }

    if (status === 'BANNED') {
      where.isBanned = true
    } else if (status === 'SUSPENDED') {
      where.isSuspended = true
    } else if (status === 'ACTIVE') {
      where.isBanned = false
      where.isSuspended = false
    }

    if (verified === 'VERIFIED') {
      where.OR = [
        { emailVerified: true },
        { phoneVerified: true },
      ]
    } else if (verified === 'UNVERIFIED') {
      where.emailVerified = false
      where.phoneVerified = false
    }

    // Get total count
    const total = await prisma.user.count({ where })

    // Get users with pagination
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        role: true,
        isBanned: true,
        isSuspended: true,
        suspendedUntil: true,
        emailVerified: true,
        phoneVerified: true,
        createdAt: true,
        _count: {
          select: {
            contents: true,
            editorials: true,
          }
        }
      },
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * perPage,
      take: perPage,
    })

    return NextResponse.json({
      users,
      pagination: {
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      }
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}
