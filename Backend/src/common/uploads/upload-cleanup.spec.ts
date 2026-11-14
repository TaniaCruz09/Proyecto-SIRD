import { mkdir, rm, stat, writeFile } from 'fs/promises';
import { join } from 'path';
import { removeReplacedFile, removeUploadedFile } from './upload-cleanup';
import { getUploadsRoot } from './uploads-root';

const exists = async (path: string) =>
  stat(path).then(
    () => true,
    () => false,
  );

describe('upload-cleanup', () => {
  // Se trabaja dentro de la carpeta real de uploads, en un subdirectorio propio.
  const carpeta = join(getUploadsRoot(), '__spec__');
  const anterior = join(carpeta, 'anterior.png');
  const nuevo = join(carpeta, 'nuevo.png');

  beforeEach(async () => {
    await mkdir(carpeta, { recursive: true });
    await writeFile(anterior, 'anterior');
    await writeFile(nuevo, 'nuevo');
  });

  afterEach(async () => {
    await rm(carpeta, { recursive: true, force: true });
  });

  it('borra la foto anterior cuando fue reemplazada por otra', async () => {
    await removeReplacedFile('/uploads/__spec__/anterior.png', '/uploads/__spec__/nuevo.png');

    await expect(exists(anterior)).resolves.toBe(false);
    await expect(exists(nuevo)).resolves.toBe(true);
  });

  it('conserva el archivo cuando la ruta no cambió', async () => {
    await removeReplacedFile('/uploads/__spec__/anterior.png', '/uploads/__spec__/anterior.png');

    await expect(exists(anterior)).resolves.toBe(true);
  });

  it('no falla si no había archivo anterior', async () => {
    await expect(
      removeReplacedFile(null, '/uploads/__spec__/nuevo.png'),
    ).resolves.toBeUndefined();
    await expect(exists(nuevo)).resolves.toBe(true);
  });

  it('removeUploadedFile borra el archivo recién subido y tolera que no exista', async () => {
    await removeUploadedFile({ path: anterior } as Express.Multer.File);
    await expect(exists(anterior)).resolves.toBe(false);

    await expect(
      removeUploadedFile({ path: anterior } as Express.Multer.File),
    ).resolves.toBeUndefined();
  });
});
