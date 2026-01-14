import MainLayout from '@/components/MainLayout'

export default function ProfilePage({ params }: { params: { username: string } }) {
  const { username } = params

  return (
    <MainLayout>
      <div className="container mx-auto px-6 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200 mb-6">
          <div className="flex items-center gap-6">
            {/* Avatar Placeholder */}
            <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-3xl font-bold text-gray-600">
                {username.charAt(0).toUpperCase()}
              </span>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                @{username}
              </h1>
              <div className="flex gap-6 text-sm text-gray-600">
                <div>
                  <span className="font-semibold text-gray-900">0</span> Posts
                </div>
                <div>
                  <span className="font-semibold text-gray-900">0</span> Editorials
                </div>
                <div>
                  <span className="font-semibold text-gray-900">0</span> Followers
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div>
              <button className="px-6 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 transition-colors">
                Follow
              </button>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex gap-8 px-8 py-4">
              <button className="text-gray-900 font-medium border-b-2 border-gray-900 pb-2">
                Posts
              </button>
              <button className="text-gray-500 hover:text-gray-700 pb-2">
                Editorials
              </button>
            </nav>
          </div>

          {/* Content Grid */}
          <div className="p-8">
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No content yet</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
                {/* Placeholder grid items */}
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="bg-gray-100 rounded-lg aspect-square border border-gray-200"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
