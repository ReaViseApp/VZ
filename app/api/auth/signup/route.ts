import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma/client'
import { z } from 'zod'

// Validation schema for signup
const signupSchema = z.object({
  emailOrPhone: z.string().min(1, 'Email or phone number is required'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

// Helper to detect if input is email or phone
function isEmail(input: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(input)
}

function isPhone(input: string): boolean {
  // Simple phone validation (starts with + and has digits)
  const phoneRegex = /^\+?[1-9]\d{1,14}$/
  return phoneRegex.test(input.replace(/[\s-]/g, ''))
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validation = signupSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const { emailOrPhone, username, password } = validation.data

    // Determine if input is email or phone
    const isEmailInput = isEmail(emailOrPhone)
    const isPhoneInput = isPhone(emailOrPhone)

    if (!isEmailInput && !isPhoneInput) {
      return NextResponse.json(
        { error: 'Please provide a valid email address or phone number' },
        { status: 400 }
      )
    }

    // Check for existing user with same username
    const existingUsername = await prisma.user.findUnique({
      where: { username },
    })

    if (existingUsername) {
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 409 }
      )
    }

    // Check for existing user with same email or phone
    if (isEmailInput) {
      const existingEmail = await prisma.user.findUnique({
        where: { email: emailOrPhone },
      })
      if (existingEmail) {
        return NextResponse.json(
          { error: 'Email already registered' },
          { status: 409 }
        )
      }
    }

    if (isPhoneInput) {
      const existingPhone = await prisma.user.findUnique({
        where: { phone: emailOrPhone },
      })
      if (existingPhone) {
        return NextResponse.json(
          { error: 'Phone number already registered' },
          { status: 409 }
        )
      }
    }

    // Hash password with bcrypt (10 rounds minimum)
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const user = await prisma.user.create({
      data: {
        username,
        email: isEmailInput ? emailOrPhone : null,
        phone: isPhoneInput ? emailOrPhone : null,
        password: hashedPassword,
        emailVerified: false,
        phoneVerified: false,
      },
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        createdAt: true,
      },
    })

    return NextResponse.json(
      {
        message: 'Account created successfully',
        user,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'An error occurred during sign up. Please try again.' },
      { status: 500 }
    )
  }
}
