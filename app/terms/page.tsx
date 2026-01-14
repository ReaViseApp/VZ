import MainLayout from '@/components/MainLayout'

export default function TermsPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-4">
              By accessing and using Viz., you accept and agree to be bound by the terms and 
              provision of this agreement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Use License</h2>
            <p className="text-gray-700 mb-4">
              Permission is granted to temporarily use Viz. for personal, non-commercial use only.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Content</h2>
            <p className="text-gray-700 mb-4">
              Users are responsible for the content they post on Viz. You retain all rights to 
              your content, but grant Viz. a license to use, display, and distribute your content 
              on the platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Prohibited Uses</h2>
            <p className="text-gray-700 mb-4">
              You may not use Viz. for any illegal or unauthorized purpose. You must not violate 
              any laws in your jurisdiction.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Disclaimer</h2>
            <p className="text-gray-700 mb-4">
              The materials on Viz. are provided on an &apos;as is&apos; basis. Viz. makes no warranties, 
              expressed or implied.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Contact</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about these Terms of Service, please contact us.
            </p>
          </section>
        </div>
      </div>
    </MainLayout>
  )
}
