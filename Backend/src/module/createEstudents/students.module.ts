import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StudentEntity } from "./students.entity";
import { StudentController } from "./students.controller";
import { StudentService } from "./students.service";
import { GrupoAsignaturaConEstudiantes } from "../organizacionEscolar/entities/grupo-asignatura-con-estudiantes.entity";
import { EsquelaRow } from "../calificaciones/esquelas_rows/esquelas_rows.entity";
import { StudentDocument } from "./student-document.entity";
import { StudentDocumentsController } from "./student-documents.controller";
import { StudentDocumentsService } from "./student-documents.service";


@Module({
    imports: [
      TypeOrmModule.forFeature([StudentEntity, GrupoAsignaturaConEstudiantes, EsquelaRow, StudentDocument]),
    ],
    controllers: [
      StudentController,
      StudentDocumentsController
    ],
    providers: [
      StudentService,
      StudentDocumentsService
    ],
    exports: [StudetnModule, TypeOrmModule],
  })
  export class StudetnModule {}