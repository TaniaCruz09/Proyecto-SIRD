import 'reflect-metadata';
import { AppDataSource } from '../data-source';
import { ensureSchemas } from '../module/database/ensure-schemas';
import { applyBaseline } from './migration-baseline';

/**
 * Prepara una base de datos **vacía** para trabajar con migraciones:
 *   1. crea los esquemas,
 *   2. crea las tablas desde las entidades (`synchronize`),
 *   3. registra las migraciones históricas como aplicadas.
 *
 * Uso:
 *   npm run db:bootstrap
 *
 * Después, `npm run migration:run` aplica solo las migraciones nuevas.
 * Se niega a ejecutarse si la base ya tiene tablas.
 */
async function main(): Promise<void> {
  const dataSource = await AppDataSource.initialize();

  try {
    const [existing] = (await dataSource.query(
      `select to_regclass('auth.users') as "table"`,
    )) as Array<{ table: string | null }>;

    if (existing?.table) {
      throw new Error(
        [
          'Esta base ya tiene tablas; `db:bootstrap` solo sirve para una base nueva.',
          'Si la base ya existe: usa `npm run migration:run`.',
          'Si se creó con `synchronize` y nunca se migró: usa',
          '`npm run migration:baseline` una sola vez.',
        ].join('\n'),
      );
    }

    const schemas = await ensureSchemas(dataSource);
    console.log(`✓ Esquemas listos: ${schemas.join(', ')}`);

    await dataSource.synchronize();
    console.log('✓ Tablas creadas desde las entidades');

    const marked = await applyBaseline(dataSource);
    console.log(`✓ ${marked.length} migraciones registradas como aplicadas`);

    console.log(
      '\nBase lista. Desde ahora aplica los cambios solo con ' +
        '`npm run migration:run` (mantén DB_SYNC=false).',
    );
  } finally {
    await dataSource.destroy();
  }
}

main().catch((error: unknown) => {
  console.error(
    `✗ No se pudo preparar la base: ${
      error instanceof Error ? error.message : String(error)
    }`,
  );
  process.exit(1);
});
