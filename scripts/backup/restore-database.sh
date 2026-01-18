#!/bin/bash

# Database Restore Script
# Restores database from a backup file

set -e

echo "♻️  Viz. Platform - Database Restore"
echo "===================================="
echo ""

if [ -z "$1" ]; then
    echo "Usage: $0 <backup_file.sql.gz>"
    echo ""
    echo "Available backups:"
    ls -lh backups/viz_backup_*.sql.gz 2>/dev/null || echo "No backups found"
    exit 1
fi

BACKUP_FILE="$1"

if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Backup file not found: $BACKUP_FILE"
    exit 1
fi

# Load DATABASE_URL
if [ -z "$DATABASE_URL" ]; then
    if [ -f .env.production ]; then
        export $(cat .env.production | grep DATABASE_URL | xargs)
    else
        echo "❌ DATABASE_URL not found"
        exit 1
    fi
fi

echo "⚠️  WARNING: This will replace all data in the database!"
echo "Database: ${DATABASE_URL:0:30}..."
echo "Backup file: $BACKUP_FILE"
echo ""
read -p "Are you sure you want to continue? (yes/no) " -r
echo ""

if [[ ! $REPLY =~ ^yes$ ]]; then
    echo "Restore cancelled."
    exit 0
fi

# Decompress if needed
if [[ $BACKUP_FILE == *.gz ]]; then
    echo "🗜️  Decompressing backup..."
    gunzip -c "$BACKUP_FILE" > /tmp/restore_temp.sql
    SQL_FILE="/tmp/restore_temp.sql"
else
    SQL_FILE="$BACKUP_FILE"
fi

echo "♻️  Restoring database..."
psql "$DATABASE_URL" < "$SQL_FILE"

# Cleanup temp file
if [ -f /tmp/restore_temp.sql ]; then
    rm /tmp/restore_temp.sql
fi

echo ""
echo "✅ Database restored successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Run migrations: npm run migrate:deploy"
echo "2. Verify data integrity"
echo "3. Test application functionality"
