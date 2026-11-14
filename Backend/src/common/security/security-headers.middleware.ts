import { NextFunction, Request, Response } from 'express';

/**
 * Cabeceras de seguridad básicas (equivalente mínimo a helmet, sin dependencias).
 * `Cross-Origin-Resource-Policy: cross-origin` permite que el frontend
 * embeba las imágenes servidas desde /uploads.
 */
export function securityHeaders(
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  res.removeHeader('X-Powered-By');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-DNS-Prefetch-Control', 'off');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');

  if (process.env.NODE_ENV === 'production') {
    res.setHeader(
      'Strict-Transport-Security',
      'max-age=15552000; includeSubDomains',
    );
  }

  next();
}
