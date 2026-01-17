import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create default admin user
  const hashedPassword = await bcrypt.hash('AdminViz2026!', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@viz.app' },
    update: {},
    create: {
      email: 'admin@viz.app',
      username: 'vizadmin',
      password: hashedPassword,
      role: 'ADMIN',
      emailVerified: true,
    }
  })
  
  console.log('✅ Admin user created:')
  console.log('   📧 Email: admin@viz.app')
  console.log('   👤 Username: vizadmin')
  console.log('   🔑 Password: AdminViz2026!')
  console.log('   🛡️  Role: ADMIN')
  console.log('   ⚠️  IMPORTANT: Change the password after first login!')
  console.log('')

  // Create default site settings
  const settings = await prisma.siteSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      siteName: 'Viz.',
      siteDescription: 'A creative community platform for quotable digital content',
      seoTitle: 'Viz. - Creative Community Platform',
      seoDescription: 'Create, share, and discover quotable digital content in a vibrant creative community.',
      seoKeywords: ['creative', 'community', 'content', 'editorial', 'quotable', 'visual'],
      primaryColor: '#1a1a1a',
      secondaryColor: '#f5f5f5',
      accentColor: '#007bff',
      fontColor: '#000000',
      fontFamily: 'system',
      fontSize: 'base',
      sidebarPosition: 'left',
      headerStyle: 'default',
      vizListLayout: 'grid',
      profileLayout: 'tabs',
      feedLayout: 'cards',
      enableComments: true,
      enableLikes: true,
      enableSharing: true,
      requireApproval: false,
    }
  })
  
  console.log('✅ Default site settings created')
  console.log('')
  console.log('🎉 Seed completed successfully!')
  console.log('')
  console.log('📝 Next steps:')
  console.log('   1. Log in at /auth/login with the admin credentials above')
  console.log('   2. Navigate to /admin to access the admin panel')
  console.log('   3. Change the admin password immediately')
  console.log('')
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
