import { createHmac } from 'crypto';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { DataSource } from 'typeorm';

interface Limit {
  max: number;
  windowMs: number;
}

interface Rule {
  ip: Limit;
  account?: Limit;
}

interface BucketResult {
  hit_count: number;
  reset_at: Date | string;
}

const FIFTEEN_MINUTES = 15 * 60 * 1000;

const RULES: Record<string, Rule> = {
  login: {
    ip: { max: 120, windowMs: FIFTEEN_MINUTES },
    account: { max: 5, windowMs: FIFTEEN_MINUTES },
  },
  'select-role': { ip: { max: 30, windowMs: 60 * 1000 } },
  'switch-role': { ip: { max: 20, windowMs: 60 * 1000 } },
  refresh: { ip: { max: 60, windowMs: 60 * 1000 } },
  logout: { ip: { max: 60, windowMs: 60 * 1000 } },
  'request-reset': {
    ip: { max: 30, windowMs: FIFTEEN_MINUTES },
    account: { max: 5, windowMs: FIFTEEN_MINUTES },
  },
  'verify-code': {
    ip: { max: 20, windowMs: FIFTEEN_MINUTES },
    account: { max: 5, windowMs: FIFTEEN_MINUTES },
  },
  'reset-password': { ip: { max: 20, windowMs: FIFTEEN_MINUTES } },
};

const CLEANUP_EVERY = 1000;
let requestCount = 0;

function clientIp(req: Request): string {
  return req.ip ?? req.socket?.remoteAddress ?? 'unknown';
}

function accountIdentity(req: Request): string | undefined {
  const email = req.body?.email;
  return typeof email === 'string' ? email.trim().toLowerCase() : undefined;
}

function bucketKey(secret: string, value: string): string {
  return createHmac('sha256', secret).update(value).digest('hex');
}

async function consumeBucket(
  dataSource: DataSource,
  key: string,
  limit: Limit,
): Promise<BucketResult> {
  const [bucket] = (await dataSource.query(
    `
      insert into auth.rate_limit_buckets as current_bucket
        (bucket_key, hit_count, reset_at)
      values ($1, 1, now() + ($2::double precision * interval '1 millisecond'))
      on conflict (bucket_key) do update
      set hit_count = case
            when current_bucket.reset_at <= now() then 1
            else current_bucket.hit_count + 1
          end,
          reset_at = case
            when current_bucket.reset_at <= now()
              then now() + ($2::double precision * interval '1 millisecond')
            else current_bucket.reset_at
          end
      returning hit_count, reset_at
    `,
    [key, limit.windowMs],
  )) as BucketResult[];

  if (!bucket) throw new Error('No se pudo actualizar el contador de intentos');
  return bucket;
}

async function enforceLimit(
  req: Request,
  res: Response,
  dataSource: DataSource,
  secret: string,
  route: string,
  rule: Rule,
): Promise<boolean> {
  const dimensions = [
    { value: `ip:${clientIp(req)}`, limit: rule.ip },
  ];
  const identity = accountIdentity(req);
  if (rule.account && identity) {
    dimensions.push({ value: `account:${identity}`, limit: rule.account });
  }

  const buckets = await Promise.all(
    dimensions.map(({ value, limit }) =>
      consumeBucket(
        dataSource,
        bucketKey(secret, `${route}:${value}`),
        limit,
      ),
    ),
  );

  const exceeded = buckets.filter(
    (bucket, index) => bucket.hit_count > dimensions[index].limit.max,
  );
  if (exceeded.length) {
    const retryAfter = Math.max(
      1,
      ...exceeded.map((bucket) =>
        Math.ceil((new Date(bucket.reset_at).getTime() - Date.now()) / 1000),
      ),
    );
    res.setHeader('Retry-After', String(retryAfter));
    res.status(429).json({
      statusCode: 429,
      message: 'Demasiados intentos. Intenta de nuevo más tarde.',
    });
    return false;
  }

  requestCount += 1;
  if (requestCount % CLEANUP_EVERY === 0) {
    await dataSource.query(`
      delete from auth.rate_limit_buckets
      where reset_at < now() - interval '1 day'
    `);
    await dataSource.query(`
      delete from auth.auth_sessions
      where expires_at < now() - interval '1 day'
        or revoked_at < now() - interval '30 days'
    `);
  }

  return true;
}

export function authRateLimit(
  dataSource: DataSource,
  secret: string,
): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
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

    void enforceLimit(req, res, dataSource, secret, route, rule)
      .then((allowed) => {
        if (allowed && !res.headersSent) next();
      })
      .catch((error: unknown) => {
        console.error(
          'No se pudo validar el límite de autenticación:',
          error instanceof Error ? error.message : 'error desconocido',
        );
        if (!res.headersSent) {
          res.status(503).json({
            statusCode: 503,
            message: 'No se pudo validar la solicitud de autenticación',
          });
        }
      });
  };
}
