import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grupos } from './entities/grupos.entity';
import { GruposController } from './controllers/grupos.controller';
import { GruposService } from './services/grupos.service';
import { OrganizacionEscolarService } from '../organizacionEscolar/services/organizacionEscolar.service';
import { OrganizacionEscolarController } from './controllers/organizacionEscolar.controller';
import { Docentes } from '../docentes/docentes.entity';
import { AnioLectivo, Asignatura, AsignaturaController, AsignaturaService, Cortes, Modalidad, SemestreEntity, Turno } from '../catalogos';
import { OrganizacionEscolar } from './entities/organizacionEscolar.entity';
import { GruposConEstudiantes } from './entities/grupos-con-estudiantes.entity';
import { GruposConEstudiantesController } from './controllers/grupos-con-estudiantes.controller';
import { GruposConEstudiantesService } from './services/grupos-con-estudiantes.service';

import { GrupoAsignaturaDocente } from './entities/GrupoAsignaturaDocente.entity';
import { GrupoAsignaturaDocenteController } from './controllers/grupoAsignaturaDocente.controller';
import { GrupoAsignaturaDocenteService } from './services/grupoAsignaturaDocente.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Grupos,
            OrganizacionEscolar,
            GruposConEstudiantes,
            Cortes,
            AnioLectivo,
            Turno,
            //OrganizacionEscolarConAsignaturas,
            Asignatura,
            GrupoAsignaturaDocente,
            Docentes
        ]),
    ],
    controllers: [
        GruposController,
        OrganizacionEscolarController,
        GruposConEstudiantesController,
        //OrganizacionEscolarConAsignaturaController,
        AsignaturaController,
        GrupoAsignaturaDocenteController
    ],
    providers: [
        GruposService,
        OrganizacionEscolarService,
        GruposConEstudiantesService,
        //OrganizacionEscolarConAsignaturaService,
        AsignaturaService,
        GrupoAsignaturaDocenteService
    ],
    exports: [OrganizacionEscolarModule, TypeOrmModule],
})
export class OrganizacionEscolarModule { }
