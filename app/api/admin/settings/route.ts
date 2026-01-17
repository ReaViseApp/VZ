import { NextResponse } from 'next/server'
import { requireAdmin, logAdminActivity } from '@/lib/admin/auth'
import { prisma } from '@/lib/prisma/client'

// GET /api/admin/settings - Get current site settings
export async function GET() {
  const admin = await requireAdmin()
  
  if (!admin) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  try {
    let settings = await prisma.siteSettings.findFirst()
    
    // If no settings exist, create default settings
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          id: 'default',
          siteName: 'Viz.',
          siteDescription: 'A creative community platform for quotable digital content',
        }
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

// PUT /api/admin/settings - Update site settings
export async function PUT(request: Request) {
  const admin = await requireAdmin()
  
  if (!admin) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  try {
    const body = await request.json()
    
    // Get current settings for comparison
    const currentSettings = await prisma.siteSettings.findFirst()
    
    // Update or create settings
    const settings = await prisma.siteSettings.upsert({
      where: { id: body.id || 'default' },
      update: {
        ...body,
        updatedBy: admin.id,
      },
      create: {
        id: 'default',
        ...body,
        updatedBy: admin.id,
      },
    })

    // Log the activity
    await logAdminActivity({
      userId: admin.id,
      action: 'SETTINGS_UPDATED',
      targetType: 'SETTINGS',
      targetId: settings.id,
      details: {
        before: currentSettings,
        after: settings,
        changes: body,
      },
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error updating site settings:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
