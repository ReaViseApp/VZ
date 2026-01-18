# Deployment Guide

Complete guide for deploying the Viz. platform to production.

## Quick Start

### 1. Set Up Neon Database
```bash
npm run setup:neon
```

Follow the prompts to configure your Neon PostgreSQL database.

### 2. Run Migrations
```bash
npm run migrate:deploy
```

### 3. Seed Database (Optional)
```bash
npm run db:seed:production
```

Creates default admin account:
- Email: admin@viz.app
- Username: vizadmin
- Password: AdminViz2026!

⚠️ Change password after first login!

### 4. Verify Configuration
```bash
npm run verify:deployment
```

## Vercel Deployment

### Initial Setup

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Link project**
```bash
vercel link
```

4. **Add environment variables to Vercel**

Go to your Vercel project dashboard → Settings → Environment Variables

Add these variables:
- `DATABASE_URL` - Your Neon connection string
- `NEXTAUTH_URL` - Your production URL (e.g., https://viz.vercel.app)
- `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`

5. **Deploy**
```bash
vercel --prod
```

### Automated Deployments (GitHub Actions)

Once GitHub Actions is configured, deployments happen automatically:

- **Push to `main`** → Production deployment
- **Open PR** → Preview deployment (using Vercel GitHub Action)

#### Required GitHub Secrets

Add these secrets to your GitHub repository:
(Settings → Secrets and variables → Actions → New repository secret)

1. **VERCEL_TOKEN**
   - Get from: https://vercel.com/account/tokens
   - Create new token with appropriate scope
   - Required for both production and preview deployments

2. **VERCEL_ORG_ID**
   - Found in `.vercel/project.json` after running `vercel link`
   - Or get from your Vercel project settings
   - Required for both production and preview deployments

3. **VERCEL_PROJECT_ID**
   - Found in `.vercel/project.json` after running `vercel link`
   - Or get from your Vercel project settings
   - Required for both production and preview deployments

4. **DATABASE_URL**
   - Your Neon PostgreSQL connection string
   - Required for production deployment

5. **VERCEL_DOMAIN**
   - Your production domain (e.g., viz-app.vercel.app)
   - Required for production deployment health checks

#### How to Get Vercel IDs

**Option 1: Using Vercel CLI**
```bash
vercel link
cat .vercel/project.json
```

**Option 2: From Vercel Dashboard**
1. Go to your project settings on Vercel
2. Navigate to the "General" tab
3. Find "Project ID" and "Team ID" (if using a team)

## Deployment Scripts

### `npm run setup:neon`
Interactive setup wizard for Neon database configuration.

### `npm run migrate:deploy`
Applies all pending database migrations to production.

### `npm run db:seed:production`
Seeds production database with initial data (admin account).

### `npm run verify:deployment`
Checks that all deployment requirements are met.

### `npm run deploy:prepare`
Verifies configuration and builds the project.

## Manual Deployment Steps

If you prefer manual deployment:

1. **Set environment variables**
```bash
export DATABASE_URL="your-neon-url"
export NEXTAUTH_URL="https://your-domain.vercel.app"
export NEXTAUTH_SECRET="your-secret"
```

2. **Run migrations**
```bash
npx prisma migrate deploy
```

3. **Build project**
```bash
npm run build
```

4. **Deploy to Vercel**
```bash
vercel --prod
```

## Troubleshooting

### Database Connection Issues

**Error: "Can't reach database server"**
- Ensure `?sslmode=require` is in your DATABASE_URL
- Check Neon project is active
- Verify IP allowlist settings in Neon

### Build Failures

**Error: "Prisma Client not generated"**
- Run: `npx prisma generate`
- Check `postinstall` script in package.json

### Migration Issues

**Error: "Migration failed to apply"**
- Check migration files in `prisma/migrations/`
- Verify database schema compatibility
- Run: `npx prisma migrate status`

## Rollback

If deployment fails, rollback to previous version:

1. **In Vercel Dashboard**
   - Go to Deployments
   - Find last successful deployment
   - Click "..." → "Promote to Production"

2. **Database rollback**
   - Neon provides point-in-time recovery
   - Go to Neon dashboard → Branches → Restore

## Monitoring

- **Vercel Analytics**: Automatic in Vercel dashboard
- **Error tracking**: Check Vercel logs
- **Database metrics**: Neon dashboard

## Support

For issues:
1. Check logs in Vercel dashboard
2. Review GitHub Actions workflow runs
3. Check Neon database status
4. Open issue on GitHub repository
