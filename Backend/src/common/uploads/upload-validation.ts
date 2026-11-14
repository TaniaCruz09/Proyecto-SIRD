import { BadRequestException } from '@nestjs/common';
import { fromFile } from 'file-type';
import { unlink } from 'fs/promises';

/**
 * Tipos detectados por contenido (magic bytes). El cliente puede mentir en el
 * `Content-Type` de la petición, así que esta es la verificación que vale.
 */
const IMAGE_CONTENT_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const DOCUMENT_CONTENT_TYPES = [
  ...IMAGE_CONTENT_TYPES,
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/x-cfb', // .doc y .xls: contenedor OLE2
];

/** Agrupa el MIME declarado y el detectado para compararlos entre sí. */
const MIME_GROUP: Record<string, string> = {
  'image/jpeg': 'imagen',
  'image/png': 'imagen',
  'image/webp': 'imagen',
  'application/pdf': 'pdf',
  'application/msword': 'word',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'word',
  'application/vnd.ms-excel': 'excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'excel',
};

/** Los .doc/.xls antiguos son contenedores OLE2: no distinguen Word de Excel. */
const isCompatible = (declarado: string, detectado: string): boolean => {
  if (detectado === 'application/x-cfb') {
    return ['application/msword', 'application/vnd.ms-excel'].includes(declarado);
  }

  return MIME_GROUP[declarado] === MIME_GROUP[detectado];
};

/**
 * Comprueba que el contenido real del archivo corresponda a un tipo permitido y
 * que coincida con el MIME declarado. Multer ya lo escribió en disco, así que
 * si no pasa se borra antes de responder 400.
 */
const assertRealContent = async (
  file: Express.Multer.File | undefined,
  allowed: string[],
  mensaje: string,
): Promise<void> => {
  if (!file?.path) return;

  const detected = await fromFile(file.path).catch(() => undefined);

  const valido =
    !!detected && allowed.includes(detected.mime) && isCompatible(file.mimetype, detected.mime);

  if (!valido) {
    await unlink(file.path).catch(() => undefined);
    throw new BadRequestException(mensaje);
  }
};

/** Verifica que la subida sea realmente una imagen JPG, PNG o WEBP. */
export const assertImageContent = (file?: Express.Multer.File) =>
  assertRealContent(
    file,
    IMAGE_CONTENT_TYPES,
    'El archivo no es una imagen JPG, PNG o WEBP válida.',
  );

/** Verifica que la subida sea realmente un PDF, imagen o documento de Office. */
export const assertDocumentContent = (file?: Express.Multer.File) =>
  assertRealContent(
    file,
    DOCUMENT_CONTENT_TYPES,
    'El contenido del archivo no corresponde a un PDF, imagen o documento de Office.',
  );
