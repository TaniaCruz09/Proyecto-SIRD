import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ensureUploadDir } from './uploads-root';

/** Formatos aceptados para fotos de estudiantes y docentes. */
export const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const IMAGE_MAX_SIZE = 5 * 1024 * 1024; // 5 MB

/** Guarda la imagen en <UPLOADS_ROOT>/<carpeta> con un nombre único. */
export const imageStorage = (folder: string) =>
  diskStorage({
    // La carpeta se resuelve por petición: al definir el decorador el `.env`
    // todavía no se ha cargado.
    destination: (_req, _file, cb) => cb(null, ensureUploadDir(folder)),
    filename: (_req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${uniqueSuffix}${extname(file.originalname).toLowerCase()}`);
    },
  });

export const imageFileFilter = (
  _req: any,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!IMAGE_MIME_TYPES.includes(file.mimetype)) {
    return cb(
      new BadRequestException(
        'Formato no permitido. Usa una imagen JPG, PNG o WEBP.',
      ),
      false,
    );
  }

  cb(null, true);
};
