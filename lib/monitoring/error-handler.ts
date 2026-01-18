import * as Sentry from "@sentry/nextjs";

export interface ErrorContext {
  userId?: string;
  username?: string;
  path?: string;
  action?: string;
  [key: string]: any;
}

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public context?: ErrorContext
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function captureError(
  error: Error,
  context?: ErrorContext
) {
  console.error('Error captured:', error, context);
  
  Sentry.captureException(error, {
    contexts: {
      custom: context,
    },
  });
}

export function captureMessage(
  message: string,
  level: 'info' | 'warning' | 'error' = 'info',
  context?: ErrorContext
) {
  Sentry.captureMessage(message, {
    level,
    contexts: {
      custom: context,
    },
  });
}

// API route error wrapper
export function withErrorHandler<T>(
  handler: (req: Request) => Promise<T>
) {
  return async (req: Request) => {
    try {
      return await handler(req);
    } catch (error) {
      if (error instanceof AppError) {
        captureError(error, error.context);
        return Response.json(
          { error: error.message },
          { status: error.statusCode }
        );
      }
      
      captureError(error as Error);
      return Response.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}
