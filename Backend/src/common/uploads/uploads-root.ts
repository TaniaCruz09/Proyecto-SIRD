import { mkdirSync } from 'fs';
import { join, resolve } from 'path';

/** Raíz del backend, sin depender del directorio desde el que se arranque. */
const BACKEND_ROOT = join(__dirname, '..', '..', '..');

let cachedRoot: string | undefined;

/**
 * Carpeta única donde viven todos los archivos subidos.
 *
 * Se calcula la primera vez que se usa y no al importar el módulo: `ConfigModule`
 * carga el `.env` durante `NestFactory.create()`, o sea después de evaluar los
 * imports. Siempre devuelve una ruta absoluta; `process.cwd()` nunca interviene.
 * Con `UPLOADS_DIR` se mueve a otra ubicación (por ejemplo una carpeta fuera del
 * proyecto); si es relativa, se interpreta respecto a la raíz del backend.
 */
export const getUploadsRoot = (): string => {
  cachedRoot ??= process.env.UPLOADS_DIR
    ? resolve(BACKEND_ROOT, process.env.UPLOADS_DIR)
    : join(BACKEND_ROOT, 'uploads');

  return cachedRoot;
};

/** Subcarpetas que el sistema usa; se crean al arrancar. */
export const UPLOAD_SUBFOLDERS = [
  'students',
  'docentes',
  'documentos/estudiantes',
  'documentos/docentes',
];

const createdDirs = new Set<string>();

/** Crea (si hace falta) la subcarpeta y devuelve su ruta absoluta. */
export const ensureUploadDir = (...segments: string[]): string => {
  const dir = join(getUploadsRoot(), ...segments);

  if (!createdDirs.has(dir)) {
    mkdirSync(dir, { recursive: true });
    createdDirs.add(dir);
  }

  return dir;
};

/** Convierte "/uploads/documentos/x.pdf" en su ruta absoluta en disco. */
export const uploadPathFromUrl = (archivo: string): string =>
  join(getUploadsRoot(), archivo.replace(/^\/?uploads\//, ''));
