// =============================================================================
// ApplyWise AI — Production Structured JSON Logger with Correlation IDs
// Non-PII logging, low-overhead, machine-readable format
// =============================================================================

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

export interface LogPayload {
  timestamp: string;
  level: LogLevel;
  service: string;
  environment: string;
  correlationId?: string;
  event: string;
  message: string;
  durationMs?: number;
  metadata?: Record<string, unknown>;
}

// Redact sensitive patterns (tokens, passwords, keys)
function sanitizeValue(key: string, value: unknown): unknown {
  const lowerKey = key.toLowerCase();
  if (
    lowerKey.includes('key') ||
    lowerKey.includes('token') ||
    lowerKey.includes('secret') ||
    lowerKey.includes('password') ||
    lowerKey.includes('auth')
  ) {
    return '***REDACTED***';
  }

  // Prevent unbounded strings (e.g., raw full CV text or prompts) from bloating logs
  if (typeof value === 'string' && value.length > 500) {
    return `${value.slice(0, 200)}... [TRUNCATED ${value.length} chars]`;
  }

  return value;
}

function sanitizeMetadata(metadata?: Record<string, unknown>): Record<string, unknown> | undefined {
  if (!metadata) return undefined;
  const sanitized: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(metadata)) {
    sanitized[k] = sanitizeValue(k, v);
  }
  return sanitized;
}

export class Logger {
  private serviceName = 'applywise-ai';
  private env = process.env.NODE_ENV || 'development';

  public log(level: LogLevel, event: string, message: string, options?: {
    correlationId?: string;
    durationMs?: number;
    metadata?: Record<string, unknown>;
  }) {
    const payload: LogPayload = {
      timestamp: new Date().toISOString(),
      level,
      service: this.serviceName,
      environment: this.env,
      correlationId: options?.correlationId,
      event,
      message,
      durationMs: options?.durationMs,
      metadata: sanitizeMetadata(options?.metadata),
    };

    const serialized = JSON.stringify(payload);

    if (level === 'ERROR') {
      console.error(serialized);
    } else if (level === 'WARN') {
      console.warn(serialized);
    } else {
      console.log(serialized);
    }
  }

  public debug(event: string, message: string, options?: { correlationId?: string; metadata?: Record<string, unknown> }) {
    this.log('DEBUG', event, message, options);
  }

  public info(event: string, message: string, options?: { correlationId?: string; durationMs?: number; metadata?: Record<string, unknown> }) {
    this.log('INFO', event, message, options);
  }

  public warn(event: string, message: string, options?: { correlationId?: string; metadata?: Record<string, unknown> }) {
    this.log('WARN', event, message, options);
  }

  public error(event: string, message: string, options?: { correlationId?: string; durationMs?: number; metadata?: Record<string, unknown> }) {
    this.log('ERROR', event, message, options);
  }
}

export const logger = new Logger();

// Helper to extract or generate correlation ID
export function getOrCreateCorrelationId(headerVal?: string | null): string {
  if (headerVal && headerVal.trim().length > 0) {
    return headerVal.trim();
  }
  return `req-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
}
