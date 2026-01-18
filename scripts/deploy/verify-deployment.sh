#!/bin/bash

# Verify Deployment Script
# Checks that all production requirements are met

set -e

echo "✅ Verifying Deployment Configuration"
echo "======================================"
echo ""

ERRORS=0

# Check for required files
echo "📁 Checking required files..."
FILES=(".env.production" "prisma/schema.prisma" "package.json")
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file missing"
        ((ERRORS++))
    fi
done

echo ""

# Check for required environment variables in .env.production
if [ -f .env.production ]; then
    echo "🔑 Checking environment variables..."
    VARS=("DATABASE_URL" "NEXTAUTH_URL" "NEXTAUTH_SECRET")
    for var in "${VARS[@]}"; do
        if grep -q "^$var=" .env.production; then
            echo "  ✅ $var"
        else
            echo "  ❌ $var missing"
            ((ERRORS++))
        fi
    done
else
    echo "❌ .env.production not found"
    ERRORS=$((ERRORS + 3))
fi

echo ""

# Check Node.js version
echo "📦 Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -ge 18 ]; then
    echo "  ✅ Node.js v$NODE_VERSION (required: v18+)"
else
    echo "  ❌ Node.js v$NODE_VERSION (required: v18+)"
    ((ERRORS++))
fi

echo ""

# Check if dependencies are installed
echo "📚 Checking dependencies..."
if [ -d "node_modules" ]; then
    echo "  ✅ node_modules exists"
else
    echo "  ⚠️  node_modules not found. Run: npm install"
    ((ERRORS++))
fi

echo ""

# Test database connection (if DATABASE_URL is set)
if [ -f .env.production ]; then
    export $(cat .env.production | grep DATABASE_URL | xargs)
    echo "🔍 Testing database connection..."
    if npx prisma db execute --stdin <<< "SELECT 1;" &> /dev/null; then
        echo "  ✅ Database connection successful"
    else
        echo "  ❌ Database connection failed"
        ((ERRORS++))
    fi
fi

echo ""
echo "======================================"
if [ $ERRORS -eq 0 ]; then
    echo "✅ All checks passed! Ready for deployment."
    exit 0
else
    echo "❌ Found $ERRORS error(s). Please fix before deploying."
    exit 1
fi
