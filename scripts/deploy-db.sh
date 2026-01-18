#!/bin/bash
# Database Deployment Script for Viz.
# This script runs database migrations for production

set -e

echo "🚀 Starting database deployment..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ Error: DATABASE_URL environment variable is not set"
    echo "Please set it using: export DATABASE_URL='your-connection-string'"
    exit 1
fi

echo "✅ DATABASE_URL is set"

# Generate Prisma Client
echo "📦 Generating Prisma Client..."
npx prisma generate

# Run migrations
echo "🔄 Running database migrations..."
npx prisma migrate deploy

echo "✅ Database deployment completed successfully!"

# Optional: Seed the database (uncomment if needed)
# echo "🌱 Seeding database..."
# npx prisma db seed

echo "🎉 All done!"