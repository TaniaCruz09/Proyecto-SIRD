import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Repository } from 'typeorm';
import { Modalidad } from '../entities/modalidad.entity';
import { Utilities } from '../../../common/helpers/utilities';
import { CreateModalidadDto } from '../dtos/modalidad.dto';

@Injectable()
export class ModalidadService {
  constructor(
    @InjectRepository(Modalidad)
    private modalidadRepository: Repository<Modalidad>,
  ) { }

  async create(payload: CreateModalidadDto): Promise<Modalidad> {
    try {
      const modalidad = await this.modalidadRepository.create(payload);
      return await this.modalidadRepository.save(modalidad);
    } catch (error) {
      Utilities.catchError(error);
    }
  }

  async findOne(id: number): Promise<Modalidad> {
    try {
      const modalidad = await this.modalidadRepository.findOne({
        where: { id },
      });
      // if (!modalidad) {
      //   throw new NotFoundException(`modalidad con ID ${id} no encontrado`);
      // }
      return modalidad;
    } catch (error) {
      Utilities.catchError(error);
    }
  }

  async findAll(): Promise<Modalidad[]> {
    try {
      const modalidad = await this.modalidadRepository.find();
      return modalidad;
    } catch (error) {
      Utilities.catchError(error);
    }
  }

  async update(id: number, payload: CreateModalidadDto): Promise<Modalidad> {
    try {
      const modalidad = await this.modalidadRepository.findOne({
        where: { id },
      });
      if (!modalidad) {
        throw new NotFoundException('Modalidad no encotrando');
      }
      // Actualizar solo los campos enviados, conservando los valores previos
      Object.assign(modalidad, payload);

      // Asignar la fecha de actualización y el usuario que modifica
      modalidad.update_at = new Date();
      modalidad.user_update_id;

      return await this.modalidadRepository.save(modalidad);
    } catch (error) {
      Utilities.catchError(error);
    }
  }

  async delete(id: number, userId: number): Promise<Modalidad> {
    try {
      const modalidad = await this.modalidadRepository.findOne({
        where: { id },
      });
      if (!modalidad) {
        throw new NotFoundException('Profesión no encontrada');
      }
      // Registrar el usuario que eliminó y la fecha de eliminación
      modalidad.deleted_at = new Date();
      modalidad.deleted_at_id = userId;

      return await this.modalidadRepository.save(modalidad); // Guardar los cambios
    } catch (error) {
      Utilities.catchError(error);
    }
  }
}
