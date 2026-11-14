import { NextFunction, Request, Response } from 'express';

interface Rule {
  max: number;
  windowMs: number;
}

interface Bucket {
  count: number;
  resetAt: number;
}

const FIFTEEN_MINUTES = 15 * 60 * 1000;

/**
 * Límites por IP y por ruta de autenticación.
 * Se aplican en memoria (suficiente para una sola instancia).
 */
const RULES: Record<string, Rule> = {
  login: { max: 60, windowMs: 60 * 1000 },
  'select-role': { max: 60, windowMs: 60 * 1000 },
  refresh: { max: 120, windowMs: 60 * 1000 },
  logout: { max: 120, windowMs: 60 * 1000 },
  'request-reset': { max: 15, windowMs: FIFTEEN_MINUTES },
  'verify-code': { max: 20, windowMs: FIFTEEN_MINUTES },
  'reset-password': { max: 20, windowMs: FIFTEEN_MINUTES },
};

const MAX_BUCKETS = 5000;
const buckets = new Map<string, Bucket>();

function pruneBuckets(now: number): void {
  if (buckets.size < MAX_BUCKETS) return;

  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

function clientIp(req: Request): string {
  return req.ip ?? req.socket?.remoteAddress ?? 'unknown';
}

/**
 * Middleware de rate limiting para /auth/*.
 * Protege login y recuperación de contraseña contra fuerza bruta.
 */
export function authRateLimit(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  // Los preflight de CORS y HEAD no consumen cuota.
  const method = (req.method ?? 'GET').toUpperCase();
  if (method === 'OPTIONS' || method === 'HEAD') {
    next();
    return;
  }

  const route = (req.path ?? '')
    .replace(/^\/+/, '')
    .split('/')[0]
    .toLowerCase();

  const rule = RULES[route];
  if (!rule) {
    next();
    return;
  }

  const now = Date.now();
  pruneBuckets(now);

  const key = `${clientIp(req)}:${route}`;
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + rule.windowMs });
    next();
    return;
  }

  bucket.count += 1;

  if (bucket.count > rule.max) {
    const retryAfter = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
    res.setHeader('Retry-After', String(retryAfter));
    res.status(429).json({
      statusCode: 429,
      message: 'Demasiados intentos. Intenta de nuevo más tarde.',
    });
    return;
  }

  next();
}
