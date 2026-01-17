'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import type { PaymentMethod } from '@/types/vizlet'

export default function PaymentSettingsPage() {
  const router = useRouter()
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    type: 'credit_card',
    lastFourDigits: '',
    expiryMonth: '',
    expiryYear: '',
    cardholderName: '',
    isDefault: false,
  })

  useEffect(() => {
    fetchPaymentMethods()
  }, [])

  const fetchPaymentMethods = async () => {
    try {
      const res = await fetch('/api/vizlet/settings/payment')
      if (!res.ok) throw new Error('Failed to fetch payment methods')
      const data = await res.json()
      setPaymentMethods(data.paymentMethods)
    } catch (error) {
      toast.error('Failed to load payment methods')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const res = await fetch('/api/vizlet/settings/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          expiryMonth: formData.expiryMonth ? parseInt(formData.expiryMonth) : undefined,
          expiryYear: formData.expiryYear ? parseInt(formData.expiryYear) : undefined,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to add payment method')
      }

      toast.success('Payment method added successfully')
      setShowForm(false)
      setFormData({
        type: 'credit_card',
        lastFourDigits: '',
        expiryMonth: '',
        expiryYear: '',
        cardholderName: '',
        isDefault: false,
      })
      fetchPaymentMethods()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add payment method')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Payment Methods</h1>
            <p className="text-gray-600">Manage your payment methods</p>
          </div>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            ← Back
          </button>
        </div>

        {/* Add Payment Method Button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="mb-6 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Add New Payment Method
          </button>
        )}

        {/* Add Payment Method Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add Payment Method</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
                >
                  <option value="credit_card">Credit Card</option>
                  <option value="debit_card">Debit Card</option>
                  <option value="paypal">PayPal</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>

              {(formData.type === 'credit_card' || formData.type === 'debit_card') && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cardholder Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.cardholderName}
                      onChange={(e) => setFormData({ ...formData, cardholderName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last 4 Digits *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={4}
                      pattern="[0-9]{4}"
                      value={formData.lastFourDigits}
                      onChange={(e) => setFormData({ ...formData, lastFourDigits: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
                      placeholder="1234"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Month *
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        max="12"
                        value={formData.expiryMonth}
                        onChange={(e) => setFormData({ ...formData, expiryMonth: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
                        placeholder="MM"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Year *
                      </label>
                      <input
                        type="number"
                        required
                        min={new Date().getFullYear()}
                        value={formData.expiryYear}
                        onChange={(e) => setFormData({ ...formData, expiryYear: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
                        placeholder="YYYY"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                    className="mr-2 h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Set as default payment method</span>
                </label>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                >
                  Add Payment Method
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Payment Methods List */}
        <div className="space-y-4">
          {paymentMethods.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center">
              <p className="text-gray-500">No payment methods added yet</p>
            </div>
          ) : (
            paymentMethods.map((method) => (
              <div
                key={method.id}
                className="bg-white rounded-lg shadow-sm p-6 relative"
              >
                {method.isDefault && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-gray-900 text-white text-xs rounded-full">
                    Default
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    {method.type === 'credit_card' || method.type === 'debit_card' ? (
                      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 capitalize">
                      {method.type.replace('_', ' ')}
                    </h3>
                    {method.lastFourDigits && (
                      <p className="text-gray-600 text-sm">
                        •••• {method.lastFourDigits}
                      </p>
                    )}
                    {method.expiryMonth && method.expiryYear && (
                      <p className="text-gray-600 text-sm">
                        Expires {method.expiryMonth}/{method.expiryYear}
                      </p>
                    )}
                    {method.cardholderName && (
                      <p className="text-gray-600 text-sm">{method.cardholderName}</p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
