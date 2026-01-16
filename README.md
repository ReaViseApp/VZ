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

1. **Create a PostgreSQL database**
   ```bash
   createdb viz_db
   ```
   
   Or using psql:
   ```sql
   CREATE DATABASE viz_db;
   ```

2. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

3. **Run database migrations**
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Optional: Open Prisma Studio to view your database**
   ```bash
   npx prisma studio
   ```

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

### Current Implementation (Foundation)

- ✅ Next.js 14 with App Router
- ✅ TypeScript with strict mode
- ✅ Tailwind CSS for styling
- ✅ Responsive layout (Header + Sidebar)
- ✅ Authentication UI (Sign Up / Log In pages)
- ✅ User profile page structure
- ✅ PostgreSQL database with Prisma ORM
- ✅ Database schema for all core models
- ✅ NextAuth.js configuration

### Coming Soon (Future PRs)

- 🔄 Full authentication implementation
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

- Use TypeScript strict mode
- Follow Next.js 14 App Router best practices
- Use server components where appropriate
- Implement proper error handling
- Add loading states for async operations
- Write clean, readable, and maintainable code

## Troubleshooting

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