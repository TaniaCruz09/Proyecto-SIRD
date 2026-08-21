import { DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export const Database: DynamicModule = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  // Use useFactory, useClass, or useExisting
  // to configure the DataSourceOptions.
  useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
    const databaseUrl = configService.get<string>('DATABASE_URL');

    // Si existe DATABASE_URL (ej. Neon/Supabase), se usa la cadena completa.
    // Si no, se arma con las variables individuales (entorno local).
    const connection = databaseUrl
      ? { url: databaseUrl }
      : {
          host: configService.get('HOST'),
          port: +configService.get('DATA_BASE_PORT'),
          username: configService.get('DATA_BASE_USER'),
          password: configService.get('DATA_BASE_PASSWORD'),
          database: configService.get('DATA_BASE_NAME'),
        };

    const syncRaw = configService.get<string>('DB_SYNC');

    return {
      type: 'postgres',
      ...connection,
      migrationsTableName: configService.get('MIGRATIONS_TABLE_NAME'),
      autoLoadEntities: true,
      // Respetar DB_SYNC (true/false). Si no está definido, por defecto true (dev).
      synchronize: syncRaw === undefined ? true : syncRaw === 'true',
    };
  },
  // dataSource receives the configured DataSourceOptions
  // and returns a Promise.
  dataSourceFactory: async (options) => {
    const dataSource = await new DataSource(options).initialize();
    return dataSource;
  },
});
