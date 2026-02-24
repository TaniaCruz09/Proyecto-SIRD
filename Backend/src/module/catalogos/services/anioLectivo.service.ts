import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Utilities } from 'src/common/helpers/utilities';
import { AnioLectivo } from '../entities/anioLectivo.entity';
import { CreateAnioLectivoDTO } from '../dtos/anioLectivo.dto';
import { Cortes } from '../entities/corte.entity';
import { AnioLectivoCorte } from '../entities/anioLectivoCorte.entity';

@Injectable()
export class AnioLectivoService {
    constructor(
        @InjectRepository(AnioLectivo)
        private anioLectivoRepo: Repository<AnioLectivo>,
        @InjectRepository(AnioLectivoCorte)
        private anioLectivoCorteRepo: Repository<AnioLectivoCorte>,
        @InjectRepository(Cortes)
        private corteRepo: Repository<Cortes>,
    ) { }

    private attachCortes(anioLectivo: AnioLectivo | null): AnioLectivo | null {
        if (!anioLectivo) {
            return null;
        }
        anioLectivo.cortes = anioLectivo.cortesAnioLectivo?.map((item) => item.corte) ?? [];
        delete (anioLectivo as Partial<AnioLectivo>).cortesAnioLectivo;
        return anioLectivo;
    }

    private attachCortesList(anioLectivos: AnioLectivo[]): AnioLectivo[] {
        return anioLectivos.map((item) => this.attachCortes(item)).filter(Boolean) as AnioLectivo[];
    }

    async createAnioLectivo(
        createAnioLectivoDto: CreateAnioLectivoDTO,
    ): Promise<AnioLectivo> {
        try {
            const { cortes, ...anioData } = createAnioLectivoDto;
            const nuevoAnioLectivo = await this.anioLectivoRepo.create(anioData);
            const saved = await this.anioLectivoRepo.save(nuevoAnioLectivo);

            if (Array.isArray(cortes)) {
                await this.replaceCortes(saved.id, cortes);
            }

            return await this.getAnioLectivoById(saved.id);
        } catch (error) {
            Utilities.catchError(error);
        }
    }

    async getAnioLectivo(): Promise<AnioLectivo[]> {
        try {
            const anioLectivo = await this.anioLectivoRepo
                .createQueryBuilder("anio_lectivo")
                .leftJoinAndSelect("anio_lectivo.cortesAnioLectivo", "anioLectivoCorte")
                .leftJoinAndSelect("anioLectivoCorte.corte", "corte")
                .leftJoinAndSelect("corte.semestre", "semestre")
                .leftJoinAndSelect("anio_lectivo.organizacionEscolar", "organizacionEscolar")
                .leftJoinAndSelect("organizacionEscolar.turno", "turno")
                .leftJoinAndSelect("turno.modalidad", "modalidad")
                .orderBy('anio_lectivo.anio_lectivo', 'DESC')
                .getMany();
            return this.attachCortesList(anioLectivo);
        } catch (error) {
            Utilities.catchError(error);
        }
    }

    async getAnioLectivoById(id: number): Promise<AnioLectivo> {
        try {
            const anioLectivo = await this.anioLectivoRepo
                .createQueryBuilder("anio_lectivo")
                .leftJoinAndSelect("anio_lectivo.cortesAnioLectivo", "anioLectivoCorte")
                .leftJoinAndSelect("anioLectivoCorte.corte", "corte")
                .leftJoinAndSelect("corte.semestre", "semestre")
                .leftJoinAndSelect("anio_lectivo.organizacionEscolar", "organizacionEscolar")
                .leftJoinAndSelect("organizacionEscolar.turno", "turno")
                .leftJoinAndSelect("turno.modalidad", "modalidad")
                .leftJoinAndSelect("organizacionEscolar.grupos", "grupos")
                .where("anio_lectivo.id = :id", { id })
                .orderBy("anio_lectivo.anio_lectivo", "DESC")
                .getOne();

            return this.attachCortes(anioLectivo)
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
            const { cortes, ...anioData } = payload;
            const anioLectivo = await this.anioLectivoRepo.findOne({ where: { id } });
            if (!anioLectivo) {
                throw new NotFoundException('Año Lectivo no editado');
            }
            // Actualizar solo los campos enviados, conservando los valores previos
            Object.assign(anioLectivo, anioData);

            // Asignar la fecha de actualización y el usuario que modifica
            anioLectivo.update_at = new Date();
            anioLectivo.user_update_id;

            const saved = await this.anioLectivoRepo.save(anioLectivo);

            if (Array.isArray(cortes)) {
                await this.replaceCortes(saved.id, cortes);
            }

            return await this.getAnioLectivoById(saved.id);
        } catch (error) {
            Utilities.catchError(error);
        }
    }

    async assignCortes(
        id: number,
        cortes: { id: number }[],
    ): Promise<AnioLectivo> {
        try {
            const anioLectivo = await this.anioLectivoRepo.findOne({ where: { id } });
            if (!anioLectivo) {
                throw new NotFoundException('Año Lectivo no encontrado');
            }

            await this.replaceCortes(anioLectivo.id, cortes);

            return await this.getAnioLectivoById(id);
        } catch (error) {
            Utilities.catchError(error);
        }
    }

    private async replaceCortes(anioLectivoId: number, cortes: { id: number }[]): Promise<void> {
        const ids = (cortes ?? []).map((corte) => corte?.id).filter((id) => Number.isFinite(id));
        const uniqueIds = Array.from(new Set(ids));

        await this.anioLectivoCorteRepo.delete({ anioLectivoId });

        if (uniqueIds.length === 0) return;

        const validCortes = await this.corteRepo.find({
            where: { id: In(uniqueIds), delete_at: null },
            select: ['id'],
        });
        const validIds = new Set(validCortes.map((corte) => corte.id));
        if (validIds.size !== uniqueIds.length) {
            throw new BadRequestException('Uno o mas cortes no existen o estan eliminados');
        }

        const rows = Array.from(validIds).map((corteId) =>
            this.anioLectivoCorteRepo.create({
                anioLectivo: { id: anioLectivoId } as AnioLectivo,
                corte: { id: corteId } as Cortes,
            })
        );

        await this.anioLectivoCorteRepo.save(rows);
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
