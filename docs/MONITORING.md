# Monitoring & Alerting Guide

Complete guide for monitoring, error tracking, and alerting for the Viz. platform.

## Error Tracking (Sentry)

### Setup

1. **Create Sentry account**
   - Go to https://sentry.io
   - Create a new Next.js project

2. **Get your DSN**
   - Copy from project settings

3. **Add to environment variables**
   ```env
   SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
   NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
   ```

4. **Deploy**
   - Errors will automatically be tracked

### Usage

```typescript
import { captureError, captureMessage } from '@/lib/monitoring/error-handler';

// Capture errors
try {
  // risky operation
} catch (error) {
  captureError(error, {
    userId: user.id,
    action: 'create_product',
  });
}

// Capture messages
captureMessage('Important event occurred', 'info', {
  eventType: 'user_signup',
});
```

## Health Checks

### Endpoints

- **`/api/health`** - Detailed health status
- **`/healthz`** - Simple uptime check (for monitoring services)

### Health Check Response

```json
{
  "status": "healthy",
  "timestamp": "2026-01-18T10:00:00.000Z",
  "uptime": 86400,
  "checks": {
    "database": {
      "status": "pass",
      "responseTime": 45
    },
    "memory": {
      "status": "pass",
      "usage": 52428800,
      "limit": 134217728
    }
  }
}
```

## Database Backups

### Automated Backups

GitHub Actions runs daily backups at 2 AM UTC.

**Backup retention:** 30 days in GitHub Artifacts

### Manual Backup

```bash
# Create backup
bash scripts/backup/backup-database.sh

# Backups saved to: backups/viz_backup_YYYYMMDD_HHMMSS.sql.gz
```

### Restore from Backup

```bash
bash scripts/backup/restore-database.sh backups/viz_backup_20260118_020000.sql.gz
```

### Cloud Storage (Optional)

Upload backups to AWS S3:

```env
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_S3_BUCKET=viz-backups
AWS_REGION=us-east-1
```

## Alerts & Notifications

### Slack Integration

1. Create webhook: https://api.slack.com/apps
2. Add to environment:
   ```env
   SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx
   ```

### Discord Integration

1. Server Settings → Integrations → Webhooks → New Webhook
2. Add to environment:
   ```env
   DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/xxx
   ```

### Send Custom Alerts

```typescript
import { sendAlert, sendCriticalAlert } from '@/lib/monitoring/alerts';

// Send alert
await sendAlert({
  title: 'High Error Rate',
  message: 'Error rate exceeded threshold',
  severity: 'warning',
  timestamp: new Date().toISOString(),
  metadata: {
    errorCount: 50,
    threshold: 10,
  },
});

// Send critical alert
await sendCriticalAlert(
  'Database Connection Lost',
  'Unable to connect to production database',
  { attempts: 5 }
);
```

## Monitoring Dashboard

Access at: `/admin/monitoring`

Features:
- Overall system status
- Database connectivity
- Memory usage
- Response times
- Auto-refresh every 30 seconds

## Performance Monitoring

### Web Vitals

Automatically tracked and sent to Sentry:
- Largest Contentful Paint (LCP)
- First Input Delay (FID)
- Cumulative Layout Shift (CLS)

### Custom Performance Tracking

```typescript
import { measurePerformance, monitorQuery } from '@/lib/monitoring/performance';

// Track async operations
const result = await measurePerformance(
  'Complex Calculation',
  async () => {
    return await complexOperation();
  },
  2000 // threshold in ms
);

// Monitor database queries
const users = await monitorQuery(
  'fetch-all-users',
  () => prisma.user.findMany()
);
```

## Uptime Monitoring

### Recommended Services

**UptimeRobot** (Free tier available):
1. Go to https://uptimerobot.com
2. Add new monitor:
   - Type: HTTP(s)
   - URL: `https://your-app.vercel.app/healthz`
   - Interval: 5 minutes

**BetterUptime**:
- https://betteruptime.com
- More advanced alerting

**Pingdom**:
- https://pingdom.com
- Detailed performance metrics

## Troubleshooting

### Sentry not capturing errors

1. Check DSN is set correctly
2. Verify environment variables in Vercel
3. Check browser console for initialization errors

### Health check failing

1. Check database connection
2. Verify `DATABASE_URL` is correct
3. Check memory usage

### Alerts not sending

1. Verify webhook URLs are correct
2. Test webhooks manually
3. Check network connectivity

## Best Practices

1. **Monitor proactively** - Set up alerts before issues occur
2. **Regular backups** - Verify backup integrity monthly
3. **Review metrics** - Check dashboard weekly
4. **Update thresholds** - Adjust based on actual usage patterns
5. **Test recovery** - Practice restore procedures quarterly
