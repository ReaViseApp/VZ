import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { prisma } from '@/lib/prisma/client'
import { redirect } from 'next/navigation'
import MyVizGrid from '@/components/vizlet/MyVizGrid'

export default async function MyVizPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/auth/login')
  }

  // Fetch user's content
  const contents = await prisma.content.findMany({
    where: {
      userId: session.user.id,
      isApproved: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Viz</h1>
          <p className="text-gray-600">
            Select content to create a product listing on Viz.Let
          </p>
        </div>

        <MyVizGrid contents={contents} />
      </div>
    </div>
  )
}
