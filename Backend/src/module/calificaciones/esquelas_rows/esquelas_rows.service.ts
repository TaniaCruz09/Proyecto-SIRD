import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { EsquelaRow } from './esquelas_rows.entity';
import { IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Utilities } from 'src/common/helpers/utilities';
import { CreateEsquelaRowDto } from './esquelas_rows.dto';
import { UpdateCalificacioneDto } from './update_esquelas_rows.dto';
import { EsquelaHeadEntity } from '../esquela_head/entities/squela_head.entity';
import { AnioLectivoCalendarizacion } from 'src/module/catalogos/entities/anioLectivoCalendarizacion.entity';
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
    ) { }

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

    private async validateCorteEditableForEsquelaHead(esquelaHeadId: number, corteId: number): Promise<void> {
        await this.validateCorteForEsquelaHead(esquelaHeadId, corteId);

        const contexto = await this.esquelaHeadRepo
            .createQueryBuilder('head')
            .leftJoin('head.grupo_asignatura', 'grupo')
            .leftJoin('grupo.organizacionEscolar', 'org')
            .leftJoin('org.anio_lectivo', 'anio')
            .leftJoin('grupo.turno', 'turno')
            .leftJoin('turno.modalidad', 'modalidad')
            .select('anio.id', 'anioLectivoId')
            .addSelect('anio.is_active', 'anioActivo')
            .addSelect('modalidad.id', 'modalidadId')
            .where('head.id = :esquelaHeadId', { esquelaHeadId })
            .getRawOne<{ anioLectivoId?: number; anioActivo?: boolean; modalidadId?: number }>();

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
                isActive: true,
                delete_at: IsNull(),
            },
        });

        if (!calendarizacion?.fecha_inicio || !calendarizacion?.fecha_fin) {
            return;
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
        try {
            const corteId = payload.corte?.id;
            const esquelaHeadId = payload.esquelaHead?.id;
            if (!corteId || !esquelaHeadId) {
                throw new BadRequestException('Corte y esquela head son requeridos');
            }
            await this.validateCorteEditableForEsquelaHead(esquelaHeadId, corteId);
            const calificacion = await this.calificacionRepo.create(payload)
            return await this.calificacionRepo.save(calificacion)
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    async findAll(): Promise<EsquelaRow[]> {
        try {
            return await this.calificacionRepo.find({
                where: { deleted_at: IsNull() },
                relations: ['estudiante', 'asignatura']
            })
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    async findOne(id: number): Promise<EsquelaRow> {
        try {
            const calificacion = await this.calificacionRepo.findOne({
                where: { id, deleted_at: IsNull() },
                relations: ['estudiante', 'asignatura']
            })
            return calificacion;
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    async findCalificacionesByEstudianteAndAnio(
        estudianteId: number,
        anioLectivo: number,
    ): Promise<EsquelaRow[]> {
        try {
            return await this.calificacionRepo
                .createQueryBuilder('row')
                .leftJoinAndSelect('row.estudiante', 'estudiante')
                .leftJoinAndSelect('row.asignatura', 'asignatura')
                .leftJoinAndSelect('row.corte', 'corte')
                .leftJoinAndSelect('row.esquelaHead', 'head')
                .leftJoinAndSelect('head.grupo_asignatura', 'grupo')
                .leftJoinAndSelect('grupo.organizacionEscolar', 'org')
                .leftJoinAndSelect('org.anio_lectivo', 'anio')
                .where('row.deleted_at IS NULL')
                .andWhere('estudiante.id = :estudianteId', { estudianteId })
                .andWhere('anio.anio_lectivo = :anioLectivo', { anioLectivo })
                .getMany();
        } catch (error) {
            Utilities.catchError(error);
        }
    }

    async update(id: number, payload: UpdateCalificacioneDto): Promise<EsquelaRow> {
        try {
            const existing = await this.calificacionRepo.findOne({
                where: { id, deleted_at: IsNull() },
                relations: ['corte', 'esquelaHead'],
            });

            if (!existing) {
                throw new NotFoundException('Calificación no encontrada');
            }

            const corteId = payload.corte?.id ?? existing.corte?.id;
            const esquelaHeadId = payload.esquelaHead?.id ?? existing.esquelaHead?.id;
            if (!corteId || !esquelaHeadId) {
                throw new BadRequestException('Corte y esquela head son requeridos');
            }

            await this.validateCorteEditableForEsquelaHead(esquelaHeadId, corteId);

            const calificaciones = await this.calificacionRepo.preload({ id, ...payload });
            if (!calificaciones || calificaciones.deleted_at) {
                throw new NotFoundException('Calificación no encontrada');
            }
            return await this.calificacionRepo.save(calificaciones)
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    async remove(id: number): Promise<void> {
        try {
            await this.calificacionRepo.softDelete(id);
        } catch (error) {
            Utilities.catchError(error)
        }
    }
}
