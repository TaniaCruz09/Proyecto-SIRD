import { Injectable, NotFoundException } from '@nestjs/common';
import { EsquelaRow } from './esquelas_rows.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Utilities } from 'src/common/helpers/utilities';
import { CreateEsquelaRowDto } from './esquelas_rows.dto';
import { UpdateCalificacioneDto } from './update_esquelas_rows.dto';

@Injectable()
export class EsquelaRowService {
    constructor(
        @InjectRepository(EsquelaRow)
        private readonly calificacionRepo: Repository<EsquelaRow>,
    ) { }

    async create(payload: CreateEsquelaRowDto): Promise<EsquelaRow> {
        try {
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
