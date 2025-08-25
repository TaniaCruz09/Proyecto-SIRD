import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grupos } from './entities/grupos.entity';
import { GruposController } from './controllers/grupos.controller';
import { OrganizacionConEstudiantesController } from './controllers/gruposConEstudiantes.controller';
import { OrganizacionConEstudiantesService } from './services/organizacionConEstudiantes.service';
import { GruposService } from './services/grupos.service';
import { OrganizacionEscolarService } from '../organizacionEscolar/services/organizacionEscolar.service';
import { OrganizacionEscolarController } from './controllers/organizacionEscolar.controller';
import { OrganizacionConEstudiantes } from './entities/organizacionConEstudiante';
import { Docentes } from '../docentes/docentes.entity';
import { AnioLectivo, Asignatura, AsignaturaController, AsignaturaService, Cortes, Modalidad, SemestreEntity, Turno } from '../catalogos';
import { StudentEntity } from '../createEstudents';
import { OrganizacionEscolar } from './entities/organizacionEscolar.entity';

import { GrupoAsignaturaDocente } from './entities/GrupoAsignaturaDocente.entity';
import { GrupoAsignaturaDocenteController } from './controllers/grupoAsignaturaDocente.controller';
import { GrupoAsignaturaDocenteService } from './services/grupoAsignaturaDocente.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Grupos,
            OrganizacionEscolar,
            OrganizacionConEstudiantes,
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
        OrganizacionConEstudiantesController,
        //OrganizacionEscolarConAsignaturaController,
        AsignaturaController,
        GrupoAsignaturaDocenteController

    ],
    providers: [
        GruposService,
        OrganizacionEscolarService,
        OrganizacionConEstudiantesService,
        //OrganizacionEscolarConAsignaturaService,
        AsignaturaService,
        GrupoAsignaturaDocenteService
        
        
    ],
    exports: [OrganizacionEscolarModule, TypeOrmModule],
})
export class OrganizacionEscolarModule { }
