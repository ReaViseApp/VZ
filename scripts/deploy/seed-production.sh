#!/bin/bash

# Seed Production Database
# Creates initial admin account and sample data

set -e

echo "🌱 Seeding Production Database"
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

# Confirm before seeding
echo "⚠️  This will create/update data in production database."
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Seeding cancelled."
    exit 0
fi

echo ""
echo "🌱 Running seed script..."
npx prisma db seed

echo ""
echo "✅ Database seeded successfully!"
echo ""
echo "📋 Admin Account Credentials:"
echo "   Email: admin@viz.app"
echo "   Username: vizadmin"
echo "   Password: AdminViz2026!"
echo ""
echo "⚠️  IMPORTANT: Change the admin password immediately after first login!"
