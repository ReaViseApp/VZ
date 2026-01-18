#!/bin/bash

# Neon Database Setup Script
# This script helps set up a Neon PostgreSQL database for production

set -e

echo "🚀 Viz. Platform - Neon Database Setup"
echo "========================================"
echo ""

# Check if Neon CLI is installed
if ! command -v neonctl &> /dev/null; then
    echo "❌ Neon CLI not found. Installing..."
    npm install -g neonctl
fi

echo "📝 Please follow these steps:"
echo ""
echo "1. Go to https://neon.tech and sign up/login"
echo "2. Create a new project:"
echo "   - Project name: viz-production"
echo "   - Region: Choose closest to your users"
echo "   - PostgreSQL version: 16 (recommended)"
echo ""
echo "3. Copy your connection string from the Neon dashboard"
echo "   It should look like:"
echo "   postgresql://username:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require"
echo ""

read -p "Have you created your Neon project? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Please create a Neon project first, then run this script again."
    exit 1
fi

echo ""
read -p "Enter your Neon DATABASE_URL: " DATABASE_URL

if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL cannot be empty"
    exit 1
fi

# Validate connection string format
if [[ ! $DATABASE_URL =~ ^postgresql:// ]]; then
    echo "❌ Invalid DATABASE_URL format. Must start with postgresql://"
    exit 1
fi

# Create or update .env.production file
echo "📝 Creating .env.production file..."
cat > .env.production << EOF
# Production Environment Variables
# Generated on $(date)

DATABASE_URL="$DATABASE_URL"
NEXTAUTH_URL="https://your-app.vercel.app"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"

# Note: Update NEXTAUTH_URL with your actual Vercel deployment URL
EOF

echo "✅ .env.production file created!"
echo ""
echo "🔑 Generated new NEXTAUTH_SECRET"
echo ""

# Test database connection
echo "🔍 Testing database connection..."
if DATABASE_URL="$DATABASE_URL" npx prisma db execute --stdin <<< "SELECT 1;" &> /dev/null; then
    echo "✅ Database connection successful!"
else
    echo "❌ Database connection failed. Please check your connection string."
    exit 1
fi

echo ""
echo "📋 Next steps:"
echo "1. Run: npm run migrate:deploy (to apply database schema)"
echo "2. Run: npm run db:seed:production (optional - to create admin account)"
echo "3. Add these environment variables to Vercel:"
echo "   - Go to your Vercel project settings"
echo "   - Add the variables from .env.production"
echo ""
echo "✨ Neon database setup complete!"
