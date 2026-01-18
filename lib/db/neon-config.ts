/**
 * Neon Database Configuration
 * Handles connection pooling and production database setup
 */

import { Pool, neonConfig } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '@prisma/client'
import ws from 'ws'

// Configure WebSocket for Neon in development
if (process.env.NODE_ENV !== 'production') {
  neonConfig.webSocketConstructor = ws
}

let prisma: PrismaClient

if (process.env.DATABASE_URL) {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const adapter = new PrismaNeon(pool)
  prisma = new PrismaClient({ adapter })
} else {
  prisma = new PrismaClient()
}

export default prisma
