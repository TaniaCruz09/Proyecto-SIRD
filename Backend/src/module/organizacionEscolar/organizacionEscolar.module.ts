import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grupos } from './entities/grupos.entity';
import { GruposController } from './controllers/grupos.controller';
import { OrganizacionConEstudiantesController } from './controllers/gruposConEstudiantes.controller';
import { OrganizacionConEstudiantesService } from './services/organizacionConEstudiantes.service';
import { GruposService } from './services/grupos.service';
import { OrganizacionEscolar } from './entities/organizacionEscolar.entity.';
import { OrganizacionEscolarService } from '../organizacionEscolar/services/organizacionEscolar.service';
import { OrganizacionEscolarController } from './controllers/organizacionEscolar.controller';
import { OrganizacionConEstudiantes } from './entities/organizacionConEstudiante';
import { Docentes } from '../docentes/docentes.entity';
import { AnioLectivo, Asignatura, Cortes } from '../catalogos';
import { StudentEntity } from '../createEstudents';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Grupos,
            OrganizacionEscolar,
            OrganizacionConEstudiantes,
            Docentes,
            Asignatura,
            Cortes,
            AnioLectivo,
            StudentEntity
        ]),
    ],
    controllers: [
        GruposController,
        OrganizacionEscolarController,
        OrganizacionConEstudiantesController,
    ],
    providers: [
        GruposService,
        OrganizacionEscolarService,
        OrganizacionConEstudiantesService,
    ],
    exports: [OrganizacionEscolarModule, TypeOrmModule],
})
export class OrganizacionEscolarModule { }
