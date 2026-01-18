#!/bin/bash

# Schedule automatic backups using cron
# Runs daily at 2 AM

set -e

echo "⏰ Setting up automated backup schedule"
echo "======================================="
echo ""

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKUP_SCRIPT="$SCRIPT_DIR/backup-database.sh"

# Create cron job
CRON_JOB="0 2 * * * cd $(pwd) && bash $BACKUP_SCRIPT >> logs/backup.log 2>&1"

# Check if cron job already exists
if crontab -l 2>/dev/null | grep -q "backup-database.sh"; then
    echo "⚠️  Backup cron job already exists"
    echo ""
    echo "Current cron jobs:"
    crontab -l | grep backup-database.sh
    exit 0
fi

# Add cron job
(crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -

echo "✅ Backup scheduled successfully!"
echo ""
echo "Schedule: Daily at 2:00 AM"
echo "Logs: logs/backup.log"
echo ""
echo "To view scheduled jobs: crontab -l"
echo "To remove schedule: crontab -e (then delete the backup line)"
