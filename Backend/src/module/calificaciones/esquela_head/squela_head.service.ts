import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Utilities } from "../../../common/helpers/utilities";
import { EsquelaHeadEntity } from "./entities/squela_head.entity";
import { EsquelaHeadDto } from "./dto/esquela_head.dto";
@Injectable()
export class EsquelaHeadService {
    constructor(
        @InjectRepository(EsquelaHeadEntity)
        private esquelaHeadRepository: Repository<EsquelaHeadEntity>,
    ) { }

    private isMissingPeriodoTableError(error: unknown): boolean {
        const message = (error as { message?: string })?.message ?? '';
        return (
            message.includes('catalogos.periodo_lectivo') ||
            message.includes('periodo_lectivo_corte')
        );
    }

    private buildFindOneQuery(id: number, includePeriodos: boolean) {
        const query = this.esquelaHeadRepository
            .createQueryBuilder("esquelaHead")
            .leftJoinAndSelect("esquelaHead.grupo_asignatura", "grupo")
            .leftJoinAndSelect("grupo.organizacionEscolar", "organizacionEscolar")
            .leftJoinAndSelect("organizacionEscolar.anio_lectivo", "anio_lectivo")
            .leftJoinAndSelect("anio_lectivo.cortesAnioLectivo", "anioLectivoCorte")
            .leftJoinAndSelect("anioLectivoCorte.corte", "corteAnioLectivo")
            .leftJoinAndSelect("corteAnioLectivo.semestre", "semestreAnioLectivo")
            .leftJoinAndSelect("organizacionEscolar.turno", "turnoOrganizacion")
            .leftJoinAndSelect("grupo.grado", "grado")
            .leftJoinAndSelect("grupo.seccion", "seccion")
            .leftJoinAndSelect("grupo.turno", "turno")
            .leftJoinAndSelect("turno.modalidad", "modalidad")
            .leftJoinAndSelect("grupo.docenteGuia", "docenteGuia")
            .leftJoinAndSelect("grupo.grupoAsignaturaDocente", "grupoAsignaturaDocente")
            .leftJoinAndSelect("grupoAsignaturaDocente.asignatura", "asignatura")
            .leftJoinAndSelect("grupoAsignaturaDocente.docente", "docente")
            .leftJoinAndSelect("grupoAsignaturaDocente.gruposConEstudiantes", "gruposConEstudiantes")
            .leftJoinAndSelect("gruposConEstudiantes.estudiante", "estudiante")
            .leftJoinAndSelect("estudiante.gender", "gender")
            .leftJoinAndSelect("esquelaHead.esquelaRow", "esquelaRow")
            .leftJoinAndSelect("esquelaRow.estudiante", "estudianteEsquelaRow")
            .leftJoinAndSelect("esquelaRow.asignatura", "asignaturaEsquelaRow")
            .leftJoinAndSelect("esquelaRow.corte", "corteEsquelaRow")
            .where("esquelaHead.id = :id", { id });

        if (includePeriodos) {
            query
                .leftJoinAndSelect('anio_lectivo.periodosLectivos', 'periodoLectivo')
                .leftJoinAndSelect('periodoLectivo.cortesPeriodo', 'periodoLectivoCorte')
                .leftJoinAndSelect('periodoLectivoCorte.corte', 'cortePeriodo')
                .leftJoinAndSelect('cortePeriodo.semestre', 'semestreCortePeriodo');
        }

        return query;
    }

    async create(Payload: EsquelaHeadDto): Promise<EsquelaHeadEntity> {
        try {
            const esquelaHead = await this.esquelaHeadRepository.create(Payload)
            return await this.esquelaHeadRepository.save(esquelaHead);
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    async findOne(id: number): Promise<EsquelaHeadEntity> {
        try {
            let esquelaHead: EsquelaHeadEntity;
            try {
                esquelaHead = await this.buildFindOneQuery(id, true).getOne();
            } catch (error) {
                if (!this.isMissingPeriodoTableError(error)) {
                    throw error;
                }

                esquelaHead = await this.buildFindOneQuery(id, false).getOne();
            }

            // .findOne({ where: { id }, relations: ["grupo_asignatura", 'grupo_asignatura.grupoAsignaturaDocente.asignatura'] });
            return esquelaHead;
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    async findAll(): Promise<EsquelaHeadEntity[]> {
        try {
            const esquelaHead = await this.esquelaHeadRepository.find({ relations: ["grupo_asignatura", 'grupo_asignatura.grupoAsignaturaDocente.asignatura', "esquelaRow"] });
            return esquelaHead;
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    async findByGrupo(grupoId: number) {
        try {
            const esquelaHead = await this.esquelaHeadRepository.findOne({
                where: {
                    grupo_asignatura: { id: grupoId },
                },
                relations: ['grupo_asignatura'], // opcional si necesitas traer la relación
            })

            return esquelaHead
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    async update(id: number, payload: Partial<EsquelaHeadEntity>): Promise<EsquelaHeadEntity> {
        try {
            const esquelaHead = await this.esquelaHeadRepository.findOne({
                where: { id }, relations: ["grupo_asignatura"]
            });

            Object.assign(esquelaHead, payload);

            esquelaHead.update_at = new Date();
            esquelaHead.user_create_id;

            return await this.esquelaHeadRepository.save(esquelaHead);
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    async delete(id: number, userId: number): Promise<EsquelaHeadEntity> {
        try {
            const esquelaHead = await this.esquelaHeadRepository.findOne({
                where: { id }, relations: ["grupo_asignatura"]
            });

            esquelaHead.deleted_at = new Date()
            esquelaHead.deleted_at_id = userId;

            return await this.esquelaHeadRepository.save(esquelaHead)
        } catch (error) {
            Utilities.catchError(error)
        }
    }
}