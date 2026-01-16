import MainLayout from '@/components/MainLayout'

export default function SavedPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Viz.List</h1>
          <p className="text-lg text-gray-600 mb-8">
            Your saved quotable content from the community
          </p>

          <div className="bg-white rounded-lg shadow-sm p-12 border border-gray-200 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                No Saved Content Yet
              </h2>
              <p className="text-gray-600 mb-6">
                Start exploring the community and save quotable regions from other users&apos; 
                content to build your Viz.List. You can use these in your editorials or reference them later.
              </p>
              <div className="text-sm text-gray-500">
                This feature will be implemented in a future update.
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
