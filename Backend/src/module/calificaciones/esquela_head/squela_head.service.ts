import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EsquelaHeadEntity } from "./entities/squela_head.entity";
import { EsquelaHeadDto } from "./dto/esquela_head.dto";
import { CorteEstadoService, CortesEstado } from "../cortes/corte-estado.service";

export type EsquelaHeadConEstado = EsquelaHeadEntity & { cortesEstado?: CortesEstado };

@Injectable()
export class EsquelaHeadService {
    constructor(
        @InjectRepository(EsquelaHeadEntity)
        private esquelaHeadRepository: Repository<EsquelaHeadEntity>,
        private readonly corteEstadoService: CorteEstadoService,
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
            .leftJoinAndSelect("organizacionEscolar.turno", "turnoOrganizacion")
            .leftJoinAndSelect("turnoOrganizacion.modalidad", "modalidad")
            .leftJoinAndSelect("grupo.grado", "grado")
            .leftJoinAndSelect("grupo.seccion", "seccion")
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
            .leftJoinAndSelect("esquelaRow.notaCualitativa", "notaCualitativaEsquelaRow")
            .leftJoinAndSelect("esquelaRow.corte", "corteEsquelaRow")
            .where("esquelaHead.id = :id", { id });

        if (includePeriodos) {
            query
                .leftJoinAndSelect('anio_lectivo.periodosLectivos', 'periodoLectivo')
                .leftJoinAndSelect('periodoLectivo.cortesPeriodo', 'periodoLectivoCorte')
                .leftJoinAndSelect('periodoLectivoCorte.corte', 'cortePeriodo');
        }

        return query;
    }

    async create(Payload: EsquelaHeadDto): Promise<EsquelaHeadEntity> {
        const esquelaHead = await this.esquelaHeadRepository.create(Payload)
        return await this.esquelaHeadRepository.save(esquelaHead);
    }

    async findOne(id: number): Promise<EsquelaHeadConEstado> {
        let esquelaHead: EsquelaHeadEntity;
        try {
            esquelaHead = await this.buildFindOneQuery(id, true).getOne();
        } catch (error) {
            if (!this.isMissingPeriodoTableError(error)) {
                throw error;
            }

            esquelaHead = await this.buildFindOneQuery(id, false).getOne();
        }

        if (!esquelaHead) {
            throw new NotFoundException('Esquela no encontrada');
        }

        // Estado de cada corte calculado con las reglas y la zona horaria del backend
        const cortesEstado = await this.corteEstadoService.estadoDeEsquela(esquelaHead);
        return Object.assign(esquelaHead, { cortesEstado });
    }

    async findAll(): Promise<EsquelaHeadEntity[]> {
        const esquelaHead = await this.esquelaHeadRepository.find({ relations: ["grupo_asignatura", 'grupo_asignatura.grupoAsignaturaDocente.asignatura', "esquelaRow"] });
        return esquelaHead;
    }

    async findByGrupo(grupoId: number) {
        const esquelaHead = await this.esquelaHeadRepository.findOne({
            where: {
                grupo_asignatura: { id: grupoId },
            },
            relations: ['grupo_asignatura'], // opcional si necesitas traer la relación
        })

        return esquelaHead
    }

    async update(id: number, payload: Partial<EsquelaHeadEntity>): Promise<EsquelaHeadEntity> {
        const esquelaHead = await this.esquelaHeadRepository.findOne({
            where: { id }, relations: ["grupo_asignatura"]
        });

        Object.assign(esquelaHead, payload);

        esquelaHead.update_at = new Date();
        esquelaHead.user_create_id;

        return await this.esquelaHeadRepository.save(esquelaHead);
    }

    async delete(id: number, userId: number): Promise<EsquelaHeadEntity> {
        const esquelaHead = await this.esquelaHeadRepository.findOne({
            where: { id }, relations: ["grupo_asignatura"]
        });

        if (!esquelaHead) {
            throw new NotFoundException('Esquela no encontrada');
        }

        esquelaHead.deleted_at = new Date()
        esquelaHead.deleted_at_id = userId;

        return await this.esquelaHeadRepository.save(esquelaHead)
    }
}