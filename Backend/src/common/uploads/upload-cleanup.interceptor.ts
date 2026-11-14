import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError, from, mergeMap, throwError } from 'rxjs';
import { removeUploadedFile } from './upload-cleanup';

/**
 * Si algo falla después de que Multer escribió el archivo (pipes, validaciones
 * del controller o el service), lo borra para no dejar huérfanos en disco.
 * Debe declararse después del `FileInterceptor` de la misma ruta.
 */
@Injectable()
export class UploadCleanupInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context
      .switchToHttp()
      .getRequest<{ file?: Express.Multer.File }>();

    return next.handle().pipe(
      catchError((error) =>
        from(removeUploadedFile(req.file)).pipe(
          mergeMap(() => throwError(() => error)),
        ),
      ),
    );
  }
}
