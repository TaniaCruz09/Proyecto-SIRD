import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  AnioLectivo,
  AnioLectivoCalendarizacion,
  AnioLectivoCorte,
  PeriodoLectivo,
} from '../catalogos';
import { Grupos } from '../organizacionEscolar/entities/grupos.entity';
import { OrganizacionEscolar } from '../organizacionEscolar/entities/organizacionEscolar.entity';
import { GrupoAsignaturaConEstudiantes } from '../organizacionEscolar/entities/grupo-asignatura-con-estudiantes.entity';
import { PromocionController } from './controllers/promocion.controller';
import { PromocionService } from './services/promocion.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AnioLectivo,
      OrganizacionEscolar,
      Grupos,
      GrupoAsignaturaConEstudiantes,
      PeriodoLectivo,
      AnioLectivoCorte,
      AnioLectivoCalendarizacion,
    ]),
  ],
  controllers: [PromocionController],
  providers: [PromocionService],
})
export class PromocionModule {}
