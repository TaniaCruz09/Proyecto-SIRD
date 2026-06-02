import 'dotenv/config';
import { DataSource } from 'typeorm';
import { join } from 'path';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.HOST,
  port: Number(process.env.DATA_BASE_PORT),
  username: process.env.DATA_BASE_USER,
  password: process.env.DATA_BASE_PASSWORD,
  database: process.env.DATA_BASE_NAME,
  migrationsTableName: process.env.MIGRATIONS_TABLE_NAME,
  entities: [join(process.cwd(), 'src', '**', '*.entity{.ts,.js}')],
  migrations: [join(process.cwd(), 'src', 'migrations', '*.{ts,js}')],
  synchronize: false,
});
