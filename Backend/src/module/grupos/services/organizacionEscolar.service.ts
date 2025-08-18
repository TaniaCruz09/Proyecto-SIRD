import { Injectable, NotFoundException } from '@nestjs/common';
import { OrganizacionEscolar } from '../entities/organizacionEscolar.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrganizacionEscolarDTO } from '../dtos/organizacionEscolar.dto';
import { Utilities } from 'src/common/helpers/utilities';

@Injectable()
export class OrganizacionEscolarService {
  constructor(
    @InjectRepository(OrganizacionEscolar)
    private organizacionEscolarRepo: Repository<OrganizacionEscolar>,
  ) {}

  async createOrganizacion(
    createOrganizacionDto: CreateOrganizacionEscolarDTO,
  ): Promise<OrganizacionEscolar> {
    try {
      const nuevaOrganizacion = await this.organizacionEscolarRepo.create(
        createOrganizacionDto,
      );
      return await this.organizacionEscolarRepo.save(nuevaOrganizacion);
    } catch (error) {
      Utilities.catchError(error);
    }
  }

  async getOrganizacion(): Promise<OrganizacionEscolar[]> {
    try {
      const organizacion = await this.organizacionEscolarRepo.find({
        relations: ['grupo'],
      });
      return organizacion;
    } catch (error) {
      Utilities.catchError(error);
    }
  }
  async getOrganizacionById(id: number): Promise<OrganizacionEscolar> {
    try {
      const organizacion = await this.organizacionEscolarRepo.findOne({
        where: { id },
        relations: ['grupo'],
      });
      return organizacion;
    } catch (error) {
      Utilities.catchError(error);
    }
  }

  async editOrganizacion(
    id: number,
    payload: CreateOrganizacionEscolarDTO,
  ): Promise<OrganizacionEscolar> {
    try {
      const organizacion = await this.organizacionEscolarRepo.findOne({
        where: { id },
        relations: ['grupo'],
      });
      if (!organizacion) {
        throw new NotFoundException('Organizacion Escolar no encontrada');
      }
      // Actualizar solo los campos enviados, conservando los valores previos
      Object.assign(organizacion, payload);

      // Asignar la fecha de actualización y el usuario que modifica
      organizacion.update_at = new Date();
      organizacion.user_update_id;

      return await this.organizacionEscolarRepo.save(organizacion);
    } catch (error) {
      Utilities.catchError(error);
    }
  }

  async deleteOrganizacion(
    id: number,
    userId: number,
  ): Promise<OrganizacionEscolar> {
    try {
      const organizacion = await this.organizacionEscolarRepo.findOne({
        where: { id },
        relations: ['grupo'],
      });
      if (!organizacion) {
        throw new NotFoundException('Organizacion escolar no encontrada');
      }

      // Registrar el usuario que eliminó y la fecha de eliminación
      organizacion.deleted_at = new Date();
      organizacion.deleted_at_id = userId;

      return await this.organizacionEscolarRepo.save(organizacion);
    } catch (error) {
      Utilities.catchError(error);
    }
  }
}
