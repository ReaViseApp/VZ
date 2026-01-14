import MainLayout from '@/components/MainLayout'

export default function Home() {
  return (
    <MainLayout>
      <div className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Viz.
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A creative community platform where you can create quotable digital content 
            and publish editorials recommending other users&apos; content.
          </p>
        </div>

        {/* Main Feed Section */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Content Feed
            </h2>
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">
                No content yet. Start creating or exploring!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                {/* Placeholder cards */}
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-gray-100 rounded-lg p-6 border border-gray-200"
                  >
                    <div className="w-full h-48 bg-gray-200 rounded-md mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
