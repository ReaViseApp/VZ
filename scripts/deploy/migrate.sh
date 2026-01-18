#!/bin/bash

# Database Migration Script for Production
# Safely applies database migrations to production database

set -e

echo "🔄 Running Database Migrations"
echo "=============================="
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    if [ -f .env.production ]; then
        echo "📝 Loading DATABASE_URL from .env.production..."
        export $(cat .env.production | grep DATABASE_URL | xargs)
    else
        echo "❌ DATABASE_URL not found. Please run: npm run setup:neon"
        exit 1
    fi
fi

# Confirm before running migrations
echo "⚠️  You are about to run migrations on the production database."
echo "Database: ${DATABASE_URL:0:30}..."
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Migration cancelled."
    exit 0
fi

echo ""
echo "📊 Checking migration status..."
npx prisma migrate status

echo ""
echo "🚀 Applying migrations..."
npx prisma migrate deploy

echo ""
echo "🔄 Generating Prisma Client..."
npx prisma generate

echo ""
echo "✅ Migrations completed successfully!"
echo ""
echo "📋 Migration status:"
npx prisma migrate status
