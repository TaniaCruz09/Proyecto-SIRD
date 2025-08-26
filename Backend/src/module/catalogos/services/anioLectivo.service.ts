import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Utilities } from 'src/common/helpers/utilities';
import { AnioLectivo } from '../entities/anioLectivo.entity';
import { CreateAnioLectivoDTO } from '../dtos/anioLectivo.dto';

@Injectable()
export class AnioLectivoService {
    constructor(
        @InjectRepository(AnioLectivo)
        private anioLectivoRepo: Repository<AnioLectivo>,
    ) { }

    async createAnioLectivo(
        createAnioLectivoDto: CreateAnioLectivoDTO,
    ): Promise<AnioLectivo> {
        try {
            const nuevoAnioLectivo = await this.anioLectivoRepo.create(
                createAnioLectivoDto,
            );
            return await this.anioLectivoRepo.save(nuevoAnioLectivo);
        } catch (error) {
            Utilities.catchError(error);
        }
    }

    async getAnioLectivo(): Promise<AnioLectivo[]> {
        try {
            const anioLectivo = await this.anioLectivoRepo
                .createQueryBuilder("anioLectivo")
                .leftJoinAndSelect("anioLectivo.organizacionEscolar", "organizacionEscolar")
                .leftJoinAndSelect("organizacionEscolar.turno", "turno")
                .leftJoinAndSelect("turno.modalidad", "modalidad")
                .leftJoinAndSelect("organizacionEscolar.cortes", "cortes")
                .leftJoinAndSelect("cortes.semestre", "semestre")
                .orderBy('anioLectivo.anio_lectivo', 'DESC')
                .getMany();
            return anioLectivo;
        } catch (error) {
            Utilities.catchError(error);
        }
    }

    async getOrganizacionEscolarPorAnio(id: number): Promise<AnioLectivo | null> {
        try {
            const anioLectivo = await this.anioLectivoRepo
                .createQueryBuilder("anioLectivo")
                .leftJoinAndSelect("anioLectivo.organizacionEscolar", "organizacionEscolar")
                .leftJoinAndSelect("organizacionEscolar.turno", "turno")
                .leftJoinAndSelect("turno.modalidad", "modalidad")
                .leftJoinAndSelect("organizacionEscolar.cortes", "cortes")
                .leftJoinAndSelect("cortes.semestre", "semestre")
                .leftJoinAndSelect("organizacionEscolar.grupos", "grupos")
                .where("anioLectivo.id = :id", { id })
                .orderBy("anioLectivo.anio_lectivo", "DESC")
                .getOne();

            return anioLectivo ?? null;
        } catch (error) {
            Utilities.catchError(error);
            return null;
        }
    }


    async editAnioLectivo(
        id: number,
        payload: CreateAnioLectivoDTO,
    ): Promise<AnioLectivo> {
        try {
            const anioLectivo = await this.anioLectivoRepo.findOne({
                where: { id },
            });
            if (!anioLectivo) {
                throw new NotFoundException('Año Lectivo no editado');
            }
            // Actualizar solo los campos enviados, conservando los valores previos
            Object.assign(anioLectivo, payload);

            // Asignar la fecha de actualización y el usuario que modifica
            anioLectivo.update_at = new Date();
            anioLectivo.user_update_id;

            return await this.anioLectivoRepo.save(anioLectivo);
        } catch (error) {
            Utilities.catchError(error);
        }
    }

    async deleteAnioLectivo(
        id: number,
        userId: number,
    ): Promise<AnioLectivo> {
        try {
            const anioLectivo = await this.anioLectivoRepo.findOne({
                where: { id },
            });
            if (!anioLectivo) {
                throw new NotFoundException('Año lectivo no eliminado');
            }

            // Registrar el usuario que eliminó y la fecha de eliminación
            anioLectivo.deleted_at = new Date();
            anioLectivo.deleted_at_id = userId;

            return await this.anioLectivoRepo.save(anioLectivo);
        } catch (error) {
            Utilities.catchError(error);
        }
    }
}
