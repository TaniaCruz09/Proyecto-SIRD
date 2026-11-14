import { BadRequestException } from '@nestjs/common';
import { mkdtemp, rm, stat, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { assertDocumentContent, assertImageContent } from './upload-validation';

/** PNG 1x1 real (solo importan los magic bytes para la detección). */
const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64',
);

const PDF = Buffer.from('%PDF-1.4\n1 0 obj\n<<>>\nendobj\n');

const asFile = (path: string, mimetype: string) =>
  ({ path, mimetype }) as Express.Multer.File;

const exists = async (path: string) =>
  stat(path).then(
    () => true,
    () => false,
  );

describe('upload-validation', () => {
  let dir: string;

  beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), 'sird-upload-'));
  });

  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it('acepta una imagen PNG real', async () => {
    const path = join(dir, 'foto.png');
    await writeFile(path, PNG);

    await expect(assertImageContent(asFile(path, 'image/png'))).resolves.toBeUndefined();
    await expect(exists(path)).resolves.toBe(true);
  });

  it('rechaza un archivo de texto declarado como PNG y lo borra del disco', async () => {
    const path = join(dir, 'foto.png');
    await writeFile(path, 'esto no es una imagen');

    await expect(assertImageContent(asFile(path, 'image/png'))).rejects.toBeInstanceOf(
      BadRequestException,
    );
    await expect(exists(path)).resolves.toBe(false);
  });

  it('rechaza una imagen real declarada como PDF', async () => {
    const path = join(dir, 'documento.pdf');
    await writeFile(path, PNG);

    await expect(
      assertDocumentContent(asFile(path, 'application/pdf')),
    ).rejects.toBeInstanceOf(BadRequestException);
    await expect(exists(path)).resolves.toBe(false);
  });

  it('acepta un PDF real como documento', async () => {
    const path = join(dir, 'documento.pdf');
    await writeFile(path, PDF);

    await expect(
      assertDocumentContent(asFile(path, 'application/pdf')),
    ).resolves.toBeUndefined();
  });

  it('no hace nada cuando no se subió archivo', async () => {
    await expect(assertImageContent(undefined)).resolves.toBeUndefined();
    await expect(assertDocumentContent(undefined)).resolves.toBeUndefined();
  });
});
