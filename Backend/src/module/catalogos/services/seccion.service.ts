import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Repository } from 'typeorm';
import { Seccion } from '../entities/seccion.entity';
import { CreateSeccionDTO } from '../dtos/seccion.dto';

@Injectable()
export class SeccionService {
  constructor(
    @InjectRepository(Seccion)
    private seccionRepository: Repository<Seccion>,
  ) {}

  async create(payload: CreateSeccionDTO): Promise<Seccion> {
    const seccion = await this.seccionRepository.create(payload);
    return await this.seccionRepository.save(seccion);
  }

  async findAll(): Promise<Seccion[]> {
    const seccion = await this.seccionRepository.find({relations: ['grupos']});
    return seccion;
  }

  async findOne(id: number): Promise<Seccion> {
    const seccion = await this.seccionRepository.findOne({ where: { id }, relations: ['grupos'] });
    return seccion;
  }

  async update(id: number, payload: CreateSeccionDTO): Promise<Seccion> {
    const seccion = await this.seccionRepository.findOne({ where: { id },relations: ['grupos'] });
    if (!seccion) {
      throw new NotFoundException('Seccion no encontrada');
    }
    // Actualizar solo los campos enviados, conservando los valores previos
    Object.assign(seccion, payload);

    // Asignar la fecha de actualización y el usuario que modifica
    seccion.update_at = new Date();
    seccion.user_update_id;
    return await this.seccionRepository.save(seccion);
  }

  async delete(id: number, userId: number): Promise<Seccion> {
    const seccion = await this.seccionRepository.findOne({ where: { id } ,relations: ['grupos']});
    if (!seccion) {
      throw new NotFoundException('Profesión no encontrada');
    }

    // Registrar el usuario que eliminó y la fecha de eliminación
    seccion.deleted_at = new Date();
    seccion.deleted_at_id = userId;

    return await this.seccionRepository.save(seccion);
  }
}
