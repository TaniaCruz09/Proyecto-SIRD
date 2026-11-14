import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

const SERVER_ERROR_MESSAGE = 'Error interno del servidor';
const CLIENT_ERROR_MESSAGE = 'No se pudo procesar la solicitud';
const DUPLICATE_MESSAGE = 'Ya existe un registro con esos datos';

// Detalles de base de datos que nunca deben salir en la respuesta HTTP.
const DATABASE_DETAIL_PATTERNS: RegExp[] = [
  /\bselect\b[\s\S]*\bfrom\b/i,
  /\binsert\s+into\b/i,
  /\bupdate\s+[\w."]+\s+set\b/i,
  /\bdelete\s+from\b/i,
  /\bsyntax error at or near\b/i,
  /\bduplicate key value violates\b/i,
  /\bviolates\b[\s\S]*\bconstraint\b/i,
  /\bnull value in column\b/i,
  /\brelation\s+"[^"]+"\s+does not exist\b/i,
  /\bcolumn\s+"[^"]+"\s+does not exist\b/i,
  /\bER_[A-Z_]+\b/,
];

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const violacionUnica = this.isUniqueViolation(exception);
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : violacionUnica
          ? HttpStatus.CONFLICT
          : HttpStatus.INTERNAL_SERVER_ERROR;
    const path = request?.originalUrl ?? request?.url ?? '';
    const method = request?.method ?? 'HTTP';
    const message = this.resolveMessage(exception, status, violacionUnica);
    const detail = this.describe(exception);

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      const rootError = this.innerError(exception) ?? (exception instanceof Error ? exception : undefined);
      this.logger.error(
        `${method} ${path} -> ${status}: ${detail}`,
        rootError?.stack,
      );
    } else {
      this.logger.warn(`${method} ${path} -> ${status}: ${detail}`);
    }

    if (response.headersSent) return;

    response.status(status).json({
      statusCode: status,
      message,
      path,
      timestamp: new Date().toISOString(),
    });
  }

  private resolveMessage(
    exception: unknown,
    status: number,
    violacionUnica = false,
  ): string | string[] {
    const fallback =
      status >= HttpStatus.INTERNAL_SERVER_ERROR
        ? SERVER_ERROR_MESSAGE
        : CLIENT_ERROR_MESSAGE;

    // Unicidad: el motor de base de datos ya validó el duplicado.
    if (violacionUnica && !(exception instanceof HttpException)) {
      return DUPLICATE_MESSAGE;
    }

    // Los errores no controlados (TypeORM, red, etc.) nunca exponen detalles.
    if (!(exception instanceof HttpException)) return fallback;

    // Cualquier 5xx se responde con un mensaje genérico.
    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) return SERVER_ERROR_MESSAGE;

    const payload = exception.getResponse();
    const raw =
      typeof payload === 'string'
        ? payload
        : ((payload as { message?: unknown } | null)?.message ??
          exception.message);

    const messages = (Array.isArray(raw) ? raw : [raw])
      .filter((item): item is string => typeof item === 'string')
      .map((item) => item.trim())
      .filter(Boolean);

    if (!messages.length) return fallback;

    const safeMessages = messages.map((item) =>
      this.leaksDatabaseDetails(item) ? fallback : item,
    );

    return Array.isArray(raw) ? safeMessages : safeMessages[0];
  }

  /** Violación de restricción única / llave duplicada en PostgreSQL. */
  private isUniqueViolation(exception: unknown): boolean {
    const error = exception as
      | { code?: string; driverError?: { code?: string } }
      | undefined;
    return error?.code === '23505' || error?.driverError?.code === '23505';
  }

  private leaksDatabaseDetails(message: string): boolean {
    return DATABASE_DETAIL_PATTERNS.some((pattern) => pattern.test(message));
  }

  /**
   * Error original cuando el código lo envuelve dentro de una HttpException
   * (por ejemplo `new InternalServerErrorException(error)`).
   */
  private innerError(exception: unknown): Error | undefined {
    if (!(exception instanceof HttpException)) return undefined;

    const payload = exception.getResponse();
    const fromPayload =
      typeof payload === 'object' && payload !== null
        ? (payload as { message?: unknown }).message
        : undefined;
    if (fromPayload instanceof Error) return fromPayload;

    const cause = (exception as { cause?: unknown }).cause;
    return cause instanceof Error ? cause : undefined;
  }

  private describe(exception: unknown): string {
    if (exception instanceof HttpException) {
      const payload = exception.getResponse();
      const detail =
        typeof payload === 'string'
          ? payload
          : JSON.stringify(payload, (_key, value) =>
              value instanceof Error
                ? `${value.name}: ${value.message}`
                : value,
            );
      return `${exception.name}: ${detail}`;
    }

    if (exception instanceof Error) {
      return `${exception.name}: ${exception.message}`;
    }

    return String(exception);
  }
}
