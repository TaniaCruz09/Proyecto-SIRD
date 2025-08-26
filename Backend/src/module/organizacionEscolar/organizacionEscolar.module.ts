import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grupos } from './entities/grupos.entity';
import { GruposController } from './controllers/grupos.controller';
import { GruposService } from './services/grupos.service';
import { OrganizacionEscolarService } from '../organizacionEscolar/services/organizacionEscolar.service';
import { OrganizacionEscolarController } from './controllers/organizacionEscolar.controller';
import { Docentes } from '../docentes/docentes.entity';
import { AnioLectivo, Asignatura, Cortes, Modalidad, SemestreEntity, Turno } from '../catalogos';
import { StudentEntity } from '../createEstudents';
import { OrganizacionEscolar } from './entities/organizacionEscolar.entity';
import { GruposConEstudiantes } from './entities/grupos-con-estudiantes.entity';
import { GruposConEstudiantesController } from './controllers/grupos-con-estudiantes.controller';
import { GruposConEstudiantesService } from './services/grupos-con-estudiantes.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Grupos,
            OrganizacionEscolar,
            GruposConEstudiantes,
            Cortes,
            AnioLectivo,
            Turno
        ]),
    ],
    controllers: [
        GruposController,
        OrganizacionEscolarController,
        GruposConEstudiantesController,
    ],
    providers: [
        GruposService,
        OrganizacionEscolarService,
        GruposConEstudiantesService,
    ],
    exports: [OrganizacionEscolarModule, TypeOrmModule],
})
export class OrganizacionEscolarModule { }
