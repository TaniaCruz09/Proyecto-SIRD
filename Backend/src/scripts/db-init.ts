import 'dotenv/config';
import { AppDataSource } from '../data-source';
import { ensureSchemas } from '../module/database/ensure-schemas';

/**
 * Inicializa la base de datos desde la línea de comandos:
 *   npm run db:schemas  -> solo crea los esquemas
 *   npm run db:sync     -> crea los esquemas y sincroniza las tablas
 */
async function main() {
  const sync = process.argv.includes('--sync');
  const dataSource = await AppDataSource.initialize();

  try {
    const schemas = await ensureSchemas(dataSource);
    console.log(`✓ Esquemas listos: ${schemas.join(', ')}`);

    if (sync) {
      await dataSource.synchronize();
      console.log('✓ Tablas sincronizadas con las entidades');
    }
  } finally {
    await dataSource.destroy();
  }
}

main().catch((error) => {
  console.error('✗ Error inicializando la base de datos:', error);
  process.exit(1);
});
