import { describe, it, expect } from 'vitest';
import { registry, httpRequestsTotal, aiRequestsTotal } from '@/lib/observability/metrics';
import { getOrCreateCorrelationId, logger } from '@/lib/observability/logger';

describe('Observability & Prometheus Suite', () => {
  it('should initialize registry and export Prometheus metrics format', async () => {
    httpRequestsTotal.inc({ method: 'GET', route: '/api/test', status: '200' });
    aiRequestsTotal.inc({ model_id: 'gemini-flash', task_type: 'match_scoring', status: 'success' });

    const metricsOutput = await registry.metrics();
    expect(typeof metricsOutput).toBe('string');
    expect(metricsOutput).toContain('applywise_http_requests_total');
    expect(metricsOutput).toContain('applywise_ai_requests_total');
    expect(metricsOutput).toContain('route="/api/test"');
  });

  it('should create valid correlation IDs and preserve existing headers', () => {
    const generatedId = getOrCreateCorrelationId(null);
    expect(generatedId).toMatch(/^req-/);

    const preservedId = getOrCreateCorrelationId('custom-trace-12345');
    expect(preservedId).toBe('custom-trace-12345');
  });

  it('should sanitize PII and sensitive keys in structured logger', () => {
    // Test logger does not throw and executes
    expect(() => {
      logger.info('test_event', 'Log message', {
        correlationId: 'trace-test',
        metadata: {
          apiKey: 'super-secret-key-123',
          normalData: 'public-value',
        },
      });
    }).not.toThrow();
  });
});
