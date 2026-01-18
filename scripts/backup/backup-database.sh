#!/bin/bash

# Automated Database Backup Script
# Creates compressed PostgreSQL backups with timestamps

set -e

echo "💾 Viz. Platform - Database Backup"
echo "=================================="
echo ""

# Configuration
BACKUP_DIR="backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="viz_backup_${TIMESTAMP}.sql"
COMPRESSED_FILE="${BACKUP_FILE}.gz"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Load DATABASE_URL
if [ -z "$DATABASE_URL" ]; then
    if [ -f .env.production ]; then
        export $(cat .env.production | grep DATABASE_URL | xargs)
    else
        echo "❌ DATABASE_URL not found"
        exit 1
    fi
fi

echo "📊 Creating database backup..."
echo "Timestamp: $TIMESTAMP"
echo ""

# Create backup using pg_dump
if command -v pg_dump &> /dev/null; then
    pg_dump "$DATABASE_URL" > "$BACKUP_DIR/$BACKUP_FILE"
else
    echo "❌ pg_dump not found. Please install PostgreSQL client tools."
    exit 1
fi

# Compress backup
echo "🗜️  Compressing backup..."
gzip "$BACKUP_DIR/$BACKUP_FILE"

BACKUP_SIZE=$(du -h "$BACKUP_DIR/$COMPRESSED_FILE" | cut -f1)

echo ""
echo "✅ Backup completed successfully!"
echo "📁 File: $BACKUP_DIR/$COMPRESSED_FILE"
echo "📊 Size: $BACKUP_SIZE"
echo ""

# Optional: Upload to cloud storage (AWS S3 example)
if [ ! -z "$AWS_S3_BUCKET" ]; then
    echo "☁️  Uploading to AWS S3..."
    aws s3 cp "$BACKUP_DIR/$COMPRESSED_FILE" "s3://$AWS_S3_BUCKET/backups/$COMPRESSED_FILE"
    echo "✅ Uploaded to S3"
fi

# Cleanup old backups (keep last 30 days)
echo "🧹 Cleaning up old backups (keeping last 30 days)..."
find "$BACKUP_DIR" -name "viz_backup_*.sql.gz" -mtime +30 -delete

echo ""
echo "✨ Backup process complete!"
