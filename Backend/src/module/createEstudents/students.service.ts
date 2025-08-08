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
            return await this.StudentRepo.find({
                relations: ['pais', 'gender', 'departamento', 'municipio']
            });
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
                .where('student.id = :id', { id })
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

    async filtrarEstudiantes(params: FiltrarEstudiantesDto): Promise<StudentEntity[]> {
        const { name, lastName, studentCode } = params;

        const where: any = {};

        if (name) {
            where.name = ILike(`%${name}%`);
        }

        if (lastName) {
            where.lastName = ILike(`%${lastName}%`);
        }

        if (studentCode) {
            where.studentCode = ILike(`%${studentCode}%`);
        }

        return this.StudentRepo.find({
            where,
            take: 30,
        });
    }
}