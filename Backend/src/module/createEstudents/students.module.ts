import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StudentEntity } from "./students.entity";
import { StudentController } from "./students.controller";
import { StudentService } from "./students.service";
import { GrupoAsignaturaConEstudiantes } from "../organizacionEscolar/entities/grupo-asignatura-con-estudiantes.entity";
import { EsquelaRow } from "../calificaciones/esquelas_rows/esquelas_rows.entity";


@Module({
    imports: [
      TypeOrmModule.forFeature([StudentEntity, GrupoAsignaturaConEstudiantes, EsquelaRow]),
    ],
    controllers: [
      StudentController
    ],
    providers: [
      StudentService
      
    ],
    exports: [StudetnModule, TypeOrmModule],
  })
  export class StudetnModule {}