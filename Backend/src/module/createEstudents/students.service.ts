import { ILike, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable, NotFoundException } from "@nestjs/common";
import { StudentEntity } from "./students.entity";
import { StudentsDto } from "./student.dto";
import { Utilities } from "../../common/helpers/utilities";
import { FiltrarEstudiantesDto } from "./FiltrarEstudiantesDto";


@Injectable()
export class StudentService {
    constructor(
        @InjectRepository(StudentEntity)
        private readonly StudentRepo: Repository<StudentEntity>,
    ) { }

    async created(payload: StudentsDto): Promise<StudentEntity> {
        try {
            const student = await this.StudentRepo.create(payload);
            return await this.StudentRepo.save(student);
        } catch (error) {
            Utilities.catchError(error)
        }

    }
    async getStudent(): Promise<StudentEntity[]> {
        try {
            return await this.StudentRepo.createQueryBuilder('student')
                .leftJoinAndSelect('student.pais', 'pais')
                .leftJoinAndSelect('student.gender', 'gender')
                .leftJoinAndSelect('student.departamento', 'departamento')
                .leftJoinAndSelect('student.municipio', 'municipio')
                .getMany()
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    async getStudentById(id: number): Promise<StudentEntity> {
        try {
            const student = await this.StudentRepo
                .createQueryBuilder('student')
                .leftJoinAndSelect('student.pais', 'pais')
                .leftJoinAndSelect('student.gender', 'gender')
                .leftJoinAndSelect('student.departamento', 'departamento')
                .leftJoinAndSelect('student.municipio', 'municipio')
                .leftJoinAndSelect('student.grupoAsignaturaConEstudiantes', 'grupoAsignaturaConEstudiantes')
                .leftJoinAndSelect('grupoAsignaturaConEstudiantes.grupoAsignaturaDocente', 'grupoAsignaturaDocente')
                .leftJoinAndSelect('grupoAsignaturaDocente.grupo', 'grupo')
                .leftJoinAndSelect('grupo.organizacionEscolar', 'organizacionEscolar')
                .leftJoinAndSelect('organizacionEscolar.anio_lectivo', 'anio_lectivo')
                .leftJoinAndSelect('grupo.grado', 'grado')
                .leftJoinAndSelect('grupo.seccion', 'seccion')
                .leftJoinAndSelect('grupo.turno', 'turno')
                .leftJoinAndSelect('grupo.docenteGuia', 'DocenteGuia')
                .leftJoinAndSelect('grupo.grupoAsignaturaDocente', 'grupoAsignaturaDocenteDeGrupo')
                .leftJoinAndSelect('grupoAsignaturaDocenteDeGrupo.asignatura', 'asignatura')
                .where('student.id = :id', { id })
                // .distinctOn(["grupo.id"]) // <-- evita duplicados por grupo
                .getOne()
            return student;
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    async updateStudent(id: number, payload: StudentsDto): Promise<StudentEntity> {
        try {
            const student = await this.StudentRepo.findOne({ where: { id } });
            if (!student) {
                throw new NotFoundException("Profesión no encontrada");
            }

            // Actualizar solo los campos enviados, conservando los valores previos
            Object.assign(student, payload);

            // Asignar la fecha de actualización y el usuario que modifica
            student.update_at = new Date();
            student.user_update_id;


            return await this.StudentRepo.save(student)
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    async deleteStudent(id: number, userId: number): Promise<StudentEntity> {
        try {
            const student = await this.StudentRepo.findOne({
                where: { id }
            })
            if (!student) {
                throw new NotFoundException("Profesión no encontrada");
            }

            // Registrar el usuario que eliminó y la fecha de eliminación
            student.deleted_at = new Date();
            student.deleted_at_id = userId;
            return await this.StudentRepo.save(student);
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    async filtrarEstudiantes(params: FiltrarEstudiantesDto, anioId?: string): Promise<any[]> {
        const { name, lastName, studentCode } = params;

        const qb = this.StudentRepo.createQueryBuilder('student')
            .leftJoinAndSelect('student.pais', 'pais')
            .leftJoinAndSelect('student.gender', 'gender')
            .leftJoinAndSelect('student.departamento', 'departamento')
            .leftJoinAndSelect('student.municipio', 'municipio')
            .leftJoinAndSelect('student.grupoAsignaturaConEstudiantes', 'grupoAsignaturaConEstudiantes')
            .leftJoinAndSelect('grupoAsignaturaConEstudiantes.grupoAsignaturaDocente', 'grupoAsignaturaDocente')
            .leftJoinAndSelect('grupoAsignaturaDocente.grupo', 'grupo')
            .leftJoinAndSelect('grupo.grado', 'grado')
            .leftJoinAndSelect('grupo.seccion', 'seccion')
            .leftJoinAndSelect('grupo.turno', 'turno')
            .leftJoinAndSelect('turno.modalidad', 'modalidad')
            .leftJoinAndSelect('grupo.organizacionEscolar', 'organizacionEscolar')
            .leftJoinAndSelect('organizacionEscolar.anio_lectivo', 'anio_lectivo');


        if (name) {
            qb.andWhere('student.name ILIKE :name', { name: `%${name}%` });
        }
        if (lastName) {
            qb.andWhere('student.lastName ILIKE :lastName', { lastName: `%${lastName}%` });
        }
        if (studentCode) {
            qb.andWhere('student.studentCode ILIKE :studentCode', { studentCode: `%${studentCode}%` });
        }

        // Limitar resultados
        qb.take(30);

        const students = await qb.getMany();

        // Opcional: mapear para agregar propiedad asignadoGrupo con descripción amigable
        return students.map(student => {
            const grupo = student.grupoAsignaturaConEstudiantes?.find(g => g.grupoAsignaturaDocente.grupo.organizacionEscolar.anio_lectivo.id === Number(anioId)); // primer registro
            const grupoAsignado = grupo?.grupoAsignaturaDocente.grupo
                ? `${grupo.grupoAsignaturaDocente.grupo.grado.grades} ${grupo.grupoAsignaturaDocente.grupo.seccion.seccion} - ${grupo.grupoAsignaturaDocente.grupo.turno.turno} - ${grupo.grupoAsignaturaDocente.grupo.turno.modalidad.modalidad}`
                : null;

            return {
                ...student,
                asignadoGrupo: grupoAsignado,
            };
        });

    }
}