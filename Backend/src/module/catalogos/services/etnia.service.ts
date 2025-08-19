import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Repository } from 'typeorm';
import { Etnia } from '../entities/etnia.entity';
import { Utilities } from '../../../common/helpers/utilities';
import { CreateEtniaDto } from '../dtos/etnia.dto';

@Injectable()
export class EtniaService {
  constructor(
    @InjectRepository(Etnia)
    private etniaRepository: Repository<Etnia>,
  ) { }

  async create(payload: CreateEtniaDto): Promise<Etnia> {
    try {
      const etnia = await this.etniaRepository.create(payload);
      return await this.etniaRepository.save(etnia);
    } catch (error) {
      Utilities.catchError(error);
    }
  }

  async findAll(): Promise<Etnia[]> {
    try {
      const etnia = await this.etniaRepository.find();
      return etnia;
    } catch (error) {
      Utilities.catchError(error);
    }
  }

  async findOne(id: number): Promise<Etnia> {
    try {
      const etnia = await this.etniaRepository.findOne({ where: { id } });
      return etnia;
    } catch (error) {
      Utilities.catchError(error);
    }
  }

  async update(id: number, payload: CreateEtniaDto): Promise<Etnia> {
    try {
      const etnia = await this.etniaRepository.findOne({ where: { id } });
      if (!etnia) {
        throw new NotFoundException('Etnia no encontrada');
      }

      // Actualizar solo los campos enviados, conservando los valores previos
      Object.assign(etnia, payload);

      // Asignar la fecha de actualización y el usuario que modifica
      etnia.update_at = new Date();
      etnia.user_update_id;

      return await this.etniaRepository.save(etnia);
    } catch (error) {
      Utilities.catchError(error);
    }
  }

  async delete(id: number, userId: number): Promise<Etnia> {
    try {
      const etnia = await this.etniaRepository.findOne({ where: { id } });
      if (!etnia) {
        throw new NotFoundException('Etnia no encontrada');
      }

      // Registrar el usuario que eliminó y la fecha de eliminación
      etnia.deleted_at = new Date();
      etnia.deleted_at_id = userId;
      return await this.etniaRepository.save(etnia);
    } catch (error) {
      Utilities.catchError(error);
    }
  }
}
