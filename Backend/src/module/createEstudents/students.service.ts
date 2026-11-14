import { DeepPartial, IsNull, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { StudentEntity } from "./students.entity";
import { StudentsDto } from "./student.dto";
import { UpdateStudentsDto } from "./updateStudent.dto";
import { FiltrarEstudiantesDto } from "./FiltrarEstudiantesDto";
import { GrupoAsignaturaConEstudiantes } from "../organizacionEscolar/entities/grupo-asignatura-con-estudiantes.entity";
import { EsquelaRow } from "../calificaciones/esquelas_rows/esquelas_rows.entity";
import { removeReplacedFile } from "../../common/uploads/upload-cleanup";

@Injectable()
export class StudentService {
    constructor(
        @InjectRepository(StudentEntity)
        private readonly StudentRepo: Repository<StudentEntity>,
    ) { }

    // ---------------------------------------------
    // Unicidad de cédula y código de estudiante
    // ---------------------------------------------
    private normalizar(valor?: string | null): string {
        return (valor ?? '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    }

    /**
     * Busca otro estudiante ACTIVO con la misma cédula o código, ignorando
     * guiones y mayúsculas. Los registros eliminados liberan la cédula/código.
     */
    async existeConflicto({
        cedula,
        codigo,
        excluirId,
    }: {
        cedula?: string | null;
        codigo?: string | null;
        excluirId?: number;
    }): Promise<{ campo: 'cedula' | 'codigo'; valor: string } | null> {
        const cedulaNormalizada = this.normalizar(cedula);
        const codigoNormalizado = this.normalizar(codigo);

        if (!cedulaNormalizada && !codigoNormalizado) return null;

        const condiciones: string[] = [];
        const parametros: Record<string, string> = {};

        if (cedulaNormalizada) {
            condiciones.push(
                `regexp_replace(upper(coalesce(student.identityCard, '')), '[^A-Z0-9]', '', 'g') = :cedula`,
            );
            parametros.cedula = cedulaNormalizada;
        }

        if (codigoNormalizado) {
            condiciones.push(
                `regexp_replace(upper(coalesce(student.studentCode, '')), '[^A-Z0-9]', '', 'g') = :codigo`,
            );
            parametros.codigo = codigoNormalizado;
        }

        const query = this.StudentRepo.createQueryBuilder('student')
            .where('student.deleted_at IS NULL')
            .andWhere(`(${condiciones.join(' OR ')})`, parametros);

        if (excluirId) {
            query.andWhere('student.id <> :excluirId', { excluirId });
        }

        const encontrados = await query.getMany();

        const porCedula = cedulaNormalizada
            ? encontrados.find((item) => this.normalizar(item.identityCard) === cedulaNormalizada)
            : undefined;
        if (porCedula) {
            return {
                campo: 'cedula',
                valor: (cedula ?? '').trim() || porCedula.identityCard,
            };
        }

        const porCodigo = codigoNormalizado
            ? encontrados.find((item) => this.normalizar(item.studentCode) === codigoNormalizado)
            : undefined;
        if (porCodigo) {
            return {
                campo: 'codigo',
                valor: (codigo ?? '').trim() || porCodigo.studentCode,
            };
        }

        return null;
    }

    private async validarUnicidad(
        cedula?: string | null,
        codigo?: string | null,
        excluirId?: number,
    ): Promise<void> {
        const duplicado = await this.existeConflicto({ cedula, codigo, excluirId });
        if (!duplicado) return;

        const mensaje =
            duplicado.campo === 'cedula'
                ? `Ya existe un estudiante con la cedula ${duplicado.valor}`
                : `Ya existe un estudiante con el codigo ${duplicado.valor}`;

        throw new ConflictException(mensaje);
    }

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
            .leftJoinAndSelect('student.grupoAsignaturaConEstudiantes', 'grupoAsignaturaConEstudiantes', 'grupoAsignaturaConEstudiantes.deleted_at IS NULL')
            .leftJoinAndSelect('grupoAsignaturaConEstudiantes.grupoAsignaturaDocente', 'grupoAsignaturaDocente')
            .leftJoinAndSelect('grupoAsignaturaDocente.grupo', 'grupo')
            .leftJoinAndSelect('grupoAsignaturaDocente.asignatura', 'asignaturaGACE')
            .leftJoinAndSelect('grupo.organizacionEscolar', 'organizacionEscolar')
            .leftJoinAndSelect('organizacionEscolar.turno', 'turno')
            .leftJoinAndSelect('organizacionEscolar.anio_lectivo', 'anio_lectivo')
            .leftJoinAndSelect('grupo.grado', 'grado')
            .leftJoinAndSelect('grupo.seccion', 'seccion');
    }

    // ------------------------------------------------
    // CREATE
    // ------------------------------------------------
    async created(payload: StudentsDto): Promise<StudentEntity> {
        await this.validarUnicidad(payload.identityCard, payload.studentCode);

        const studentData: DeepPartial<StudentEntity> = {
            ...payload,
            gender: payload.gender ? { id: Number(payload.gender) } : undefined,
            pais: payload.pais ? { id: Number(payload.pais) } : undefined,
            municipio: payload.municipio ? { id: Number(payload.municipio) } : undefined,
            departamento: payload.departamento ? { id: Number(payload.departamento) } : undefined,
        };

        const student = this.StudentRepo.create(studentData);
        return await this.StudentRepo.save(student);
    }

    // ------------------------------------------------
    // GET ALL
    // ------------------------------------------------
    async getStudent(): Promise<StudentEntity[]> {
        const qb = this.StudentRepo.createQueryBuilder('student');
        this.baseRelations(qb).where('student.deleted_at IS NULL');
        return await qb.getMany();
    }

    // ------------------------------------------------
    // GET BY ID
    // ------------------------------------------------
    async getStudentById(id: number): Promise<StudentEntity> {
        const qb = this.StudentRepo.createQueryBuilder('student')
            .where('student.id = :id', { id })
            .andWhere('student.deleted_at IS NULL');

        this.baseRelationsWithGroups(qb)
            .leftJoinAndSelect('grupo.docenteGuia', 'DocenteGuia')
            .leftJoinAndSelect('grupo.grupoAsignaturaDocente', 'grupoAsignaturaDocenteDeGrupo')
            .leftJoinAndSelect('grupoAsignaturaDocenteDeGrupo.asignatura', 'asignatura')
            .leftJoinAndSelect('turno.modalidad', 'modalidad')

        return await qb.getOne();
    }

    // ------------------------------------------------
    // UPDATE
    // ------------------------------------------------
    async updateStudent(id: number, payload: UpdateStudentsDto): Promise<StudentEntity> {
        const student = await this.StudentRepo.findOne({
            where: { id },
            relations: ['gender', 'pais', 'departamento', 'municipio'],
        });

        if (!student) throw new NotFoundException("Profesión no encontrada");

        await this.validarUnicidad(
            payload.identityCard ?? student.identityCard,
            payload.studentCode ?? student.studentCode,
            student.id,
        );

        const fotoAnterior = student.profileImage;

        Object.assign(student, payload);
        student.update_at = new Date();
        student.user_update_id = payload.user_update_id;

        const actualizado = await this.StudentRepo.save(student);
        await removeReplacedFile(fotoAnterior, actualizado.profileImage);

        return actualizado;
    }

    // ------------------------------------------------
    // DELETE (soft delete)
    // ------------------------------------------------
    async deleteStudent(id: number, userId: number): Promise<StudentEntity> {
        return await this.StudentRepo.manager.transaction(async (manager) => {
            const student = await manager.getRepository(StudentEntity).findOne({
                where: { id, deleted_at: IsNull() },
            });

            if (!student) throw new NotFoundException("Estudiante no encontrado");

            const deletedAt = new Date();

            await manager
                .getRepository(GrupoAsignaturaConEstudiantes)
                .createQueryBuilder()
                .update(GrupoAsignaturaConEstudiantes)
                .set({
                    activo: false,
                    deleted_at: deletedAt,
                    deleted_at_id: userId,
                    user_update_id: userId,
                    update_at: deletedAt,
                })
                .where('estudianteId = :id', { id })
                .andWhere('deleted_at IS NULL')
                .execute();

            await manager
                .getRepository(EsquelaRow)
                .createQueryBuilder()
                .update(EsquelaRow)
                .set({ deleted_at: deletedAt })
                .where('estudiante_id = :id', { id })
                .andWhere('deleted_at IS NULL')
                .execute();

            student.deleted_at = deletedAt;
            student.deleted_at_id = userId;

            return await manager.getRepository(StudentEntity).save(student);
        });
    }

    // ------------------------------------------------
    // FILTRAR ESTUDIANTES
    // ------------------------------------------------
    async filtrarEstudiantes(params: FiltrarEstudiantesDto, anioId?: string): Promise<any[]> {
        const { name, lastName, studentCode } = params;

        const qb = this.StudentRepo.createQueryBuilder('student');
        this.baseRelationsWithGroups(qb)
            .where('student.deleted_at IS NULL')
            .leftJoinAndSelect('turno.modalidad', 'modalidad');

        if (name) qb.andWhere('student.name ILIKE :name', { name: `%${name}%` });
        if (lastName) qb.andWhere('student.lastName ILIKE :lastName', { lastName: `%${lastName}%` });
        if (studentCode) qb.andWhere('student.studentCode ILIKE :studentCode', { studentCode: `%${studentCode}%` });

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
                ? `${grupoData.grado?.grades ?? ""} ${grupoData.seccion?.seccion ?? ""} - ${grupoData.organizacionEscolar?.turno?.turno ?? ""} - ${grupoData.organizacionEscolar?.turno?.modalidad?.modalidad ?? ""}`.replace(/\s+-\s+-\s+$/, "")
                : null;

            return { ...student, asignadoGrupo: grupoAsignado };
        });
    }
}
