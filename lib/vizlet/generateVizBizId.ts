import { prisma } from '@/lib/prisma/client'

/**
 * Generate a unique 16-digit Viz.Biz ID for a shop
 * @returns {Promise<string>} A unique 16-digit numeric ID
 */
export async function generateVizBizId(): Promise<string> {
  let vizBizId: string
  let isUnique = false
  let attempts = 0
  const maxAttempts = 10

  while (!isUnique && attempts < maxAttempts) {
    // Generate a 16-digit random number
    // To ensure it's 16 digits, we generate a number between 1000000000000000 and 9999999999999999
    const min = 1000000000000000
    const max = 9999999999999999
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min
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
