import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrganizacionEscolarDTO } from '../dtos/organizacionEscolar.dto';
import { Utilities } from 'src/common/helpers/utilities';
import { OrganizacionEscolar } from '../entities/organizacionEscolar.entity';

@Injectable()
export class OrganizacionEscolarService {
  constructor(
    @InjectRepository(OrganizacionEscolar)
    private organizacionEscolarRepo: Repository<OrganizacionEscolar>,
  ) { }

  async createOrganizacion(
    payload: CreateOrganizacionEscolarDTO,
  ): Promise<OrganizacionEscolar> {
    try {
      const nuevaOrganizacion = this.organizacionEscolarRepo.create(payload);
      return await this.organizacionEscolarRepo.save(nuevaOrganizacion)
    } catch (error) {
      Utilities.catchError(error)
    }
  }

  async getOrganizacion(): Promise<OrganizacionEscolar[]> {
    try {
      const organizacion = await this.organizacionEscolarRepo
        .createQueryBuilder('organizacionEscolar')
        .leftJoinAndSelect('organizacionEscolar.anio_lectivo', 'anio_lectivo')
        .leftJoinAndSelect('organizacionEscolar.grupos', 'grupos')
        .leftJoinAndSelect('grupos.grado', 'grado')
        .leftJoinAndSelect('grupos.seccion', 'seccion')
        .leftJoinAndSelect('grupos.docenteGuia', 'docenteGuia')
        .leftJoinAndSelect('organizacionEscolar.turno', 'turno')
        .leftJoinAndSelect('turno.modalidad', 'modalidad')
        .orderBy('anio_lectivo.anio_lectivo', 'DESC')
        .getMany();

      return organizacion;
    } catch (error) {
      Utilities.catchError(error);
    }
  }

  async getOrganizacionById(id: number): Promise<OrganizacionEscolar> {
    try {
      const organizacion = await this.organizacionEscolarRepo
        .createQueryBuilder('organizacionEscolar')
        .leftJoinAndSelect('organizacionEscolar.anio_lectivo', 'anio_lectivo')
        .leftJoinAndSelect('organizacionEscolar.grupos', 'grupos')
        .leftJoinAndSelect('grupos.grado', 'grado')
        .leftJoinAndSelect('grupos.seccion', 'seccion')
        .leftJoinAndSelect('grupos.turno', 'grupo_turno')       // alias único
        .leftJoinAndSelect('grupo_turno.modalidad', 'grupo_modalidad')  // alias único
        .leftJoinAndSelect('grupos.docenteGuia', 'docenteGuia')
        .leftJoinAndSelect('grupos.grupoAsignaturaDocente', 'grupoAsignaturaDocente')
        .leftJoinAndSelect('grupoAsignaturaDocente.asignatura', 'asignatura')
        .leftJoinAndSelect('grupoAsignaturaDocente.gruposConEstudiantes', 'gruposConEstudiantes')
        .leftJoinAndSelect('gruposConEstudiantes.estudiante', 'estudiante')
        .leftJoinAndSelect('organizacionEscolar.turno', 'organizacion_turno')
        .leftJoinAndSelect('organizacion_turno.modalidad', 'organizacion_modalidad')
        .where('organizacionEscolar.id = :id', { id })
        .orderBy('anio_lectivo.anio_lectivo', 'DESC')
        .getOne();

      return organizacion ?? null;
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
        relations: ['anio_lectivo', "turno"],
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
        relations: ['anio_lectivo', "turno"],
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
