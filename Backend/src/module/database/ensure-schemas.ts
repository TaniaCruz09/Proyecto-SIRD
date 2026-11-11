import { DataSource, getMetadataArgsStorage } from 'typeorm';

/**
 * Esquemas de PostgreSQL usados por las entidades del proyecto.
 * TypeORM no crea esquemas al ejecutar `synchronize`, por eso deben existir
 * antes de sincronizar las tablas.
 */
export const DEFAULT_SCHEMAS = [
  'auth',
  'catalogos',
  'calificaciones',
  'centro',
  'docentes',
  'estudiante',
  'organizacion_escolar',
];

const VALID_IDENTIFIER = /^[A-Za-z_][A-Za-z0-9_]*$/;

/**
 * Esquemas a crear: los declarados en `@Entity({ schema })` de las entidades
 * cargadas, los conocidos por defecto y los definidos en DB_SCHEMAS.
 */
export function resolveSchemas(): string[] {
  const schemas = new Set<string>(DEFAULT_SCHEMAS);

  for (const table of getMetadataArgsStorage().tables) {
    if (table.schema) {
      schemas.add(table.schema);
    }
  }

  for (const schema of (process.env.DB_SCHEMAS ?? '').split(',')) {
    const name = schema.trim();
    if (name) {
      schemas.add(name);
    }
  }

  return [...schemas].filter((schema) => VALID_IDENTIFIER.test(schema));
}

/** Crea (si no existen) los esquemas indicados. */
export async function ensureSchemas(
  dataSource: DataSource,
  schemas: string[] = resolveSchemas(),
): Promise<string[]> {
  for (const schema of schemas) {
    await dataSource.query(`CREATE SCHEMA IF NOT EXISTS "${schema}"`);
  }

  return schemas;
}
