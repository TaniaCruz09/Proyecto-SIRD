import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Utilities } from '../../../common/helpers/utilities';
import { Cortes } from '../entities/corte.entity';
import { CreateCortesDto } from '../dtos/create-corte.dto';
import { EsquelaRow } from '../../calificaciones/esquelas_rows/esquelas_rows.entity';
import { AnioLectivoCorte } from '../entities/anioLectivoCorte.entity';


@Injectable()
export class CortesService {
  constructor(
    @InjectRepository(Cortes)
    private readonly corteRepository: Repository<Cortes>,
  ) { }

  async createcorte(payload: CreateCortesDto): Promise<Cortes> {
    try {
      const corte = await this.corteRepository.create(payload);
      return await this.corteRepository.save(corte);
    } catch (error) {
      Utilities.catchError(error);
    }
  }

  async findOne(id: number): Promise<Cortes> {
    try {
      const corte = await this.corteRepository.findOne({ where: { id }, relations: ["semestre"] });
      return corte;
    } catch (error) {
      Utilities.catchError(error);
    }
  }

  async findAll(): Promise<Cortes[]> {
    try {
      const corte = await this.corteRepository.find({ relations: ["semestre"] });
      return corte;
    } catch (error) {
      Utilities.catchError(error);
    }
  }

  async update(id: number, payload: Partial<Cortes>): Promise<Cortes> {
    try {
      const corte = await this.corteRepository.findOne({
        where: { id }, relations: ["semestre"]
      });

      Object.assign(corte, payload);

      corte.update_at = new Date();
      corte.user_updated_id;

      return await this.corteRepository.save(corte);
    } catch (error) {
      Utilities.catchError(error);
    }
  }

  async delete(id: number, userId: number): Promise<Cortes> {
    try {
      return await this.corteRepository.manager.transaction(async (manager) => {
        const corte = await manager.getRepository(Cortes).findOne({
          where: { id },
          relations: ['semestre'],
        });

        if (!corte) {
          throw new NotFoundException('Corte no encontrado');
        }

        // Elimina las filas de calificaciones asociadas para evitar bloqueos por FK.
        await manager
          .getRepository(EsquelaRow)
          .createQueryBuilder()
          .delete()
          .from(EsquelaRow)
          .where('corte_id = :id', { id })
          .execute();

        // Elimina la relacion con anio lectivo.
        await manager.getRepository(AnioLectivoCorte).delete({ corteId: id });

        corte.delete_at = new Date();
        corte.delete_at_id = userId;

        return await manager.getRepository(Cortes).save(corte);
      });
    } catch (error) {
      Utilities.catchError(error);
    }
  }
}
