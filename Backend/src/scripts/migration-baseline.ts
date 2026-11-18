import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../data-source';

/**
 * Marca como aplicadas las migraciones históricas de una base que ya fue
 * creada/actualizada con `synchronize` (DB_SYNC=true).
 *
 * Las migraciones de este proyecto son incrementales: asumen que las tablas
 * base (creadas por sincronización) ya existen, por eso no se pueden volver a
 * ejecutar sobre una base ya creada.
 *
 * Uso:
 *   npm run migration:baseline -- --upto 20261113000100 --dry-run
 *   npm run migration:baseline -- --upto 20261113000100
 *
 * Después de marcar el historial, `npm run migration:run` solo aplica las
 * migraciones nuevas.
 */

const REQUIRED_TABLES = [
  'auth.users',
  'catalogos.cortes',
  'catalogos.tipo_periodizacion',
  'catalogos.anio_lectivo_calendarizacion',
  'calificaciones.esquela_row',
  'organizacion_escolar.grupos',
];

export type BaselineOptions = {
  upto?: string;
  dryRun?: boolean;
  force?: boolean;
};

function parseArgs(argv: string[]): Required<BaselineOptions> {
  const options: Required<BaselineOptions> = {
    upto: '',
    dryRun: false,
    force: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (arg === '--force') {
      options.force = true;
    } else if (arg === '--upto') {
      options.upto = argv[index + 1] ?? '';
      index += 1;
    } else if (arg.startsWith('--upto=')) {
      options.upto = arg.slice('--upto='.length);
    } else {
      throw new Error(`Argumento no reconocido: ${arg}`);
    }
  }

  if (options.upto && !/^\d{14}$/.test(options.upto)) {
    throw new Error(
      'El valor de --upto debe ser un timestamp de 14 dígitos, por ejemplo 20261113000100',
    );
  }

  return options;
}

function migrationsTable(): string {
  const table = process.env.MIGRATIONS_TABLE_NAME?.trim() || 'migrations';
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(table)) {
    throw new Error(`Nombre de tabla de migraciones no válido: ${table}`);
  }
  return `public."${table}"`;
}

async function assertSchemaAlreadyExists(dataSource: DataSource): Promise<void> {
  const missing: string[] = [];

  for (const table of REQUIRED_TABLES) {
    const rows: Array<{ exists: string | null }> = await dataSource.query(
      'select to_regclass($1) as "exists"',
      [table],
    );
    if (!rows[0]?.exists) missing.push(table);
  }

  if (missing.length) {
    throw new Error(
      [
        'Esta base no tiene el esquema completo que crea `synchronize`.',
        `Faltan: ${missing.join(', ')}.`,
        'No ejecutes el baseline sobre una base vacía: usa `npm run db:bootstrap`',
        'para crearla desde cero.',
      ].join('\n'),
    );
  }
}

/**
 * Registra las migraciones del repositorio como aplicadas y devuelve los
 * nombres marcados (vacío si ya estaban todas).
 */
export async function applyBaseline(
  dataSource: DataSource,
  options: BaselineOptions = {},
): Promise<string[]> {
  const table = migrationsTable();
  const upto = options.upto;

  await assertSchemaAlreadyExists(dataSource);

  const entries = dataSource.migrations.map((migration) => {
    const className = migration.constructor.name;
    // Misma convención que TypeORM: los últimos 13 dígitos del nombre.
    const timestamp = Number(className.substr(-13));
    if (!Number.isFinite(timestamp)) {
      throw new Error(
        `No se pudo obtener el timestamp de la migración ${className}`,
      );
    }
    return { name: migration.name ?? className, timestamp };
  });

  const selected = entries
    .filter(({ timestamp }) => (upto ? timestamp <= Number(upto) : true))
    .sort((a, b) => a.timestamp - b.timestamp);

  if (!selected.length) return [];

  await dataSource.query(`
    create table if not exists ${table} (
      id serial primary key,
      timestamp bigint not null,
      name varchar not null
    )
  `);

  const applied: Array<{ name: string }> = await dataSource.query(
    `select name from ${table}`,
  );
  const appliedNames = new Set(applied.map((row) => row.name));

  if (appliedNames.size > 0 && !options.force) {
    throw new Error(
      [
        `La tabla ${table} ya tiene ${appliedNames.size} migraciones registradas.`,
        'El baseline es una operación única sobre una base nunca migrada.',
        'Si de verdad necesitas volver a marcarlas, repite con --force.',
      ].join('\n'),
    );
  }

  const pending = selected.filter(({ name }) => !appliedNames.has(name));
  if (!pending.length) return [];

  const marked: string[] = [];
  for (const { name, timestamp } of pending) {
    if (options.dryRun) {
      console.log(`[dry-run] marcaría ${timestamp} - ${name}`);
      marked.push(name);
      continue;
    }
    await dataSource.query(
      `insert into ${table} (timestamp, name) values ($1, $2)`,
      [timestamp, name],
    );
    console.log(`marcada ${timestamp} - ${name}`);
    marked.push(name);
  }

  return marked;
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  await AppDataSource.initialize();

  try {
    const marked = await applyBaseline(AppDataSource, options);

    if (!marked.length) {
      console.log('Todas las migraciones seleccionadas ya estaban marcadas.');
      return;
    }

    if (options.dryRun) {
      console.log(`\n[dry-run] ${marked.length} migraciones se marcarían.`);
      return;
    }

    console.log(
      `\n${marked.length} migraciones marcadas como aplicadas. ` +
        'Ejecuta `npm run migration:run` para aplicar solo las nuevas.',
    );
  } finally {
    await AppDataSource.destroy();
  }
}

if (require.main === module) {
  main().catch((error: unknown) => {
    console.error(
      `No se pudo preparar el baseline: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
    process.exit(1);
  });
}
