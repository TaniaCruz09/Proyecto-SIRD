import { DeepPartial, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable, NotFoundException } from "@nestjs/common";
import { StudentEntity } from "./students.entity";
import { StudentsDto } from "./student.dto";
import { UpdateStudentsDto } from "./updateStudent.dto";
import { FiltrarEstudiantesDto } from "./FiltrarEstudiantesDto";
import { Utilities } from "../../common/helpers/utilities";
import { GrupoAsignaturaConEstudiantes } from "../organizacionEscolar/entities/grupo-asignatura-con-estudiantes.entity";
import { EsquelaRow } from "../calificaciones/esquelas_rows/esquelas_rows.entity";

@Injectable()
export class StudentService {
    constructor(
        @InjectRepository(StudentEntity)
        private readonly StudentRepo: Repository<StudentEntity>,
    ) { }

    // ---------------------------------------------
    // Helpers para evitar repetir joins complejos
    // ---------------------------------------------
    private baseRelations(qb: any) {
        return qb
            .leftJoinAndSelect('student.pais', 'pais')
            .leftJoinAndSelect('student.gender', 'gender')
            .leftJoinAndSelect('student.departamento', 'departamento')
            .leftJoinAndSelect('student.municipio', 'municipio');
    }

    private baseRelationsWithGroups(qb: any) {
        return this.baseRelations(qb)
            .leftJoinAndSelect('student.grupoAsignaturaConEstudiantes', 'grupoAsignaturaConEstudiantes')
            .leftJoinAndSelect('grupoAsignaturaConEstudiantes.grupoAsignaturaDocente', 'grupoAsignaturaDocente')
            .leftJoinAndSelect('grupoAsignaturaDocente.grupo', 'grupo')
            .leftJoinAndSelect('grupo.organizacionEscolar', 'organizacionEscolar')
            .leftJoinAndSelect('organizacionEscolar.anio_lectivo', 'anio_lectivo')
            .leftJoinAndSelect('grupo.grado', 'grado')
            .leftJoinAndSelect('grupo.seccion', 'seccion')
            .leftJoinAndSelect('grupo.turno', 'turno');
    }

    // ------------------------------------------------
    // CREATE
    // ------------------------------------------------
    async created(payload: StudentsDto): Promise<StudentEntity> {
        try {
            const studentData: DeepPartial<StudentEntity> = {
                ...payload,
                gender: payload.gender ? { id: Number(payload.gender) } : undefined,
                pais: payload.pais ? { id: Number(payload.pais) } : undefined,
                municipio: payload.municipio ? { id: Number(payload.municipio) } : undefined,
                departamento: payload.departamento ? { id: Number(payload.departamento) } : undefined,
            };

            const student = this.StudentRepo.create(studentData);
            return await this.StudentRepo.save(student);
        } catch (error) {
            Utilities.catchError(error);
        }
    }

    // ------------------------------------------------
    // GET ALL
    // ------------------------------------------------
    async getStudent(): Promise<StudentEntity[]> {
        try {
            const qb = this.StudentRepo.createQueryBuilder('student');
            this.baseRelations(qb);
            return await qb.getMany();
        } catch (error) {
            Utilities.catchError(error);
        }
    }

    // ------------------------------------------------
    // GET BY ID
    // ------------------------------------------------
    async getStudentById(id: number): Promise<StudentEntity> {
        try {
            const qb = this.StudentRepo.createQueryBuilder('student')
                .where('student.id = :id', { id });

            this.baseRelationsWithGroups(qb)
                .leftJoinAndSelect('grupo.docenteGuia', 'DocenteGuia')
                .leftJoinAndSelect('grupo.grupoAsignaturaDocente', 'grupoAsignaturaDocenteDeGrupo')
                .leftJoinAndSelect('grupoAsignaturaDocenteDeGrupo.asignatura', 'asignatura')
                .leftJoinAndSelect('turno.modalidad', 'modalidad')

            return await qb.getOne();
        } catch (error) {
            Utilities.catchError(error);
        }
    }

    // ------------------------------------------------
    // UPDATE
    // ------------------------------------------------
    async updateStudent(id: number, payload: UpdateStudentsDto): Promise<StudentEntity> {
        try {
            const student = await this.StudentRepo.findOne({
                where: { id },
                relations: ['gender', 'pais', 'departamento', 'municipio'],
            });

            if (!student) throw new NotFoundException("Profesión no encontrada");

            Object.assign(student, payload);
            student.update_at = new Date();
            student.user_update_id = payload.user_update_id;

            return await this.StudentRepo.save(student);
        } catch (error) {
            Utilities.catchError(error);
        }
    }

    // ------------------------------------------------
    // DELETE (soft delete)
    // ------------------------------------------------
    async deleteStudent(id: number, userId: number): Promise<StudentEntity> {
        try {
            return await this.StudentRepo.manager.transaction(async (manager) => {
                const student = await manager.getRepository(StudentEntity).findOne({ where: { id } });

                if (!student) throw new NotFoundException("Profesión no encontrada");

                await manager.getRepository(GrupoAsignaturaConEstudiantes).delete({ estudiante: { id } });

                await manager
                    .getRepository(EsquelaRow)
                    .createQueryBuilder()
                    .delete()
                    .from(EsquelaRow)
                    .where('estudiante_id = :id', { id })
                    .execute();

                student.deleted_at = new Date();
                student.deleted_at_id = userId;

                return await manager.getRepository(StudentEntity).save(student);
            });
        } catch (error) {
            Utilities.catchError(error);
        }
    }

    // ------------------------------------------------
    // FILTRAR ESTUDIANTES
    // ------------------------------------------------
    async filtrarEstudiantes(params: FiltrarEstudiantesDto, anioId?: string): Promise<any[]> {
        try {
            const { name, lastName, studentCode } = params;

            const qb = this.StudentRepo.createQueryBuilder('student');
            this.baseRelationsWithGroups(qb)
                .leftJoinAndSelect('turno.modalidad', 'modalidad');

            if (name) qb.andWhere('student.name ILIKE :name', { name: `%${name}%` });
            if (lastName) qb.andWhere('student.lastName ILIKE :lastName', { lastName: `%${lastName}%` });
            if (studentCode) qb.andWhere('student.studentCode ILIKE :studentCode', { studentCode: `%${studentCode}%` });

            qb.take(30);

            const students = await qb.getMany();

            return students.map((student) => {
                const anioFilter = Number(anioId);
                const grupo = Number.isFinite(anioFilter)
                    ? student.grupoAsignaturaConEstudiantes?.find(
                        (g) => g?.grupoAsignaturaDocente?.grupo?.organizacionEscolar?.anio_lectivo?.id === anioFilter,
                    )
                    : null;

                const grupoData = grupo?.grupoAsignaturaDocente?.grupo;
                const grupoAsignado = grupoData
                    ? `${grupoData.grado?.grades ?? ""} ${grupoData.seccion?.seccion ?? ""} - ${grupoData.turno?.turno ?? ""} - ${grupoData.turno?.modalidad?.modalidad ?? ""}`.replace(/\s+-\s+-\s+$/, "")
                    : null;

                return { ...student, asignadoGrupo: grupoAsignado };
            });
        } catch (error) {
            Utilities.catchError(error);
        }
    }
}
