import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Docentes } from './docentes.entity';
import { DocenteController } from './docentes.controller';
import { DocentesService } from './docentes.service';
import { GrupoAsignaturaDocente } from '../organizacionEscolar/entities/GrupoAsignaturaDocente.entity';
import { DocenteDocument } from './docente-document.entity';
import { DocenteDocumentsController } from './docente-documents.controller';
import { DocenteDocumentsService } from './docente-documents.service';
@Module({
  imports: [TypeOrmModule.forFeature([Docentes, GrupoAsignaturaDocente, DocenteDocument]),
  ],
  controllers: [DocenteController, DocenteDocumentsController],
  providers: [DocentesService, DocenteDocumentsService],
  exports: [DocentesModule, TypeOrmModule]
})
export class DocentesModule { }
