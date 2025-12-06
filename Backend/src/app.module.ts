import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CacheInterceptor } from '@nestjs/cache-manager';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { DatabaseModule } from './module/database/database.module';
import { CatalogoModule } from './module/catalogos/catalogo.module';
import { DocentesModule } from './module/docentes/docentes.module';
import { AuthModule } from './module/auth/auth.module';
import { StudetnModule } from './module/createEstudents/students.module';
import { CalificacionesModule } from './module/calificaciones/calificaciones.module';
import { CentroModule } from './module/centroEducativo/centro.module';
import { OrganizacionEscolarModule } from './module/organizacionEscolar/organizacionEscolar.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),

    CacheModule.register({
      ttl: 10,
      max: 100,
    }),

    DatabaseModule,
    CatalogoModule,
    DocentesModule,
    AuthModule,
    StudetnModule,
    CalificacionesModule,
    CentroModule,
    OrganizacionEscolarModule,
  ],

  controllers: [AppController],
  providers: [
    AppService,

    // 🔥 Interceptor global correctamente inyectado
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
