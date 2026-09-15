// =============================================================================
// ApplyWise AI — HTTP Route Observability Wrapper
// Automatic Correlation ID injection, Prometheus metrics, and duration tracking
// =============================================================================

import {
  httpRequestsTotal,
  httpRequestDurationSeconds,
  httpErrorsTotal,
} from './metrics';
import { logger, getOrCreateCorrelationId } from './logger';

export function withObservability<T extends (req: Request, ...args: unknown[]) => Promise<Response>>(
  handler: T,
  routeName: string
): T {
  return (async (req: Request, ...args: unknown[]) => {
    const start = Date.now();
    const correlationId = getOrCreateCorrelationId(req.headers.get('x-correlation-id'));
    const method = req.method;

    try {
      const response = await handler(req, ...args);
      const durationSec = (Date.now() - start) / 1000;
      const status = String(response.status);

      httpRequestsTotal.inc({ method, route: routeName, status });
      httpRequestDurationSeconds.observe({ method, route: routeName, status }, durationSec);

      if (response.status >= 400) {
        httpErrorsTotal.inc({ route: routeName, error_type: response.status >= 500 ? '5xx' : '4xx' });
      }

      // Append correlation ID to response headers for distributed tracing
      response.headers.set('x-correlation-id', correlationId);
      return response;
    } catch (err) {
      const durationSec = (Date.now() - start) / 1000;
      httpRequestsTotal.inc({ method, route: routeName, status: '500' });
      httpRequestDurationSeconds.observe({ method, route: routeName, status: '500' }, durationSec);
      httpErrorsTotal.inc({ route: routeName, error_type: 'unhandled_exception' });

      logger.error('unhandled_http_error', `Unhandled exception in ${method} ${routeName}`, {
        correlationId,
        durationMs: Date.now() - start,
        metadata: { error: err instanceof Error ? err.message : String(err) },
      });
      throw err;
    }
  }) as T;
}
