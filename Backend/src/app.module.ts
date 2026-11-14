import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';

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
import { PromocionModule } from './module/promocion/promocion.module';
import { JwtAuthGuard } from './module/auth/guards/jwt.guard';
import { UserRoleGuard } from './module/auth/guards/user-role.guard';
import { validateEnv } from './common/config/env.validation';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      validate: validateEnv,
    }),

    DatabaseModule,
    CatalogoModule,
    DocentesModule,
    AuthModule,
    StudetnModule,
    CalificacionesModule,
    CentroModule,
    OrganizacionEscolarModule,
    PromocionModule,
  ],

  controllers: [AppController],
  providers: [
    AppService,

    // Formato único de error ({statusCode, message, path, timestamp}) sin filtrar SQL.
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },

    // Todo endpoint exige JWT salvo los marcados con @Public().
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },

    // Aplica @Role('Admin') / @Auth('Admin') cuando el endpoint lo declara.
    {
      provide: APP_GUARD,
      useClass: UserRoleGuard,
    },
  ],
})
export class AppModule {}
