'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import MainLayout from '@/components/MainLayout'

const signUpSchema = z.object({
  emailOrPhone: z.string().min(1, 'Email or phone number is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Please confirm your password'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the Terms of Service and Privacy Policy',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type SignUpFormData = z.infer<typeof signUpSchema>

export default function SignUpPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  })

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      // TODO: Implement actual signup logic
      console.log('Sign up data:', data)
      
      // Placeholder: Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      // Redirect to login page after successful signup
      router.push('/auth/login?registered=true')
    } catch (err) {
      setError('An error occurred during sign up. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <MainLayout>
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Create An Account
            </h1>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email or Phone */}
              <div>
                <label
                  htmlFor="emailOrPhone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address or Mobile Phone Number
                </label>
                <input
                  {...register('emailOrPhone')}
                  type="text"
                  id="emailOrPhone"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="email@example.com or +1234567890"
                />
                {errors.emailOrPhone && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.emailOrPhone.message}
                  </p>
                )}
              </div>

              {/* Username */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Username
                </label>
                <input
                  {...register('username')}
                  type="text"
                  id="username"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="username"
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  {...register('password')}
                  type="password"
                  id="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm Password
                </label>
                <input
                  {...register('confirmPassword')}
                  type="password"
                  id="confirmPassword"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="••••••••"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    {...register('acceptTerms')}
                    id="acceptTerms"
                    type="checkbox"
                    className="w-4 h-4 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="acceptTerms" className="text-gray-700">
                    I have read and accept the{' '}
                    <Link
                      href="/terms"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link
                      href="/privacy"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                  {errors.acceptTerms && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.acceptTerms.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-2 text-white bg-gray-900 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            {/* Login Link */}
            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                href="/auth/login"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
