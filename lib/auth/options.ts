import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma/client'

// Helper to detect if input is email or phone
function isEmail(input: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(input)
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        emailOrPhone: { label: 'Email or Phone', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.emailOrPhone || !credentials?.password) {
          throw new Error('Email/phone and password are required')
        }

        // Determine if input is email or phone
        const isEmailInput = isEmail(credentials.emailOrPhone)

        // Find user by email or phone
        const user = await prisma.user.findFirst({
          where: isEmailInput
            ? { email: credentials.emailOrPhone }
            : { phone: credentials.emailOrPhone },
        })

        if (!user) {
          throw new Error('No user found with this email or phone number')
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          throw new Error('Invalid password')
        }

        // Return user object (without password)
        return {
          id: user.id,
          email: user.email,
          name: user.username,
          username: user.username,
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      // Add user info to token on sign in
      if (user) {
        token.id = user.id
        token.username = user.username
        token.email = user.email || ''
      }
      return token
    },
    async session({ session, token }) {
      // Add user info to session
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.username = token.username as string
        session.user.email = token.email as string || ''
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
