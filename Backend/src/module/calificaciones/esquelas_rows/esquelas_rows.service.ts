import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { EsquelaRow } from './esquelas_rows.entity';
import { IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateEsquelaRowDto } from './esquelas_rows.dto';
import { UpdateCalificacioneDto } from './update_esquelas_rows.dto';
import { EsquelaHeadEntity } from '../esquela_head/entities/squela_head.entity';
import { AnioLectivoCalendarizacion } from 'src/module/catalogos/entities/anioLectivoCalendarizacion.entity';
import { NotaCualitativaService } from '../nota-cualitativa/nota-cualitativa.service';
import { PromediosService } from '../promedios/promedios.service';
import { nombreCorte } from '../cortes/corte-secuencia';
import * as moment from 'moment-timezone';

@Injectable()
export class EsquelaRowService {
    constructor(
        @InjectRepository(EsquelaRow)
        private readonly calificacionRepo: Repository<EsquelaRow>,
        @InjectRepository(EsquelaHeadEntity)
        private readonly esquelaHeadRepo: Repository<EsquelaHeadEntity>,
        @InjectRepository(AnioLectivoCalendarizacion)
        private readonly anioLectivoCalendarizacionRepo: Repository<AnioLectivoCalendarizacion>,
        private readonly notaCualitativaService: NotaCualitativaService,
        private readonly promediosService: PromediosService,
    ) { }

    /**
     * Deriva la nota cualitativa desde `notaCuantitativa` y, si el cliente
     * envió una, rechaza la petición cuando no coinciden.
     */
    private async resolveNotaCualitativa(
        notaCuantitativa: number | null | undefined,
        notaCualitativaEnviada?: number | null,
    ): Promise<number> {
        if (notaCuantitativa == null || !Number.isFinite(Number(notaCuantitativa))) {
            throw new BadRequestException('La nota cuantitativa es requerida');
        }

        const valor = Number(notaCuantitativa);
        const { cualitativaId, cual } = await this.notaCualitativaService.derivar(valor);

        if (!cualitativaId) {
            throw new BadRequestException(
                `La nota cuantitativa ${valor} no corresponde a ningún rango del catálogo de notas cualitativas`,
            );
        }

        if (notaCualitativaEnviada != null && Number(notaCualitativaEnviada) !== cualitativaId) {
            throw new BadRequestException(
                `La nota cualitativa enviada no corresponde a la nota cuantitativa; se esperaba ${cual}`,
            );
        }

        return cualitativaId;
    }

    private isMissingPeriodoTableError(error: unknown): boolean {
        const message = (error as { message?: string })?.message ?? '';
        return (
            message.includes('catalogos.periodo_lectivo') ||
            message.includes('periodo_lectivo_corte')
        );
    }

    private parseRawBoolean(value: unknown): boolean {
        return value === true || value === 'true' || value === 't' || value === 1 || value === '1';
    }

    private async validateCorteForEsquelaHead(esquelaHeadId: number, corteId: number): Promise<void> {
        let count = 0;

        try {
            count = await this.esquelaHeadRepo
                .createQueryBuilder('head')
                .leftJoin('head.grupo_asignatura', 'grupo')
                .leftJoin('grupo.organizacionEscolar', 'org')
                .leftJoin('org.anio_lectivo', 'anio')
                .leftJoin('anio.cortesAnioLectivo', 'anioLectivoCorte')
                .leftJoin('anioLectivoCorte.corte', 'corte')
                .leftJoin('anio.periodosLectivos', 'periodoLectivo')
                .leftJoin('periodoLectivo.cortesPeriodo', 'periodoLectivoCorte')
                .leftJoin('periodoLectivoCorte.corte', 'cortePeriodo')
                .where('head.id = :esquelaHeadId', { esquelaHeadId })
                .andWhere('(corte.id = :corteId OR cortePeriodo.id = :corteId)', { corteId })
                .andWhere('(corte.delete_at IS NULL OR cortePeriodo.delete_at IS NULL)')
                .getCount();
        } catch (error) {
            if (!this.isMissingPeriodoTableError(error)) {
                throw error;
            }

            count = await this.esquelaHeadRepo
                .createQueryBuilder('head')
                .leftJoin('head.grupo_asignatura', 'grupo')
                .leftJoin('grupo.organizacionEscolar', 'org')
                .leftJoin('org.anio_lectivo', 'anio')
                .leftJoin('anio.cortesAnioLectivo', 'anioLectivoCorte')
                .leftJoin('anioLectivoCorte.corte', 'corte')
                .where('head.id = :esquelaHeadId', { esquelaHeadId })
                .andWhere('corte.id = :corteId', { corteId })
                .andWhere('corte.delete_at IS NULL')
                .getCount();
        }

        if (count === 0) {
            throw new BadRequestException('El corte no pertenece al anio lectivo del grupo');
        }
    }

    private async loadContexto(esquelaHeadId: number) {
        return await this.esquelaHeadRepo
            .createQueryBuilder('head')
            .leftJoin('head.grupo_asignatura', 'grupo')
            .leftJoin('grupo.organizacionEscolar', 'org')
            .leftJoin('org.anio_lectivo', 'anio')
            .leftJoin('org.turno', 'turno')
            .leftJoin('turno.modalidad', 'modalidad')
            .select('anio.id', 'anioLectivoId')
            .addSelect('anio.is_active', 'anioActivo')
            .addSelect('modalidad.id', 'modalidadId')
            .where('head.id = :esquelaHeadId', { esquelaHeadId })
            .getRawOne<{ anioLectivoId?: number; anioActivo?: boolean; modalidadId?: number }>();
    }

    private async isCorteCerradoPorFecha(
        anioLectivoId: number,
        modalidadId: number,
        corteId: number,
    ): Promise<boolean> {
        const calendarizacion = await this.anioLectivoCalendarizacionRepo.findOne({
            where: {
                anioLectivoId,
                modalidadId,
                corteId,
                isActive: true,
                delete_at: IsNull(),
            },
        });

        if (!calendarizacion?.fecha_fin) {
            return false;
        }

        const hoy = moment().tz('America/Managua').format('YYYY-MM-DD');
        return hoy > calendarizacion.fecha_fin;
    }

    /** Estudiantes activos del grupo en una asignatura. */
    private async getEstudiantesActivosDelGrupo(
        esquelaHeadId: number,
        asignaturaId: number,
    ): Promise<number[]> {
        const filas = await this.esquelaHeadRepo
            .createQueryBuilder('head')
            .leftJoin('head.grupo_asignatura', 'grupo')
            .leftJoin('grupo.grupoAsignaturaDocente', 'gad', 'gad.asignatura_id = :asignaturaId', {
                asignaturaId,
            })
            .leftJoin('gad.gruposConEstudiantes', 'gce', 'gce.activo = true')
            .leftJoin('gce.estudiante', 'estudiante')
            .select('DISTINCT estudiante.id', 'estudianteId')
            .where('head.id = :esquelaHeadId', { esquelaHeadId })
            .andWhere('gad.deleted_at IS NULL')
            .getRawMany<{ estudianteId: number }>();

        return filas
            .map((fila) => Number(fila.estudianteId))
            .filter((id) => Number.isFinite(id) && id > 0);
    }

    private async isCorteCompleto(
        esquelaHeadId: number,
        asignaturaId: number,
        corteId: number,
    ): Promise<boolean> {
        const estudiantes = await this.getEstudiantesActivosDelGrupo(esquelaHeadId, asignaturaId);
        if (estudiantes.length === 0) {
            return true;
        }

        const filas = await this.calificacionRepo.find({
            where: {
                deleted_at: IsNull(),
                esquelaHead: { id: esquelaHeadId },
                asignatura: { id: asignaturaId },
                corte: { id: corteId },
            },
            relations: ['estudiante'],
        });

        const calificados = new Set(
            filas
                .map((fila) => Number(fila.estudiante?.id))
                .filter((id) => Number.isFinite(id) && id > 0),
        );

        return estudiantes.every((id) => calificados.has(id));
    }

    /**
     * No se puede avanzar a un corte si el anterior sigue abierto y le faltan
     * notas (misma regla que la pantalla de captura).
     */
    private async validarSecuenciaCorte(
        esquelaHeadId: number,
        corteId: number,
        asignaturaId?: number,
    ): Promise<void> {
        if (!asignaturaId) {
            return;
        }

        const { cortes } = await this.promediosService.cortesDeEsquela(esquelaHeadId);
        const indice = cortes.findIndex((corte) => Number(corte.id) === Number(corteId));
        if (indice <= 0) {
            return;
        }

        const corteAnterior = cortes[indice - 1];
        const contexto = await this.loadContexto(esquelaHeadId);

        if (contexto?.anioLectivoId && contexto?.modalidadId) {
            const cerrado = await this.isCorteCerradoPorFecha(
                Number(contexto.anioLectivoId),
                Number(contexto.modalidadId),
                Number(corteAnterior.id),
            );
            if (cerrado) {
                return;
            }
        }

        const completo = await this.isCorteCompleto(esquelaHeadId, asignaturaId, corteAnterior.id);
        if (completo) {
            return;
        }

        throw new BadRequestException(
            `Completa el ${nombreCorte(corteAnterior)} antes de registrar notas en el ${nombreCorte(cortes[indice])}`,
        );
    }

    private async validateCorteEditableForEsquelaHead(esquelaHeadId: number, corteId: number): Promise<void> {
        await this.validateCorteForEsquelaHead(esquelaHeadId, corteId);

        const contexto = await this.loadContexto(esquelaHeadId);

        if (!contexto?.anioLectivoId) {
            throw new BadRequestException('No se encontro el anio lectivo asociado a la esquela');
        }

        if (!this.parseRawBoolean(contexto.anioActivo)) {
            throw new BadRequestException('El anio lectivo esta inactivo; no se pueden guardar notas');
        }

        if (!contexto?.modalidadId) {
            throw new BadRequestException('No se encontro la modalidad asociada al grupo');
        }

        const calendarizacion = await this.anioLectivoCalendarizacionRepo.findOne({
            where: {
                anioLectivoId: Number(contexto.anioLectivoId),
                modalidadId: Number(contexto.modalidadId),
                corteId,
                delete_at: IsNull(),
            },
        });

        if (!calendarizacion || !this.parseRawBoolean(calendarizacion.isActive)) {
            throw new BadRequestException(
                'El corte no esta habilitado en la calendarizacion del anio lectivo',
            );
        }

        if (!calendarizacion.fecha_inicio || !calendarizacion.fecha_fin) {
            throw new BadRequestException(
                'El corte no tiene fechas configuradas en la calendarizacion del anio lectivo',
            );
        }

        const hoy = moment().tz('America/Managua').format('YYYY-MM-DD');

        if (hoy < calendarizacion.fecha_inicio) {
            throw new BadRequestException('El corte aun no esta habilitado por fecha');
        }

        if (hoy > calendarizacion.fecha_fin) {
            throw new BadRequestException('El corte esta cerrado por fecha. Solicita al administrador ampliar el rango del calendario si necesitas mas tiempo');
        }
    }

    async create(payload: CreateEsquelaRowDto): Promise<EsquelaRow> {
        const corteId = payload.corte?.id;
        const esquelaHeadId = payload.esquelaHead?.id;
        if (!corteId || !esquelaHeadId) {
            throw new BadRequestException('Corte y esquela head son requeridos');
        }

        const notaCualitativaId = await this.resolveNotaCualitativa(
            payload.notaCuantitativa,
            payload.notaCualitativa?.id,
        );

        await this.validateCorteEditableForEsquelaHead(esquelaHeadId, corteId);
        await this.validarSecuenciaCorte(esquelaHeadId, corteId, payload.asignatura?.id);

        const calificacion = this.calificacionRepo.create({
            ...payload,
            notaCualitativa: { id: notaCualitativaId },
        });
        const guardada = await this.calificacionRepo.save(calificacion);

        await this.promediosService.recalcularAsignatura(
            esquelaHeadId,
            Number(payload.estudiante?.id),
            Number(payload.asignatura?.id),
        );

        return guardada.id ? (await this.findOne(guardada.id)) ?? guardada : guardada;
    }

    async findAll(): Promise<EsquelaRow[]> {
        return await this.calificacionRepo.find({
            where: { deleted_at: IsNull() },
            relations: ['estudiante', 'asignatura', 'notaCualitativa']
        })
    }

    async findOne(id: number): Promise<EsquelaRow> {
        const calificacion = await this.calificacionRepo.findOne({
            where: { id, deleted_at: IsNull() },
            relations: ['estudiante', 'asignatura', 'notaCualitativa']
        })
        return calificacion;
    }

    async findCalificacionesByEstudianteAndAnio(
        estudianteId: number,
        anioLectivo: number,
    ): Promise<EsquelaRow[]> {
        return await this.calificacionRepo
            .createQueryBuilder('row')
            .leftJoinAndSelect('row.estudiante', 'estudiante')
            .leftJoinAndSelect('row.asignatura', 'asignatura')
            .leftJoinAndSelect('row.notaCualitativa', 'notaCualitativa')
            .leftJoinAndSelect('row.corte', 'corte')
            .leftJoinAndSelect('row.esquelaHead', 'head')
            .leftJoinAndSelect('head.grupo_asignatura', 'grupo')
            .leftJoinAndSelect('grupo.grado', 'grado')
            .leftJoinAndSelect('grupo.seccion', 'seccion')
            .leftJoinAndSelect('grupo.organizacionEscolar', 'org')
            .leftJoinAndSelect('org.anio_lectivo', 'anio')
            .where('row.deleted_at IS NULL')
            .andWhere('estudiante.id = :estudianteId', { estudianteId })
            .andWhere('anio.anio_lectivo = :anioLectivo', { anioLectivo })
            .getMany();
    }

    async update(id: number, payload: UpdateCalificacioneDto): Promise<EsquelaRow> {
        const existing = await this.calificacionRepo.findOne({
            where: { id, deleted_at: IsNull() },
            relations: ['corte', 'esquelaHead', 'asignatura', 'estudiante'],
        });

        if (!existing) {
            throw new NotFoundException('Calificación no encontrada');
        }

        const corteId = payload.corte?.id ?? existing.corte?.id;
        const esquelaHeadId = payload.esquelaHead?.id ?? existing.esquelaHead?.id;
        if (!corteId || !esquelaHeadId) {
            throw new BadRequestException('Corte y esquela head son requeridos');
        }

        const notaCualitativaId = await this.resolveNotaCualitativa(
            payload.notaCuantitativa ?? existing.notaCuantitativa,
            payload.notaCualitativa?.id,
        );

        await this.validateCorteEditableForEsquelaHead(esquelaHeadId, corteId);
        await this.validarSecuenciaCorte(
            esquelaHeadId,
            corteId,
            payload.asignatura?.id ?? existing.asignatura?.id,
        );

        const calificaciones = await this.calificacionRepo.preload({
            id,
            ...payload,
            notaCualitativa: { id: notaCualitativaId },
        });
        if (!calificaciones || calificaciones.deleted_at) {
            throw new NotFoundException('Calificación no encontrada');
        }

        const guardada = await this.calificacionRepo.save(calificaciones);

        const estudianteAnterior = Number(existing.estudiante?.id);
        const asignaturaAnterior = Number(existing.asignatura?.id);
        const estudianteId = Number(payload.estudiante?.id ?? estudianteAnterior);
        const asignaturaId = Number(payload.asignatura?.id ?? asignaturaAnterior);

        await this.promediosService.recalcularAsignatura(
            esquelaHeadId,
            estudianteId,
            asignaturaId,
        );

        if (estudianteId !== estudianteAnterior || asignaturaId !== asignaturaAnterior) {
            await this.promediosService.recalcularAsignatura(
                esquelaHeadId,
                estudianteAnterior,
                asignaturaAnterior,
            );
        }

        return guardada.id ? (await this.findOne(guardada.id)) ?? guardada : guardada;
    }

    async remove(id: number): Promise<{ message: string }> {
        const existente = await this.calificacionRepo.findOne({
            where: { id, deleted_at: IsNull() },
            relations: ['esquelaHead', 'estudiante', 'asignatura'],
        });
        if (!existente) {
            throw new NotFoundException('Calificación no encontrada');
        }

        await this.calificacionRepo.softDelete(id);

        await this.promediosService.recalcularAsignatura(
            Number(existente.esquelaHead?.id),
            Number(existente.estudiante?.id),
            Number(existente.asignatura?.id),
        );

        return { message: 'Calificación eliminada correctamente' };
    }
}
