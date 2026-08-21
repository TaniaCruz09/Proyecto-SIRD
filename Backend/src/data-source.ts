import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';

const baseOptions = {
  type: 'postgres' as const,
  migrationsTableName: process.env.MIGRATIONS_TABLE_NAME,
  entities: [join(process.cwd(), 'src', '**', '*.entity{.ts,.js}')],
  migrations: [join(process.cwd(), 'src', 'migrations', '*.{ts,js}')],
  synchronize: false,
} satisfies DataSourceOptions;

// Si existe DATABASE_URL (ej. Neon), se usa la cadena completa.
// Si no, se arma con las variables individuales (entorno local).
const connectionOptions: DataSourceOptions = process.env.DATABASE_URL
  ? { ...baseOptions, url: process.env.DATABASE_URL }
  : {
      ...baseOptions,
      host: process.env.HOST,
      port: Number(process.env.DATA_BASE_PORT),
      username: process.env.DATA_BASE_USER,
      password: process.env.DATA_BASE_PASSWORD,
      database: process.env.DATA_BASE_NAME,
    };

export const AppDataSource = new DataSource(connectionOptions);
