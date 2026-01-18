import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';

export const dynamic = 'force-dynamic';

interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  checks: {
    database: {
      status: 'pass' | 'fail';
      responseTime?: number;
      error?: string;
    };
    memory: {
      status: 'pass' | 'warn' | 'fail';
      usage: number;
      limit: number;
    };
  };
}

export async function GET() {
  const startTime = Date.now();
  const checks: HealthCheckResult['checks'] = {
    database: { status: 'fail' },
    memory: { status: 'pass', usage: 0, limit: 0 },
  };

  // Database check
  try {
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const dbResponseTime = Date.now() - dbStart;
    
    checks.database = {
      status: dbResponseTime < 1000 ? 'pass' : 'fail',
      responseTime: dbResponseTime,
    };
  } catch (error) {
    checks.database = {
      status: 'fail',
      error: (error as Error).message,
    };
  }

  // Memory check
  const memUsage = process.memoryUsage();
  const memUsagePercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;
  
  checks.memory = {
    status: memUsagePercent > 90 ? 'fail' : memUsagePercent > 75 ? 'warn' : 'pass',
    usage: memUsage.heapUsed,
    limit: memUsage.heapTotal,
  };

  // Determine overall status
  let status: HealthCheckResult['status'] = 'healthy';
  if (checks.database.status === 'fail') {
    status = 'unhealthy';
  } else if (checks.memory.status === 'warn') {
    status = 'degraded';
  }

  const result: HealthCheckResult = {
    status,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks,
  };

  const statusCode = status === 'healthy' ? 200 : status === 'degraded' ? 200 : 503;

  return NextResponse.json(result, { status: statusCode });
}
