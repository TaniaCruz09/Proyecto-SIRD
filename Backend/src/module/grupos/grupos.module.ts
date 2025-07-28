import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grupos } from './entities/grupos.entity';
import { GruposConEstudiantes } from './entities/gruposConEstudiantes.entity';
import { GruposController } from './controllers/grupos.controller';
import { GruposConEstudiantesController } from './controllers/gruposConEstudiantes.controller';
import { GruposConEstudiantesService } from './services/gruposConEstudiantes.service';
import { GruposService } from './services/grupos.service';
import { OrganizacionEscolar } from './entities/organizacionEscolar.entity.';
import { OrganizacionEscolarService } from './services/organizacionEscolar.service';
import { OrganizacionEscolarController } from './controllers/organizacionEscolar.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Grupos,
      GruposConEstudiantes,
      OrganizacionEscolar,
    ]),
  ],
  controllers: [
    GruposController,
    GruposConEstudiantesController,
    OrganizacionEscolarController,
  ],
  providers: [
    GruposService,
    GruposConEstudiantesService,
    OrganizacionEscolarService,
  ],
   exports: [GruposModule, TypeOrmModule],
})
export class GruposModule {}
