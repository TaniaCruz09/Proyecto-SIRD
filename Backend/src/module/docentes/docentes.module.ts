import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Docentes } from './docentes.entity';
import { DocenteController } from './docentes.controller';
import { DocentesService } from './docentes.service';
import { GrupoAsignaturaDocente } from '../organizacionEscolar/entities/GrupoAsignaturaDocente.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Docentes, GrupoAsignaturaDocente]),
  ],
  controllers: [DocenteController],
  providers: [DocentesService],
  exports: [DocentesModule, TypeOrmModule]
})
export class DocentesModule { }
