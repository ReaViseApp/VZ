# Viz. - Creative Community Platform

A creative community platform where users can create quotable digital content and publish editorials recommending other users' content.

## Overview

Viz. is a Next.js 14 web application that enables users to:
- Create and share quotable digital content (photos and videos)
- Use a lasso selector to designate quotable regions within content
- Request approval from content creators for using their quotable content
- Build editorials on a canvas to recommend other users' content
- Save favorite content to their Viz.List

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Form Validation**: React Hook Form + Zod
- **File Upload**: Support for images and videos (to be implemented)

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18.17 or higher)
- **npm** (v9 or higher)
- **PostgreSQL** (v14 or higher)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ReaViseApp/VZ.git
   cd VZ
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy the `.env.example` file to create your local `.env` file:
   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your configuration:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/viz_db?schema=public"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   ```

   To generate a secure `NEXTAUTH_SECRET`, run:
   ```bash
   openssl rand -base64 32
   ```

## Database Setup

### Installing PostgreSQL

**macOS (using Homebrew):**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
Download and install from [PostgreSQL official website](https://www.postgresql.org/download/windows/)

### Setting Up the Database

1. **Create a PostgreSQL database**
   ```bash
   createdb viz_db
   ```
   
   Or using psql:
   ```sql
   psql -U postgres
   CREATE DATABASE viz_db;
   \q
   ```

2. **Update your `.env` file** with the correct database credentials:
   ```env
   DATABASE_URL="postgresql://postgres:your_password@localhost:5432/viz_db?schema=public"
   ```

3. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

4. **Run database migrations**
   ```bash
   npx prisma migrate dev --name init
   ```
   
   This will:
   - Create all necessary tables (User, Content, Editorial, VizList, ApprovalRequest, etc.)
   - Set up NextAuth tables (Account, Session, VerificationToken)
   - Apply indexes for optimal query performance

5. **Optional: View your database with Prisma Studio**
   ```bash
   npx prisma studio
   ```
   
   This opens a visual database browser at [http://localhost:5555](http://localhost:5555)

### Troubleshooting Database Connection

If you encounter database connection errors:

1. **Check if PostgreSQL is running:**
   ```bash
   # macOS/Linux
   pg_isready
   
   # Or check the service status
   sudo systemctl status postgresql  # Linux
   brew services list  # macOS
   ```

2. **Verify database exists:**
   ```bash
   psql -U postgres -l
   ```

3. **Test connection:**
   ```bash
   psql -U postgres -d viz_db
   ```

4. **Check your DATABASE_URL format:**
   - Format: `postgresql://[user]:[password]@[host]:[port]/[database]?schema=public`
   - Default PostgreSQL port: 5432
   - Common users: `postgres` (default superuser)

5. **Reset database if needed:**
   ```bash
   npx prisma migrate reset
   ```
   
   ⚠️ This will delete all data and recreate the database schema.

## Running the Application

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

3. **Explore the application**
   - Home page with content feed placeholder
   - Sign up page at `/auth/signup`
   - Log in page at `/auth/login`
   - User profile page at `/profile/[username]`

## Project Structure

```
VZ/
├── app/                          # Next.js App Router pages
│   ├── api/                      # API routes
│   │   └── auth/                 # NextAuth.js authentication
│   ├── auth/                     # Authentication pages
│   │   ├── login/                # Login page
│   │   └── signup/               # Sign up page
│   ├── profile/                  # User profile pages
│   │   └── [username]/           # Dynamic profile route
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/                   # React components
│   ├── Header.tsx                # Top navigation header
│   ├── Sidebar.tsx               # Left sidebar navigation
│   └── MainLayout.tsx            # Main layout wrapper
├── lib/                          # Utility libraries
│   ├── auth/                     # Authentication utilities
│   └── prisma/                   # Prisma client
│       └── client.ts             # Prisma client instance
├── prisma/                       # Prisma ORM
│   └── schema.prisma             # Database schema
├── public/                       # Static assets
│   └── images/                   # Image assets
│       ├── logo.svg              # Viz. logo
│       ├── edit-icon.svg         # Edit/create icon
│       └── vizlist-icon.svg      # Viz.List icon
├── .env.example                  # Environment variables template
├── .gitignore                    # Git ignore rules
├── next.config.js                # Next.js configuration
├── package.json                  # NPM dependencies and scripts
├── postcss.config.js             # PostCSS configuration
├── tailwind.config.js            # Tailwind CSS configuration
└── tsconfig.json                 # TypeScript configuration
```

## Database Schema

### Models

- **User**: User accounts with authentication
- **Content**: Quotable digital content (photos/videos)
- **Editorial**: Editorial canvas pages
- **VizList**: Saved quotable content
- **ApprovalRequest**: Requests to use quotable content

For detailed schema information, see `prisma/schema.prisma`.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio
- `npx prisma migrate dev` - Create and apply migrations
- `npx prisma generate` - Generate Prisma Client

## Features

### Authentication System

#### User Registration
- ✅ Create account with email or phone number
- ✅ Username must be unique (minimum 3 characters)
- ✅ Password must be at least 8 characters
- ✅ Passwords securely hashed with bcrypt (10 rounds)
- ✅ Server-side validation and duplicate checking
- ✅ Client-side form validation with React Hook Form + Zod

#### User Login
- ✅ Login with email or phone + password
- ✅ JWT-based sessions (30-day expiry)
- ✅ Secure httpOnly cookies
- ✅ Session persists across page refreshes
- ✅ "Remember Me" functionality through JWT strategy

#### Session Management
- ✅ NextAuth.js integration throughout the app
- ✅ Protected routes require authentication
- ✅ Session data accessible in all components
- ✅ Automatic session refresh
- ✅ User menu with avatar in header
- ✅ Logout functionality

#### Protected Routes
The following routes require authentication:
- `/content/upload` - Upload new content
- `/content/create-quotable` - Create quotable regions
- `/editorial/create` - Create new editorial
- `/saved` - View Viz.List (saved content)
- `/approvals` - Manage approval requests

Unauthenticated users are redirected to `/auth/login`.

#### Security Features
- ✅ Password hashing with bcrypt (10+ rounds)
- ✅ No plain text passwords stored
- ✅ JWT token encryption with NEXTAUTH_SECRET
- ✅ Input sanitization and validation
- ✅ SQL injection protection via Prisma ORM
- ✅ Secure session cookies (httpOnly)

### Current Implementation

- ✅ Next.js 14 with App Router
- ✅ TypeScript with strict mode
- ✅ Tailwind CSS for styling
- ✅ Responsive layout (Header + Sidebar)
- ✅ **Full authentication system**
- ✅ **User registration and login**
- ✅ **Session management**
- ✅ **Protected routes with middleware**
- ✅ User profile page structure
- ✅ PostgreSQL database with Prisma ORM
- ✅ Database schema for all core models
- ✅ NextAuth.js configuration

### Coming Soon (Future PRs)

- 🔄 Email/phone verification system
- 🔄 Password reset functionality
- 🔄 Content creation with file upload
- 🔄 Lasso selector for quotable regions
- 🔄 Canvas editor for editorials
- 🔄 Approval workflow system
- 🔄 Feed and content discovery
- 🔄 User interactions (follow, like, comment)

## Design Principles

- **Clean & Modern**: Minimalist design suitable for creative content
- **Responsive**: Mobile-first approach, works on all devices
- **Accessible**: Semantic HTML and ARIA attributes
- **Consistent**: Unified color scheme and typography
- **User-Friendly**: Clear navigation and intuitive interactions

## Development Guidelines

### Authentication Patterns

**Accessing Current User in Components:**
```typescript
'use client'
import { useSession } from 'next-auth/react'

export default function MyComponent() {
  const { data: session, status } = useSession()
  
  if (status === 'loading') return <div>Loading...</div>
  if (!session) return <div>Please log in</div>
  
  return <div>Hello {session.user.username}!</div>
}
```

**Accessing Current User in API Routes:**
```typescript
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // Use session.user.id, session.user.email, etc.
}
```

**Accessing Current User in Server Components:**
```typescript
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export default async function MyPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/login')
  }
  
  return <div>Hello {session.user.username}!</div>
}
```

**Protecting Routes with Middleware:**

Add routes to the `matcher` array in `middleware.ts`:
```typescript
export const config = {
  matcher: [
    '/your-protected-route',
    '/another-protected-route',
  ],
}
```

### General Development Guidelines

- Use TypeScript strict mode
- Follow Next.js 14 App Router best practices
- Use server components where appropriate
- Implement proper error handling
- Add loading states for async operations
- Write clean, readable, and maintainable code

## Troubleshooting

### Authentication Issues

**Session not persisting:**
1. Check that `NEXTAUTH_SECRET` is set in `.env`
2. Clear browser cookies and try again
3. Verify `NEXTAUTH_URL` matches your development URL

**"Unauthorized" errors in API routes:**
1. Ensure you're passing `authOptions` to `getServerSession(authOptions)`
2. Check that the user is logged in
3. Verify the session contains user data

**Cannot access protected routes:**
1. Log in first at `/auth/login`
2. Check middleware configuration in `middleware.ts`
3. Verify the route is in the `matcher` array

### Database Connection Issues

If you encounter database connection errors:
1. Ensure PostgreSQL is running
2. Verify your `DATABASE_URL` in `.env`
3. Check database credentials and permissions

### Port Already in Use

If port 3000 is already in use:
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

### Prisma Client Issues

If Prisma Client is out of sync:
```bash
npx prisma generate
```

## Contributing

This is the foundation layer of the Viz. platform. Contributions will be managed through pull requests focusing on specific features.

## License

ISC

## Support

For questions or issues, please open an issue on GitHub.

---

**Note**: This is the foundation implementation. Core features like content upload, lasso selector, canvas editor, and approval workflows will be implemented in subsequent pull requests.