import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { EsquelaRow } from './esquelas_rows.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Utilities } from 'src/common/helpers/utilities';
import { CreateEsquelaRowDto } from './esquelas_rows.dto';
import { UpdateCalificacioneDto } from './update_esquelas_rows.dto';
import { EsquelaHeadEntity } from '../esquela_head/entities/squela_head.entity';

@Injectable()
export class EsquelaRowService {
    constructor(
        @InjectRepository(EsquelaRow)
        private readonly calificacionRepo: Repository<EsquelaRow>,
        @InjectRepository(EsquelaHeadEntity)
        private readonly esquelaHeadRepo: Repository<EsquelaHeadEntity>,
    ) { }

    private async validateCorteForEsquelaHead(esquelaHeadId: number, corteId: number): Promise<void> {
        const count = await this.esquelaHeadRepo
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

        if (count === 0) {
            throw new BadRequestException('El corte no pertenece al anio lectivo del grupo');
        }
    }

    async create(payload: CreateEsquelaRowDto): Promise<EsquelaRow> {
        try {
            const corteId = payload.corte?.id;
            const esquelaHeadId = payload.esquelaHead?.id;
            if (!corteId || !esquelaHeadId) {
                throw new BadRequestException('Corte y esquela head son requeridos');
            }
            await this.validateCorteForEsquelaHead(esquelaHeadId, corteId);
            const calificacion = await this.calificacionRepo.create(payload)
            return await this.calificacionRepo.save(calificacion)
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    async findAll(): Promise<EsquelaRow[]> {
        try {
            return await this.calificacionRepo.find({
                relations: ['estudiante', 'asignatura']
            })
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    async findOne(id: number): Promise<EsquelaRow> {
        try {
            const calificacion = await this.calificacionRepo.findOne({
                where: { id },
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
                .where('estudiante.id = :estudianteId', { estudianteId })
                .andWhere('anio.anio_lectivo = :anioLectivo', { anioLectivo })
                .getMany();
        } catch (error) {
            Utilities.catchError(error);
        }
    }

    async update(id: number, payload: UpdateCalificacioneDto): Promise<EsquelaRow> {
        try {
            if (payload.corte || payload.esquelaHead) {
                const existing = await this.calificacionRepo.findOne({
                    where: { id },
                    relations: ['corte', 'esquelaHead'],
                });
                const corteId = payload.corte?.id ?? existing?.corte?.id;
                const esquelaHeadId = payload.esquelaHead?.id ?? existing?.esquelaHead?.id;
                if (!corteId || !esquelaHeadId) {
                    throw new BadRequestException('Corte y esquela head son requeridos');
                }
                await this.validateCorteForEsquelaHead(esquelaHeadId, corteId);
            }
            const calificaciones = await this.calificacionRepo.preload({ id, ...payload });
            return await this.calificacionRepo.save(calificaciones)
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    async remove(id: number): Promise<void> {
        try {
            const result = await this.calificacionRepo.delete(id);
        } catch (error) {
            Utilities.catchError(error)
        }
    }
}
