import { captureMessage } from './error-handler';

export function measurePerformance<T>(
  operation: string,
  fn: () => Promise<T>,
  threshold: number = 1000
): Promise<T> {
  return new Promise(async (resolve, reject) => {
    const start = performance.now();
    
    try {
      const result = await fn();
      const duration = performance.now() - start;
      
      if (duration > threshold) {
        captureMessage(
          `Slow operation detected: ${operation}`,
          'warning',
          {
            operation,
            duration: `${duration.toFixed(2)}ms`,
            threshold: `${threshold}ms`,
          }
        );
      }
      
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

// Database query performance monitoring
export async function monitorQuery<T>(
  queryName: string,
  query: () => Promise<T>
): Promise<T> {
  return measurePerformance(`Database Query: ${queryName}`, query, 500);
}

// Web Vitals tracking
export function reportWebVitals(metric: any) {
  if (metric.label === 'web-vital') {
    // Log to analytics service
    console.log(metric);
    
    // Optionally send to Sentry
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      import('@sentry/nextjs').then((Sentry) => {
        Sentry.captureMessage(`Web Vital: ${metric.name}`, {
          level: 'info',
          contexts: {
            webVital: {
              name: metric.name,
              value: metric.value,
              rating: metric.rating,
            },
          },
        });
      });
    }
  }
}
