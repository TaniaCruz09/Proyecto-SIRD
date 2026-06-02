import { DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export const Database: DynamicModule = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  // Use useFactory, useClass, or useExisting
  // to configure the DataSourceOptions.
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get('HOST'),
    port: +configService.get('DATA_BASE_PORT'),
    username: configService.get('DATA_BASE_USER'),
    password: configService.get('DATA_BASE_PASSWORD'),
    database: configService.get('DATA_BASE_NAME'),
    migrationsTableName: configService.get('MIGRATIONS_TABLE_NAME'),
    autoLoadEntities: true,
    synchronize: false,
  }),
  // dataSource receives the configured DataSourceOptions
  // and returns a Promise.
  dataSourceFactory: async (options) => {
    const dataSource = await new DataSource(options).initialize();
    return dataSource;
  },
});
