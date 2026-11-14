import { unlink } from 'fs/promises';
import { uploadPathFromUrl } from './uploads-root';

/** Borra un archivo recién subido por Multer. No propaga errores. */
export const removeUploadedFile = async (
  file?: Express.Multer.File,
): Promise<void> => {
  if (!file?.path) return;
  await unlink(file.path).catch(() => undefined);
};

/**
 * Borra el archivo anterior cuando fue reemplazado por uno nuevo en la misma
 * entidad (por ejemplo una foto de perfil). Llamar solo después de guardar.
 */
export const removeReplacedFile = async (
  archivoAnterior?: string | null,
  archivoNuevo?: string | null,
): Promise<void> => {
  if (!archivoAnterior || archivoAnterior === archivoNuevo) return;
  await unlink(uploadPathFromUrl(archivoAnterior)).catch(() => undefined);
};
