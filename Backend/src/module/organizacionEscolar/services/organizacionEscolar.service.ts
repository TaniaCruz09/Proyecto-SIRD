import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrganizacionEscolarDTO } from '../dtos/organizacionEscolar.dto';
import { Utilities } from 'src/common/helpers/utilities';
import { Docentes } from 'src/module/docentes/docentes.entity';
import { AnioLectivo, Asignatura, Cortes, Modalidad, Turno } from 'src/module/catalogos';
import { Grupos } from '../entities/grupos.entity';
import { OrganizacionEscolar } from '../entities/organizacionEscolar.entity';

@Injectable()
export class OrganizacionEscolarService {
  constructor(
    @InjectRepository(OrganizacionEscolar)
    private organizacionEscolarRepo: Repository<OrganizacionEscolar>,

    @InjectRepository(Cortes)
    private cortesRepo: Repository<Cortes>,

    @InjectRepository(Turno)
    private turnoRepo: Repository<Turno>,

    @InjectRepository(AnioLectivo)
    private anioRepo: Repository<AnioLectivo>,
  ) { }

  async createOrganizacion(
    createOrganizacionDto: CreateOrganizacionEscolarDTO,
  ): Promise<OrganizacionEscolar> {
    try {
      const {
        anio_lectivo,
        turno,
        corte,
        user_create_id,
      } = createOrganizacionDto;

      const nuevaOrganizacion = this.organizacionEscolarRepo.create({
        anio_lectivo: await this.anioRepo.findOne({ where: { id: anio_lectivo.id } }),

        turno: await this.turnoRepo.findOne(
          { where: { id: turno.id } }
        ),

        corte: await this.cortesRepo.findOne(
          { where: { id: corte.id } }
        ),

        user_create_id,
      });
      return await this.organizacionEscolarRepo.save(nuevaOrganizacion);

    } catch (error) {
      Utilities.catchError(error);
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
        // .leftJoinAndSelect('grupos.turno', 'turno')
        // .leftJoinAndSelect('grupos.modalidad', 'grupo_modalidad')
        .leftJoinAndSelect('grupos.docenteGuia', 'docenteGuia')
        .leftJoinAndSelect('organizacionEscolar.turno', 'turno')
        .leftJoinAndSelect('turno.modalidad', 'modalidad')
        .leftJoinAndSelect('organizacionEscolar.corte', 'corte')
        .leftJoinAndSelect('corte.semestre', 'semestre')
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
        // .leftJoinAndSelect('grupos.turno', 'turno')
        // .leftJoinAndSelect('grupos.modalidad', 'grupo_modalidad')
        .leftJoinAndSelect('grupos.docenteGuia', 'docenteGuia')
        .leftJoinAndSelect('organizacionEscolar.turno', 'turno')
        .leftJoinAndSelect('turno.modalidad', 'modalidad')
        .leftJoinAndSelect('organizacionEscolar.corte', 'corte')
        .leftJoinAndSelect('corte.semestre', 'semestre')
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
        relations: ['anio_lectivo', "turno", "corte"],
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
        relations: ['anio_lectivo', "turno", "corte"],
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
