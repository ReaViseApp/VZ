'use client'

interface VizLetOptionModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  contentId: string
}

export default function VizLetOptionModal({
  isOpen,
  onClose,
  onConfirm,
  contentId,
}: VizLetOptionModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          Viz.Let?
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          Would you like to create a product listing from this content?
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Not Now
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  )
}
