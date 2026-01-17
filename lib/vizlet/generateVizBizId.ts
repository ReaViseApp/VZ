import { prisma } from '@/lib/prisma/client'

const MIN_VIZ_BIZ_ID = 1000000000000000
const MAX_VIZ_BIZ_ID = 9999999999999999
const MAX_GENERATION_ATTEMPTS = 10

/**
 * Generate a unique 16-digit Viz.Biz ID for a shop
 * @returns {Promise<string>} A unique 16-digit numeric ID
 */
export async function generateVizBizId(): Promise<string> {
  let vizBizId: string
  let isUnique = false
  let attempts = 0

  while (!isUnique && attempts < MAX_GENERATION_ATTEMPTS) {
    // Generate a 16-digit random number
    const randomNum = Math.floor(Math.random() * (MAX_VIZ_BIZ_ID - MIN_VIZ_BIZ_ID + 1)) + MIN_VIZ_BIZ_ID
    vizBizId = randomNum.toString()

    // Check if this ID already exists
    const existing = await prisma.vizLetShop.findUnique({
      where: { vizBizId },
    })

    if (!existing) {
      isUnique = true
      return vizBizId
    }

    attempts++
  }

  // If we couldn't generate a unique ID after max attempts, throw an error
  throw new Error('Failed to generate unique Viz.Biz ID after maximum attempts')
}
