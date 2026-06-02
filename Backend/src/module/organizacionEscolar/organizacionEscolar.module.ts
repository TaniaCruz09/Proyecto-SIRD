import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grupos } from './entities/grupos.entity';
import { GruposController } from './controllers/grupos.controller';
import { GruposService } from './services/grupos.service';
import { OrganizacionEscolarService } from '../organizacionEscolar/services/organizacionEscolar.service';
import { OrganizacionEscolarController } from './controllers/organizacionEscolar.controller';
import { Docentes } from '../docentes/docentes.entity';
import { AnioLectivo, Asignatura, AsignaturaController, AsignaturaService, Turno } from '../catalogos';
import { OrganizacionEscolar } from './entities/organizacionEscolar.entity';
import { GrupoAsignaturaDocente } from './entities/GrupoAsignaturaDocente.entity';
import { GrupoAsignaturaDocenteController } from './controllers/grupoAsignaturaDocente.controller';
import { GrupoAsignaturaDocenteService } from './services/grupoAsignaturaDocente.service';
import { GrupoAsignaturaConEstudiantesService } from './services/grupo-asignatura-con-estudiantes.service';
import { GrupoAsignaturaConEstudiantesController } from './controllers/grupo-asignatura-con-estudiantes.controller';
import { GrupoAsignaturaConEstudiantes } from './entities/grupo-asignatura-con-estudiantes.entity';
import { DocenteController } from '../docentes/docentes.controller';
import { DocentesService } from '../docentes/docentes.service';
import { CalificacionesModule } from '../calificaciones/calificaciones.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Grupos,
            OrganizacionEscolar,
            GrupoAsignaturaConEstudiantes,
            AnioLectivo,
            Turno,
            Asignatura,
            GrupoAsignaturaDocente,
            Docentes
        ]),
        CalificacionesModule,
    ],
    controllers: [
        GruposController,
        OrganizacionEscolarController,
        GrupoAsignaturaConEstudiantesController,
        AsignaturaController,
        GrupoAsignaturaDocenteController,
        DocenteController
    ],
    providers: [
        GruposService,
        OrganizacionEscolarService,
        GrupoAsignaturaConEstudiantesService,
        AsignaturaService,
        GrupoAsignaturaDocenteService,
        DocentesService
    ],
    exports: [OrganizacionEscolarModule, TypeOrmModule],
})
export class OrganizacionEscolarModule { }
