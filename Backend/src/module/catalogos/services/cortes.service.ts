import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Utilities } from '../../../common/helpers/utilities';
import { Cortes } from '../entities/corte.entity';
import { CreateCortesDto } from '../dtos/create-corte.dto';


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
      const corte = await this.corteRepository.findOne({
        where: { id }, relations: ["semestre"]
      });

      corte.delete_at = new Date();
      corte.delete_at_id = userId;

      return await this.corteRepository.save(corte);
    } catch (error) {
      Utilities.catchError(error);
    }
  }
}
