import MainLayout from '@/components/MainLayout'

export default function ApprovalsPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Stamp</h1>
          <p className="text-lg text-gray-600 mb-8">
            Manage approval requests for your quotable content
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
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                No Approval Requests Yet
              </h2>
              <p className="text-gray-600 mb-6">
                When other users request to use quotable regions from your content, 
                you&apos;ll see approval notifications here. You can approve or reject each request.
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
