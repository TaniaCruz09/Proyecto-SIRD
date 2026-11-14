import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ensureUploadDir } from './uploads-root';

/** Tipos de archivo permitidos para los documentos del expediente. */
export const DOCUMENT_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

export const DOCUMENT_MAX_SIZE = 5 * 1024 * 1024; // 5 MB

/** Guarda el documento en <UPLOADS_ROOT>/documentos/<carpeta> con nombre único. */
export const documentStorage = (folder: string) =>
  diskStorage({
    // La carpeta se resuelve por petición: al definir el decorador el `.env`
    // todavía no se ha cargado.
    destination: (_req, _file, cb) => cb(null, ensureUploadDir('documentos', folder)),
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + extname(file.originalname));
    },
  });

export const documentFileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!DOCUMENT_MIME_TYPES.includes(file.mimetype)) {
    return cb(
      new BadRequestException(
        'Tipo de archivo no permitido. Usa PDF, imágenes (JPG/PNG/WEBP) o documentos de Office.',
      ),
      false,
    );
  }

  cb(null, true);
};
